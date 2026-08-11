# Eliminate allocation-driven menu visibility

## Confirmed root cause

- The affected published JavaScript still queries `allocations` by `location_id` before building the menu.
- When any allocation exists, that runtime branch treats allocated products as the base list and conditionally merges other products. This is why inserting allocation rows changes the visible menu and can remove snacks, breakfast, and drinks.
- The database confirms the mismatch: week 33 has current snacks, breakfast, and drinks in `products`, but none of them have allocation rows; only food has allocation links.
- The current repository version of `src/hooks/useProducts.ts` no longer contains that query, but the published bundle is older and still does. The previous investigation incorrectly treated the repository/local source as proof of the behavior on the affected deployment.

## Implementation

1. Make the product hook unambiguously location-independent.
   - Change `useProducts(locationId)` to `useProducts()`.
   - Remove `locationId` from its query key and remove the location-dependent `enabled` gate.
   - Keep one direct query to `public.products`; do not read, join, merge, or fall back through `allocations`.
   - Update both standard-location and Storytel pages to call the location-independent hook.

2. Preserve the intended page-level rules.
   - Keep current-week, due-date, category, vegan, Storytel, and delivery-day filtering unchanged.
   - Standard locations will continue splitting food into available/upcoming using `sizzle_deliveryday`.
   - Allocation rows will have no effect on any product category.

3. Add a regression guard.
   - Add a focused test or source-level assertion proving the menu loader makes a `products` request and never an `allocations` request.
   - Cover the important case: allocation rows may exist while unallocated snacks, breakfast, drinks, and food remain in the menu input.

4. Verify the actual runtime, not only the source.
   - Verify representative standard and Storytel routes locally across all four categories.
   - Inspect browser network traffic and confirm category changes make no request to `allocations`.
   - Confirm the built production asset contains the direct `products` loader and no allocation-driven menu branch.
   - After the updated build is published by the configured deployment, re-check the deployed asset and routes; source verification alone will not be considered sufficient.

## Database impact

No database migration or allocation deletion is required. The `allocations` table can remain for operational purposes, but the customer menu will not read it.
