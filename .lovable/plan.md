## Plan: Text Wrapping, Tile View, Delivery Day Filtering, Remove Week Selector

### 1. Fix Text Wrapping (Full Names Shown)

**File**: `src/components/menu/DishCard.tsx`

- Remove `truncate` class from the dish name `<h3>` so full names wrap naturally
- This applies to both list and tile views
- Move layout of cards so that the name has space and other tags like "vegan" and buttons to buy and add to cart are moved to the next row as applicable.
- Keep current width of tiles as it is in mobile

### 2. Add Tile View Toggle

**New file**: `src/components/menu/ViewToggle.tsx`

- A toggle button (list icon / grid icon) that switches between `'list'` and `'tile'` view modes

**File**: `src/components/menu/DishCard.tsx`

- Add a new `DishTile` component (or a `variant` prop) that renders a card with:
  - An image placeholder area (using a gray placeholder or `dish.imageUrl` if present)
  - Name, price, vegan badge, and buy/cart buttons below the image
  - Tapping the tile expands just like how the list view expands
- The tile layout uses a CSS grid (2 columns on mobile, 3-4 on desktop)

**File**: `src/types/menu.ts`

- Add `imageUrl?: string` to the `Dish` interface (optional, for future use)

**Files**: `src/pages/LocationMenu.tsx`, `src/pages/Storytel.tsx`

- Add `viewMode` state (`'list' | 'tile'`)
- Render `ViewToggle` in the filter bar area
- Conditionally render dishes in a grid (tile) or stacked list

### 3. Delivery Day Filtering for Non-Storytel Locations

**Logic**: For locations other than Storytel, use the `sizzle_deliveryday` column. Items are shown as available only on or after their delivery day within the current week. Items scheduled for a future day in the current week appear greyed out as "upcoming" under all active items.

**File**: `src/hooks/useProducts.ts`

- Add `sizzle_deliveryday` to the select query
- Map it to a new field `sizzleDeliveryDay?: DayOfWeek` on the Dish type

**File**: `src/types/menu.ts`

- Add `sizzleDeliveryDay?: DayOfWeek` to `Dish`

**File**: `src/pages/LocationMenu.tsx`

- Replace simple filtering with delivery-day-aware logic:
  - Get today's day of week (monday=0...friday=4)
  - Items where `sizzleDeliveryDay` day index <= today's index: show normally (available)
  - Items where `sizzleDeliveryDay` day index > today's index: show greyed out as "upcoming"
  - Items past due date: still hidden
- Render available items first, then an "Upcoming Deliveries" section with greyed-out cards

**File**: `src/components/menu/DishCard.tsx`

- Add an `upcoming?: boolean` prop that applies greyed-out styling (opacity, disabled buttons, "upcoming" label)

### 4. Remove Week Selector (Current Week Only)

**File**: `src/components/menu/FilterBar.tsx`

- Remove `WeekSelector` component and its props (`selectedWeek`, `onWeekChange`)
- The filter bar no longer needs week-related props
- &nbsp;

**File**: `src/components/menu/WeekSelector.tsx`

- Can be deleted or left unused

**Files**: `src/pages/LocationMenu.tsx`, `src/pages/Storytel.tsx`

- Remove `selectedWeek` state; hardcode `getCurrentWeek()` inline in the filter logic
- Remove `onWeekChange` prop passed to `FilterBar`
- Simplify `FilterBar` props
- Move sorting component up next to vegan toggle in mobile viewport.

### Files Summary


| File                                   | Action                                                                     |
| -------------------------------------- | -------------------------------------------------------------------------- |
| `src/types/menu.ts`                    | Add `imageUrl?`, `sizzleDeliveryDay?`                                      |
| `src/hooks/useProducts.ts`             | Fetch `sizzle_deliveryday`, map to dish                                    |
| `src/components/menu/DishCard.tsx`     | Remove truncate, add `upcoming` prop styling, add tile variant             |
| `src/components/menu/ViewToggle.tsx`   | New -- list/tile toggle                                                    |
| `src/components/menu/FilterBar.tsx`    | Remove WeekSelector, add ViewToggle                                        |
| `src/pages/LocationMenu.tsx`           | Delivery day logic with upcoming section, remove week state, add view mode |
| `src/pages/Storytel.tsx`               | Remove week state, add view mode                                           |
| `src/components/menu/WeekSelector.tsx` | Delete                                                                     |


### No Database Changes Needed

The `sizzle_deliveryday` column already exists. The `imageUrl` field is optional and will use a placeholder until a source is configured later.