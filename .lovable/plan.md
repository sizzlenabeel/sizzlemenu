## Changes Across 4 Areas

### 1. Fix Storytel Empty State Message for Snacks

**Problem**: The `EmptyState` in Storytel always says "No snacks available for monday" -- but snacks are not day-specific. The vegan filter on snacks also triggers this misleading message.

**Fix in `src/pages/Storytel.tsx**`:

- Change the empty state message to omit the day when category is snacks:
  - Food: `"No food available for monday"`
  - Snacks: `"No snacks available"`

### 2. Show Price Only for Snacks on Storytel

**Problem**: Storytel currently passes `showPrice={false}` for all dishes. Snacks should show price.

**Fix in `src/pages/Storytel.tsx**`:

- Change `showPrice` to be dynamic: `showPrice={dish.category === 'snacks'}`

### 3. Default Sort by Due Date on All Pages

**Problem**: Both Storytel and Sizzle default `sortBy: 'price'`.

**Fix**:

- `src/pages/Storytel.tsx` line 18: change `sortBy: 'price'` to `sortBy: 'dueDate'`
- `src/pages/Sizzle.tsx` line 16: change `sortBy: 'price'` to `sortBy: 'dueDate'`

### 4. Show Allergens on the Collapsed Card

**Problem**: Allergens only appear in the expanded collapsible content. They should be visible in the short/collapsed card header alongside the due date.

**Fix in `src/components/menu/DishCard.tsx**`:

- Add allergen info to the header row (next to the due date), shown as a small text or badge when `dish.allergens` is non-empty
- Keep the allergens section in the expanded view as well

### Files to Modify

- `src/components/menu/DishCard.tsx` -- add allergens to collapsed header
- `src/pages/Storytel.tsx` -- fix empty state message for snacks, dynamic showPrice, default sort by dueDate, add view toggle
- `src/pages/Sizzle.tsx` -- default sort by dueDate, add view toggle