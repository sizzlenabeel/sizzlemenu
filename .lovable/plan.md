

## DishCard Tile View Fixes + View Toggle Relocation

### 1. Line clamping for name and allergens (tile view only)

- Apply `line-clamp-2` to the dish name (`h3`) and allergens text in the tile view
- This keeps card height consistent regardless of content length

### 2. Buttons pinned to bottom (tile view)

- The tile card already uses `flex flex-col` -- add `mt-auto` to the button container so it always sits at the bottom of the card
- The parent grid in `LocationMenu.tsx` will use `grid-rows-[subgrid]` or simply ensure cards stretch with `items-stretch` (already default for CSS grid), so all cards in a row share the same height

### 3. Replace Collapsible with a half-screen modal (tile view only)

- Remove the `Collapsible` wrapper from the tile view entirely
- On tile card click, open a `Dialog` (from existing `@/components/ui/dialog`) styled as a bottom sheet:
  - Positioned at the bottom of the screen (`fixed bottom-0`), max height `50vh`, scrollable
  - Top section mirrors the tile card layout (image, name, price, badges)
  - Below that: full dish details (description, ingredients, allergens, serving instructions)
- List view keeps the existing `Collapsible` behavior unchanged

### 4. Move ViewToggle next to LanguageToggle in the header

- **`MenuHeader.tsx`**: Accept `viewMode` and `onViewModeChange` props, render `ViewToggle` next to `LanguageToggle`
- **`FilterBar.tsx`**: Remove `ViewToggle` import and rendering, remove `viewMode`/`onViewModeChange` props
- **`LocationMenu.tsx`**: Pass `viewMode` and `onViewModeChange` to `MenuHeader` instead of `FilterBar`

### Files

| File | Action |
|---|---|
| `src/components/menu/DishCard.tsx` | Line clamp name/allergens, replace collapsible with dialog in tile view, pin buttons to bottom |
| `src/components/menu/MenuHeader.tsx` | Add ViewToggle next to LanguageToggle |
| `src/components/menu/FilterBar.tsx` | Remove ViewToggle |
| `src/pages/LocationMenu.tsx` | Pass viewMode props to MenuHeader instead of FilterBar |

