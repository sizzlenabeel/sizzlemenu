

## Modal Refinements (Tile View Only)

### Changes in `src/components/menu/DishCard.tsx`

**1. Remove the image section from the modal** (lines 137-157)
- Delete the entire `aspect-[4/3]` image block
- Keep the name, price badge, vegan badge, date, and `DishDetails` in the text content area

**2. Sticky buttons at the bottom of the modal**
- Change the `DialogContent` from a single scrollable container to a flex column layout: `flex flex-col` with `overflow-hidden` (not `overflow-y-auto`)
- The content area (name, date, details) goes in a scrollable `div` with `flex-1 overflow-y-auto p-5`
- The button row moves outside the scrollable area into a sticky footer: `div` with `p-5 pt-3 border-t bg-background` pinned at the bottom

**Structure:**
```text
┌─────────────────────────┐
│ Name, price, badges     │
│ Date                    │  ← scrollable
│ Description             │
│ Ingredients, allergens  │
│ Serving instructions    │
├─────────────────────────┤
│ [🛒]  [  BUY NOW  ]    │  ← sticky bottom
└─────────────────────────┘
```

### Files
| File | Change |
|---|---|
| `src/components/menu/DishCard.tsx` | Remove image from modal, make buttons sticky at bottom |

