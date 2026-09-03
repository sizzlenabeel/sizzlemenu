-- Allow a campaign to target one exact product. Its starts_at and ends_at
-- timestamps control the campaign duration just as they do for category deals.

-- The repository does not contain the original products table migration, so
-- copy the deployed type of products.id instead of assuming uuid or text.
DO $migration$
DECLARE
  product_id_type text;
BEGIN
  SELECT format_type(attribute.atttypid, attribute.atttypmod)
    INTO product_id_type
  FROM pg_attribute attribute
  WHERE attribute.attrelid = 'public.products'::regclass
    AND attribute.attname = 'id'
    AND NOT attribute.attisdropped;

  IF product_id_type IS NULL THEN
    RAISE EXCEPTION 'Could not determine the type of public.products.id';
  END IF;

  EXECUTE format(
    'ALTER TABLE public.deals ADD COLUMN target_product_id %s',
    product_id_type
  );
END
$migration$;

ALTER TABLE public.deals
  ADD CONSTRAINT deals_target_product_id_fkey
    FOREIGN KEY (target_product_id)
    REFERENCES public.products(id)
    ON DELETE CASCADE;

DROP VIEW public.active_product_deals;

ALTER TABLE public.deals
  ALTER COLUMN categories SET DEFAULT ARRAY[]::text[];

ALTER TABLE public.deals
  DROP CONSTRAINT IF EXISTS deals_categories_check;

ALTER TABLE public.deals
  ADD CONSTRAINT deals_categories_valid CHECK (
    categories <@ ARRAY['food', 'snacks', 'breakfast', 'drinks']::text[]
  ),
  ADD CONSTRAINT deals_exactly_one_target CHECK (
    (target_product_id IS NULL AND cardinality(categories) > 0)
    OR
    (target_product_id IS NOT NULL AND cardinality(categories) = 0)
  );

CREATE INDEX deals_target_product_idx
  ON public.deals (target_product_id)
  WHERE target_product_id IS NOT NULL;

COMMENT ON COLUMN public.deals.target_product_id IS
  'Exact product target. Leave categories empty when this is set.';

-- A banner may follow a deal. This keeps its visibility aligned with the
-- discount and gives product deals an automatic product-page destination.
ALTER TABLE public.banner_messages
  ADD COLUMN deal_id uuid
    REFERENCES public.deals(id)
    ON DELETE CASCADE;

CREATE INDEX banner_messages_deal_idx
  ON public.banner_messages (deal_id)
  WHERE deal_id IS NOT NULL;

COMMENT ON COLUMN public.banner_messages.deal_id IS
  'Optional deal whose active state controls this banner. Product deals also supply the banner product link.';

-- Select the highest-priority eligible deal for each product. Product-specific
-- deals win ties with category deals; explicit priority still wins first.
CREATE VIEW public.active_product_deals
WITH (security_invoker = true)
AS
SELECT
  p.id AS product_id,
  selected.id AS deal_id,
  selected.name AS deal_name,
  p.price AS original_price,
  CASE selected.discount_type
    WHEN 'percentage' THEN round(greatest(0, p.price * (1 - selected.discount_value / 100)), 2)
    WHEN 'fixed_amount' THEN round(greatest(0, p.price - selected.discount_value), 2)
    WHEN 'fixed_price' THEN round(greatest(0, least(p.price, selected.discount_value)), 2)
  END AS final_price,
  selected.discount_type,
  selected.discount_value
FROM public.products p
JOIN LATERAL (
  SELECT d.*
  FROM public.deals d
  WHERE d.starts_at <= now()
    AND (d.ends_at IS NULL OR d.ends_at > now())
    AND (
      d.target_product_id = p.id
      OR (d.target_product_id IS NULL AND (
        ('food' = ANY(d.categories) AND (
          'FOOD'::public.product_type = ANY(coalesce(p.types, ARRAY[]::public.product_type[]))
          OR (coalesce(cardinality(p.types), 0) = 0 AND NOT coalesce(p.is_snack, false))
        ))
        OR ('snacks' = ANY(d.categories) AND (
          'SNACK'::public.product_type = ANY(coalesce(p.types, ARRAY[]::public.product_type[]))
          OR (coalesce(cardinality(p.types), 0) = 0 AND coalesce(p.is_snack, false))
        ))
        OR ('breakfast' = ANY(d.categories) AND
          'BREAKFAST'::public.product_type = ANY(coalesce(p.types, ARRAY[]::public.product_type[])))
        OR ('drinks' = ANY(d.categories) AND
          'DRINK'::public.product_type = ANY(coalesce(p.types, ARRAY[]::public.product_type[])))
      ))
    )
    AND (
      d.due_date_rule IS NULL
      OR (d.due_date_rule = 'today' AND
        (p.due_date::timestamptz AT TIME ZONE 'Europe/Stockholm')::date =
        (now() AT TIME ZONE 'Europe/Stockholm')::date)
    )
  ORDER BY
    d.priority DESC,
    (d.target_product_id IS NOT NULL) DESC,
    d.starts_at DESC,
    d.created_at DESC,
    d.id
  LIMIT 1
) selected ON p.price IS NOT NULL;

GRANT SELECT ON public.active_product_deals TO anon, authenticated;

-- Standalone banners behave as before. A linked banner is returned only while
-- its deal is the currently applied deal for at least one product.
CREATE VIEW public.active_banner_messages
WITH (security_invoker = true)
AS
SELECT
  banner.id,
  banner.message,
  banner.link_label,
  banner.link_url,
  banner.starts_at,
  banner.ends_at,
  banner.created_at,
  banner.deal_id,
  deal.target_product_id AS product_id
FROM public.banner_messages banner
LEFT JOIN public.deals deal ON deal.id = banner.deal_id
WHERE banner.starts_at <= now()
  AND (banner.ends_at IS NULL OR banner.ends_at > now())
  AND (
    banner.deal_id IS NULL
    OR EXISTS (
      SELECT 1
      FROM public.active_product_deals active_deal
      WHERE active_deal.deal_id = banner.deal_id
    )
  );

GRANT SELECT ON public.active_banner_messages TO anon, authenticated;
GRANT SELECT ON public.banner_messages TO anon, authenticated;
