

## Fix DishCard Layout Consistency

### Problem
Card contents (name, price, badges, buttons) are not aligned consistently across cards. When one card has a vegan badge or allergens and another doesn't, elements shift around, making the UI look messy -- especially on mobile.

### Design Approach
Use a **structured row-based layout** with fixed zones so every card aligns regardless of content variability.

---

### List View -- New Structure

Each card will have 3 clearly separated rows:

```text
┌──────────────────────────────────────────┐
│ Row 1: Name                          ▼   │
│ Row 2: [Vegan] [Upcoming]  ⚠allergens   │
│ Row 3: 85 kr  · Best before: 5 Apr  │🛒│Buy│
└──────────────────────────────────────────┘
```

- **Row 1**: Dish name (bold, large) + chevron right-aligned. Name wraps freely.
- **Row 2**: Badges row -- vegan badge, upcoming badge, allergens. Uses `min-h-[28px]` so the row occupies consistent space even when empty (no badges).
- **Row 3**: Price (large, bold, primary color for emphasis) + best-before date on the left; action buttons (cart icon + "Buy now") pushed to the right via `justify-between`. Price gets bumped up to `text-base font-bold text-primary` for prominence. Buttons get slightly larger touch targets.

### Tile View -- New Structure

```text
┌──────────────┐
│   [image]    │
├──────────────┤
│ Name         │
│ [Vegan]      │
│ 85 kr        │
│ BB: 5 Apr    │
│ [🛒] [Buy]  │
└──────────────┘
```

- Each section is a distinct block with consistent spacing (`space-y-2`)
- Price gets `text-base font-bold text-primary` -- visually dominant
- Buttons stretch to fill width (`flex w-full`) for easy tapping on mobile
- `min-h` on the name area ensures cards align in the grid even with different name lengths

### Key Changes in `src/components/menu/DishCard.tsx`

**List view:**
- Restructure into 3 explicit rows with consistent spacing
- Price: `text-base font-bold text-primary` (was `text-sm font-semibold`)
- Buy button: larger padding, `px-4 py-2` (was `px-3 py-1.5`)
- Cart button: larger `h-4 w-4` icon
- Allergens moved to row 2 with badges (out of the price row)
- Row 2 gets `min-h-[28px]` for consistency when no badges exist

**Tile view:**
- Use `flex flex-col` with `flex-grow` on the content area so buttons always sit at the bottom
- Price: `text-base font-bold text-primary`
- Buttons: full-width row at the bottom of each tile
- Name area: `min-h-[2.5rem]` to keep grid alignment

**Both views:**
- Remove inline badge+price mixing -- price is always its own prominent element
- Consistent `gap` and `padding` values across all cards

### Files
| File | Action |
|---|---|
| `src/components/menu/DishCard.tsx` | Restructure both list and tile layouts |

No other files need changes.

