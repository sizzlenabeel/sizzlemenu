# Remove allocation dependency from menus

## Verified current state

- The database has **25 current-week snacks, drinks, and breakfast products**, and these products have no allocation rows.
- `useProducts` still queries `allocations` first. It supplements allocated food with pantry products, but allocations continue to control which food products reach each standard-location menu.
- The current local preview displays Food, Snacks, Breakfast, and Drinks at Tobii, so a deployed site that still lacks pantry items is likely running an older build or cached deployment. Removing the allocation path will also make the intended rule explicit and harder to regress.

## Implementation

1. Simplify `useProducts` to load products directly from `public.products` for every resolved location.
   - Remove the allocations query, allocation-row parsing, deduplication, and pantry merge logic.
   - Do not require an allocation row for Food, Snacks, Breakfast, or Drinks.
   - Keep localization, category mapping, images, due dates, and all existing product fields unchanged.

2. Preserve the existing menu rules outside allocation.
   - Standard locations continue to exclude Storytel-only products.
   - Current-week and non-expired filtering remains in the menu pages.
   - Standard-location food still uses `sizzle_deliveryday`: delivered items appear as available, and later deliveries appear greyed out under Upcoming Deliveries.
   - Storytel keeps its existing Storytel flags and daily-menu behavior.

3. Verify the result on representative routes.
   - Test Tobii and another standard location across Food, Snacks, Breakfast, and Drinks.
   - Confirm products without allocations are purchasable.
   - Confirm future-delivery food remains upcoming rather than disappearing.
   - Test Storytel to ensure its specialized filtering is unchanged.

## Database impact

No schema or data migration is needed. The `allocations` table can remain for operational reporting or future use, but menu visibility will no longer read from it.