## Goal

Let you paste an image URL into any product row (from Cloudinary, your own site, or anywhere else) and have it show up in the menu — without using Supabase storage.

## Changes

### 1. Database — add one column

Migration on `products`:

- Add `image_url TEXT` (nullable). Nothing else changes; no new table, no RLS change (existing `products_public_select` already covers reads).

That's the entire backend footprint. Storing a ~100-char URL per product costs bytes, not megabytes.

### 2. Types

`src/hooks/useProducts.ts`:

- Add `image_url: string | null` to `ProductRow` and to the select list in both `fetchAllProducts()` and the allocations query.
- Map it into the returned dish as `imageUrl: row.image_url ?? undefined` (the `Dish` type already has an optional `imageUrl` field from an earlier change).

### 3. Rendering

`src/components/menu/DishCard.tsx`:

- **Tile view**: the existing image slot already exists — swap the placeholder for `<img src={dish.imageUrl} />` when present; keep the current placeholder illustration when it's `null`. Use `loading="lazy"` and `object-cover` so any aspect ratio looks right in the `aspect-[4/3]` frame.
- **List view**: no image today, and you didn't ask for one — leave it alone.
- No layout changes, no new toggle, no other files touched.

### 4. How you add images going forward

No admin UI (per your answer). Two ways to set a URL on a product:

- **Supabase dashboard** → `products` table → paste URL into `image_url` → save.
- Or send me the URL + product name in chat and I'll run an update for you.

Any HTTPS URL works — Cloudinary, imgix, your own domain, GitHub raw, etc. If Cloudinary: use the `f_auto,q_auto,w_800` transform in the URL for auto-WebP + resize, e.g. `https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto,w_800/dish.jpg`.

## Out of scope

- Location images, chef images, in-app upload form — you said products only.
- Supabase Storage bucket — deliberately avoided to preserve your quota.
- Migrating existing repo chef images to the CDN — separate task if you want it.

## Technical details

Migration:

```sql
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS image_url TEXT;
```

DishCard tile image slot (shape only):

```tsx
{dish.imageUrl ? (
  <img
    src={dish.imageUrl}
    alt={dish.name}
    loading="lazy"
    className="w-full h-full object-cover"
  />
) : (
  /* existing placeholder */
)}
```
