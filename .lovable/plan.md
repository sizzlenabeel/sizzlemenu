# Storytel food: "Buy Now" button to external link

## What changes
- On the Storytel page, Food category only: every food item gets a "Buy Now" button.
- Clicking it opens: `https://microdeb.me/RiddarholmenLunchrestaurang/article-list-mobile/c39213f1-878b-4de9-8423-0f524a4466bf?devLoc=18a8b6b5-792a-4767-bce2-574afb3d3543` in a new tab.
- No cart button and no price added for Storytel food (they stay hidden as today).
- Works in both tile view (card and the half-screen detail sheet) and list view.

## What stays the same
- Storytel snacks, drinks, breakfast: unchanged (still Swish + cart).
- All other locations: unchanged.
- Upcoming items: no button, same as now.

## Technical details
- `DishCard.tsx`: add optional prop `externalBuyUrl?: string`. When set (and not upcoming), the Buy Now link uses this URL instead of the Swish URL, and the cart button is not shown. Without the prop, behavior is identical to today.
- `DailyMenu.tsx` (Storytel-only page): pass `externalBuyUrl={STORYTEL_FOOD_BUY_URL}` only when `dish.category === "food"`. `showPrice`/`showBuyButton` for food stay `false`.
- Constant `STORYTEL_FOOD_BUY_URL` defined in `DailyMenu.tsx`.
