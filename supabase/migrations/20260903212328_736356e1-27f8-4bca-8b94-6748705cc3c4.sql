alter table public.deals add column if not exists location_ids uuid[] not null default '{}'::uuid[];
alter table public.banner_messages add column if not exists location_ids uuid[] not null default '{}'::uuid[];

create index if not exists deals_location_ids_idx on public.deals using gin (location_ids);
create index if not exists banner_messages_location_ids_idx on public.banner_messages using gin (location_ids);

create or replace function public.active_product_deals_for_location(p_location_id uuid)
returns table (
  product_id text,
  deal_id uuid,
  deal_name text,
  original_price bigint,
  final_price numeric,
  discount_type text,
  discount_value numeric,
  deal_label text
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    p.id as product_id,
    selected.id as deal_id,
    selected.name as deal_name,
    p.price as original_price,
    case selected.discount_type
      when 'percentage' then round(greatest(0::numeric, p.price::numeric * (1::numeric - selected.discount_value / 100::numeric)), 2)
      when 'fixed_amount' then round(greatest(0::numeric, p.price::numeric - selected.discount_value), 2)
      when 'fixed_price' then round(greatest(0::numeric, least(p.price::numeric, selected.discount_value)), 2)
      else null::numeric
    end as final_price,
    selected.discount_type,
    selected.discount_value,
    coalesce(nullif(btrim(selected.display_label), ''), selected.name) as deal_label
  from public.products p
  join lateral (
    select d.id, d.name, d.discount_type, d.discount_value, d.display_label
    from public.deals d
    where d.starts_at <= now()
      and (d.ends_at is null or d.ends_at > now())
      and (
        cardinality(d.location_ids) = 0
        or (p_location_id is not null and p_location_id = any (d.location_ids))
      )
      and (
        d.target_product_id = p.id
        or d.target_product_id is null and (
          ('food' = any (d.categories) and (('FOOD'::product_type = any (coalesce(p.types, array[]::product_type[]))) or coalesce(cardinality(p.types), 0) = 0 and not coalesce(p.is_snack, false)))
          or ('snacks' = any (d.categories) and (('SNACK'::product_type = any (coalesce(p.types, array[]::product_type[]))) or coalesce(cardinality(p.types), 0) = 0 and coalesce(p.is_snack, false)))
          or ('breakfast' = any (d.categories) and ('BREAKFAST'::product_type = any (coalesce(p.types, array[]::product_type[]))))
          or ('drinks' = any (d.categories) and ('DRINK'::product_type = any (coalesce(p.types, array[]::product_type[]))))
        )
      )
      and (
        d.due_date_rule is null
        or d.due_date_rule = 'today' and (p.due_date::timestamptz at time zone 'Europe/Stockholm')::date = (now() at time zone 'Europe/Stockholm')::date
      )
    order by d.priority desc, (cardinality(d.location_ids) > 0) desc, (d.target_product_id is not null) desc, d.starts_at desc, d.created_at desc, d.id
    limit 1
  ) selected on p.price is not null;
$$;

grant execute on function public.active_product_deals_for_location(uuid) to anon, authenticated, service_role;

drop view if exists public.active_banner_messages;
create view public.active_banner_messages as
  select
    banner.id,
    banner.message,
    banner.link_label,
    banner.link_url,
    banner.starts_at,
    banner.ends_at,
    banner.created_at,
    banner.deal_id,
    deal.target_product_id as product_id,
    banner.location_ids
  from public.banner_messages banner
  left join public.deals deal on deal.id = banner.deal_id
  where banner.starts_at <= now()
    and (banner.ends_at is null or banner.ends_at > now())
    and (
      banner.deal_id is null
      or exists (
        select 1 from public.deals d
        where d.id = banner.deal_id
          and d.starts_at <= now()
          and (d.ends_at is null or d.ends_at > now())
      )
    );

grant select on public.active_banner_messages to anon, authenticated;
grant all on public.active_banner_messages to service_role;