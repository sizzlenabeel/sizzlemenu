-- Scheduled product discounts. Base product prices remain unchanged.
CREATE TABLE public.deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (length(trim(name)) > 0),
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'fixed_price')),
  discount_value numeric(10,2) NOT NULL CHECK (discount_value >= 0),
  categories text[] NOT NULL CHECK (
    cardinality(categories) > 0
    AND categories <@ ARRAY['food', 'snacks', 'breakfast', 'drinks']::text[]
  ),
  due_date_rule text CHECK (due_date_rule IS NULL OR due_date_rule = 'today'),
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz,
  priority integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at IS NULL OR ends_at > starts_at),
  CHECK (discount_type <> 'percentage' OR discount_value <= 100)
);

ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.deals FROM anon, authenticated;
GRANT SELECT ON public.deals TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.deals TO authenticated;

CREATE POLICY "scheduled_deals_public_select" ON public.deals
  FOR SELECT USING (starts_at <= now() AND (ends_at IS NULL OR ends_at > now()));

CREATE POLICY "deals_admin_all" ON public.deals
  FOR ALL TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE INDEX deals_schedule_priority_idx ON public.deals (starts_at, ends_at, priority DESC);

-- Selects the highest-priority matching deal for each product. "Today" is
-- deliberately evaluated in Stockholm time, independently of database timezone.
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
    )
    AND (
      d.due_date_rule IS NULL
      OR (d.due_date_rule = 'today' AND
        (p.due_date::timestamptz AT TIME ZONE 'Europe/Stockholm')::date =
        (now() AT TIME ZONE 'Europe/Stockholm')::date)
    )
  ORDER BY d.priority DESC, d.starts_at DESC, d.created_at DESC
  LIMIT 1
) selected ON p.price IS NOT NULL;

GRANT SELECT ON public.active_product_deals TO anon, authenticated;
