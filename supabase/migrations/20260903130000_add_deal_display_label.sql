-- Keep the deal name useful for internal identification while allowing a
-- shorter customer-facing label on product cards.
ALTER TABLE public.deals
  ADD COLUMN display_label text;

ALTER TABLE public.deals
  ADD CONSTRAINT deals_display_label_not_blank CHECK (
    display_label IS NULL OR length(btrim(display_label)) > 0
  );

UPDATE public.deals
SET display_label = name
WHERE display_label IS NULL;

COMMENT ON COLUMN public.deals.display_label IS
  'Customer-facing deal badge. Falls back to name when left empty.';

-- Preserve the existing view contract and append the public label so the
-- dependent active_banner_messages view remains valid.
CREATE OR REPLACE VIEW public.active_product_deals
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
  selected.discount_value,
  coalesce(nullif(btrim(selected.display_label), ''), selected.name) AS deal_label
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
