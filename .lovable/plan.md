# Fix: no items available today, only "upcoming"

## What I found (verified against the live database)

- Week 33 has 34 products: 7 lunch dishes plus ~20 snacks, breakfast items and drinks.
- Every location (all 8, including Tobii and Storytel) has exactly **3 allocations**, and all 3 are
  the same Wednesday lunch dishes: Mapo Tofu, Köttbullar potatismos, Teriyaki glaserad kyckling.
- No snack, breakfast or drink is allocated to any location for this week.

The menu loads products through the allocations table. Because allocations exist (3 rows), the app
treats that as the complete list for the location and never falls back to the general product list.
Those 3 dishes are delivered Wednesday, today is Tuesday, so all 3 land in "Upcoming deliveries" —
leaving Food, Snacks, Breakfast and Drinks empty. Nothing is broken in the routing or the location
lookup; the data simply has no allocated fridge items for today.

## The fix

Change how the app decides what a fridge contains: allocations should govern **lunch dishes only**,
not the whole menu.

1. `src/hooks/useProducts.ts`
   - Always load the full week's products in addition to the location's allocations.
   - Build the dish list as: allocated products, plus every non-lunch product of the current week
     (snacks, breakfast, drinks) that is not location-restricted.
   - Keep the existing behaviour when a location has no allocations at all.

2. No change to filtering or card rendering — once snacks/breakfast/drinks reach the page, the
   existing available/upcoming split already handles them (they have no delivery day, so they show
   as available immediately).

## Alternative, if you prefer data over code

If the intent is that a fridge only shows what has actually been allocated to it, then this is a
data-entry gap: snacks, breakfast and drinks need allocation rows per location per week. In that
case I would leave the code alone and we would instead need a way to allocate pantry items.

Tell me which of the two you want; the plan above implements the first.

## Technical notes

- Today is 2026-08-11 (ISO week 33, Tuesday); `getTodayDayIndex()` returns 1, Wednesday is 2, so
  `deliveryDayIndex > todayIndex` sends all three dishes to the upcoming bucket — correct behaviour,
  wrong input set.
- "Non-lunch" is determined by `types` containing SNACK, BREAKFAST or DRINK.
- `is_only_for_storytel` items stay excluded from standard locations, as today.
