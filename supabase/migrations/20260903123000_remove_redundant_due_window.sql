-- Compatibility cleanup for environments where the draft due_within_days
-- field was already added. Product campaign duration belongs in starts_at and
-- ends_at; retain the original due_date_rule behavior for existing deals.

DROP VIEW IF EXISTS public.active_banner_messages;
DROP VIEW IF EXISTS public.active_product_deals;

ALTER TABLE public.deals
  ADD COLUMN IF NOT EXISTS due_date_rule text;

DO $cleanup$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'deals'
      AND column_name = 'due_within_days'
  ) THEN
    -- A zero-day draft window represented the old "today" rule. Wider draft
    -- windows intentionally become schedule-only deals.
    EXECUTE $sql$
      UPDATE public.deals
      SET due_date_rule = 'today'
      WHERE due_within_days = 0
        AND due_date_rule IS NULL
    $sql$;
  END IF;
END
$cleanup$;

ALTER TABLE public.deals
  DROP COLUMN IF EXISTS due_within_days;

DO $constraint$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.deals'::regclass
      AND conname = 'deals_due_date_rule_check'
  ) THEN
    ALTER TABLE public.deals
      ADD CONSTRAINT deals_due_date_rule_check
      CHECK (due_date_rule IS NULL OR due_date_rule = 'today');
  END IF;
END
$constraint$;

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
