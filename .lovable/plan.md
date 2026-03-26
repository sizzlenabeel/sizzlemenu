

## Add 5 New Location Pages

Each page is identical to `/sizzle` but with a different URL slug and location name passed to `DishCard` for the Swish URL.

### Approach

Rather than duplicating `Sizzle.tsx` five times, create a single reusable component and use it across all location pages.

### Changes

**Create `src/pages/LocationMenu.tsx`**
- Extract the Sizzle page logic into a component that accepts a `locationName` prop
- Everything else stays identical (filters, week selector, dish cards, contact buttons)

**Create 5 thin page files** (each just renders `<LocationMenu locationName="X" />`):
- `src/pages/Embark.tsx` → locationName="Embark"
- `src/pages/Tobii.tsx` → locationName="Tobii"
- `src/pages/Ahouse.tsx` → locationName="Ahouse"
- `src/pages/King.tsx` → locationName="King"
- `src/pages/Nordnet.tsx` → locationName="Nordnet"

**Refactor `src/pages/Sizzle.tsx`** to also use `<LocationMenu locationName="Sizzle" />`

**Update `src/App.tsx`** — add 5 new routes:
- `/embark` → Embark
- `/tobii` → Tobii
- `/ahouse` → Ahouse
- `/king` → King
- `/nordnet` → Nordnet

### Files
- `src/pages/LocationMenu.tsx` — new shared component (extracted from Sizzle)
- `src/pages/Sizzle.tsx` — simplified to use LocationMenu
- `src/pages/Embark.tsx` — new
- `src/pages/Tobii.tsx` — new
- `src/pages/Ahouse.tsx` — new
- `src/pages/King.tsx` — new
- `src/pages/Nordnet.tsx` — new
- `src/App.tsx` — add 5 routes

