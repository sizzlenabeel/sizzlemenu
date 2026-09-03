# Sizzle Fridge

A digital menu application for Sizzle, built with React, TypeScript, Vite, and Tailwind CSS.

## Getting Started

```sh
npm install
npm run dev
```

## Scheduled banners

The `banner_messages` table powers announcements above every location menu. Each
row has message text and can optionally include `link_url` and `link_label`. It
appears at `starts_at` and is hidden after `ends_at`; leave `ends_at` null for no
expiry. Links are stored as data rather than raw HTML so they remain safe to render.

Set `deal_id` to make a banner follow a deal. The banner is then visible only
while that deal is the winning discount for at least one product. For an
exact-product deal, leaving `link_url` empty automatically links to that product
at the location whose menu is open. An explicit `link_url` always takes
precedence.

For a reusable internal banner link, use `{location}` in place of the location's
Dynamo ID. For example, `/{location}/snacks` resolves to `/storytel/snacks` when
viewed from Storytel. Supported paths are `/{location}/food`,
`/{location}/snacks`, `/{location}/breakfast`, `/{location}/drinks`, and
`/{location}/product/{productId}`. The `{productId}` (or `{product}`) placeholder
uses the exact product from the linked deal. `{baseurl}` is also supported when
an absolute URL is needed, for example `{baseurl}/{location}/snacks`.

## Deals

The `deals` table applies scheduled discounts without changing `products.price`.
Choose `percentage`, `fixed_amount`, or `fixed_price`, select one or more
categories, and leave `target_product_id` empty for a category campaign.

For a specific item, leave `categories` empty and set `target_product_id` to its
`products.id`. Use `starts_at` and `ends_at` for its duration—for example, set
them one or two weeks apart based on that item's due date. Leave the existing
`due_date_rule` null for these scheduled product campaigns.

Exactly one target mode is required per deal: categories or one exact product.
This keeps due-date timing independent for each item. If several deals match,
the highest `priority` wins; an exact-product deal wins an equal-priority tie
with a category deal. The `active_product_deals` view exposes the calculated
price. Menu availability continues to follow the existing week and delivery-day
rules.

For example, this creates a two-week product campaign and a banner whose link
and visibility follow it:

```sql
WITH new_deal AS (
  INSERT INTO public.deals (
    name, discount_type, discount_value, target_product_id, starts_at, ends_at
  )
  VALUES (
    'Eat me soon',
    'fixed_price',
    49,
    'PRODUCT_ID',
    '2026-09-03 00:00:00+02',
    '2026-09-17 00:00:00+02'
  )
  RETURNING id
)
INSERT INTO public.banner_messages (message, link_label, deal_id)
SELECT 'Eat me soon: now 49 kr', 'View deal', id
FROM new_deal;
```

The default banner `starts_at` is now and `ends_at` is null, so the linked deal
alone controls that example's expiry. Set either timestamp when an additional
hard campaign bound is needed.
