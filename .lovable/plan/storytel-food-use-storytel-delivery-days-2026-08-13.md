# Storytel food: use storytel_delivery_days

## Verified current state

- Storytel's page (`DailyMenu.tsx`) filters food with a single day: `dish.day !== selectedDay`, where `day` comes from the `delivery_day` column.
- The database has `storytel_delivery_days` populated for current-week Storytel food, e.g. `[Monday, Tuesday]`, `[Wednesday, Thursday]`, `[Wednesday, Thursday, Friday]`, `[Friday]`. Values are capitalized day names; non-food items have empty arrays.
- The product loader (`useProducts.ts`) does not currently read `storytel_delivery_days`.

## Change

1. Load the new column
   - Add `storytel_delivery_days` to the products query and map it to a normalized lowercase day list on the dish object.

2. Storytel food filtering (Storytel only)
   - On the Storytel daily menu, a food dish shows on the selected day when that day is in its `storytel_delivery_days` list.
   - Fall back to the existing single `delivery_day` behaviour only when the array is empty or missing, so nothing disappears for dishes not yet filled in.
   - Snacks, breakfast, and drinks keep their current behaviour (no day filtering).

3. No change for other locations
   - `LocationMenu.tsx` keeps using `sizzle_deliveryday` for available/upcoming splitting. The new column is ignored there.

## Verification

- Storytel route: confirm a `[Monday, Tuesday]` dish appears on both Monday and Tuesday tabs and not on Wednesday; a `[Wednesday, Thursday, Friday]` dish appears on all three.
- Confirm snacks/breakfast/drinks tabs are unchanged, and a standard location's menu is unchanged.
