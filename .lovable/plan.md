## Redesign DishCard to Match Reference Screenshots

The reference images show a clean, spacious card design with distinct visual hierarchy. Here's the new layout:

### Tile View (Primary — matches screenshot 1)

```text
┌─────────────────────────┐
│  Tags
|                   ┌────┐│
│     [IMAGE]       │85kr││
│                   └────┘│
├─────────────────────────┤
│ Dish Name            ♡  │
│                         │
│ 📅 Best before: 5 Apr   │
│                         │
│ [ADD TO CART] [BUY NOW] │
└─────────────────────────┘
```

Key design elements from the reference:

- **Image takes up the top half** with a rounded top. Price overlaid as a badge in the top-right corner of the image.
- **Name is large and bold** (serif-style or heavier weight), left-aligned below image.
- **Badges** (Vegan, allergens) displayed as rounded pill badges below the name.
- **Best before** line with calendar icon, smaller text.
- **Two full-width buttons** side by side: "ADD TO CART" (outlined/secondary) and "BUY NOW" (filled/primary). Both are prominent with generous padding.

### List View (matches screenshot 2)

```text
┌─────────────────────────────────────┐
│ [VEGAN]  [GLUTEN-FREE]             │
│                                     │
│ Dish Name                           │
│                                     │
│ Best before  Allergen 1, alleergne2
     5 Apr    │      allergen 3, 4
│                                     │
│ 85 kr                               │
│                                     │
│ Add to Cart        [  BUY NOW  ]    │
└─────────────────────────────────────┘
```

Key design elements:

- **Badges at the top** of the card (before name).
- **Name is large, bold** — dominant element.
- **Best before** on its own line, smaller.
- **Price is very large and prominent** — colored in primary, big font size (`text-2xl` or `text-3xl`).
- **Buttons at the bottom**: "Add to Cart" as text link, "BUY NOW" as filled rounded button.

### Changes to `src/components/menu/DishCard.tsx`

**Tile view:**

- Image area: `aspect-[4/3]` with price badge overlaid (`absolute top-2 right-2`) in a rounded badge with primary bg.
- Below image: name (`text-lg font-bold`), badges row, best-before line, then two side-by-side buttons pushed to bottom via `mt-auto`.
- "ADD TO CART" button: outlined style, uppercase, `border border-primary text-primary`.
- "BUY NOW" button: filled primary, uppercase, rounded-full or rounded-lg.
- Remove chevron from tile view — expand on tap still works but no arrow clutter.

**List view:**

- Remove the compact 3-row layout. Use a more spacious vertical stack.
- Order: badges → name → best-before → price (large, `text-2xl font-bold text-primary`) → buttons row.
- "Add to Cart": text-style button (no background). "BUY NOW": filled rounded primary button.
- More padding (`p-5` or `p-6`), more spacing between sections.

**Both views:**

- Upcoming items: same `opacity-50` treatment, buttons disabled.
- Collapsible details remain the same on expand.
- Remove the `min-h` hacks — the new spacious layout naturally aligns better.

### Files


| File                               | Action                                      |
| ---------------------------------- | ------------------------------------------- |
| `src/components/menu/DishCard.tsx` | Full redesign of both tile and list layouts |
