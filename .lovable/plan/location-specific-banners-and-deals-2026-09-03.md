# Location-specific banners and deals

## Goal
A banner or a deal can be limited to one or more locations, without changing how they already work by category or by product. Anything with no locations set keeps showing everywhere, so nothing currently live changes.

## Data model decision: array of location ids (not one row per location)

Recommendation: add a `location_ids` column (a list of location ids) to both `deals` and `banner_messages`.

- One deal / one banner stays one row, so priority, dates, label and product/category targeting stay in a single place. With one row per location you would have to duplicate and keep every copy in sync.
- Empty / not set = all locations. This keeps every existing deal and banner working untouched.
- Filtering by "does this list contain my location" is a single indexed array-overlap check, fast at this data size.

A separate `deal_locations` join table would only pay off if we later need per-location overrides (different discount per location). We are not asking for that, so the array is the simpler, safer choice.

## Behaviour

- Deal with no locations set: applies everywhere (today's behaviour).
- Deal with locations set: the discounted price only appears on those location pages; elsewhere the product shows its normal price.
- Same rule for banners.
- If a location-specific deal and a global deal both match a product at that location, the existing priority ordering decides, with location-specific winning ties (more specific beats general).
- A banner attached to a deal stays hidden when that deal is not active for the visited location.

## Technical work

Database migration:
1. `alter table public.deals add column location_ids uuid[] not null default '{}'` and the same on `public.banner_messages`; GIN indexes on both.
2. Replace `active_product_deals` with a location-aware function `public.active_product_deals_for_location(p_location_id uuid)` returning the same columns as today, adding to the lateral deal selection:
   `(cardinality(d.location_ids) = 0 or p_location_id = any(d.location_ids))`
   and adding "location-specific first" to the existing `order by` so a targeted deal outranks a global one at equal priority.
   Keep the existing `active_product_deals` view in place (global deals only view semantics unchanged) so nothing that reads it breaks.
3. Recreate `active_banner_messages` to also expose `location_ids`, and have its `deal_id` liveness check use the location-aware selection.
4. Grant execute on the new function to `anon`, `authenticated`, `service_role`.

Frontend:
- `src/hooks/useProducts.ts`: pass the resolved location id (already available via `useLocation`) into the products query and call the new RPC instead of selecting the `active_product_deals` view; keep the existing "deals are optional, fall back to normal prices on error" behaviour.
- `src/hooks/useBannerMessages.ts`: accept an optional location id, filter with `location_ids` empty OR containing that id; keep the legacy fallback path.
- `src/pages/LocationMenu.tsx`, `src/pages/DailyMenu.tsx`, `src/pages/ProductPage.tsx`: pass the location id to `useBannerMessages` (and product page falls back to global-only when no location in the route).
- Query keys include the location id so switching locations refetches.

Verification: check a global deal still shows at every location, a location-scoped deal shows only at its location, and category- and product-targeted deals both keep working.
