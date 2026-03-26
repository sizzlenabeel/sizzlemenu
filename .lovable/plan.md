## Plan: Fix Buy URL, Snack Filtering, Contact Buttons, and Mobile Layout

### 1. Change underscore to hyphen in Swish URL

**File**: `src/components/menu/DishCard.tsx` (line 30)

Change `${locationName}_${dish.name}` to `${locationName}-${dish.name}` so the `msg` parameter uses a hyphen separator instead of underscore.

### 3. Add Contact Us buttons

**New file**: `src/components/menu/ContactButtons.tsx`

A row of icon buttons (Messenger, Email, Phone) grouped under a "Contact Us" label. Uses lucide-react icons (`MessageCircle`, `Mail`, `Phone`). Each opens the appropriate link:

- Messenger: `https://m.me/YOUR_PAGE` (placeholder, needs real link)
- Email: `mailto:hello@sizzle.se` (placeholder)
- Phone: `tel:+46XXXXXXXXX` (placeholder)

**Files**: `src/pages/Storytel.tsx`, `src/pages/Sizzle.tsx` -- add `<ContactButtons />` at the bottom of each page.

### 4. Tighten mobile layout on Storytel

`**src/components/menu/DayTabs.tsx**`:

- Remove `overflow-x-auto` and `min-w-[60px]`
- Make buttons equal-width with smaller padding on mobile (`px-2 py-2 sm:px-4 sm:py-3`)
- Always show the short label on mobile, full label on sm+

`**src/pages/Storytel.tsx**`:

- Move `DayTabs` and `WeekSelector` to separate rows instead of side-by-side:
  - Row 1: `DayTabs` (full width)
  - Row 2: `WeekSelector` (aligned right or left)

`**src/components/menu/FilterBar.tsx**`:

- Put `VeganToggle` and `SortDropdown` on the same row on mobile (they already are in a flex-wrap container, but ensure `CategoryToggle` is on its own row and the vegan+sort pair stays together)

### Files to modify

- `src/components/menu/DishCard.tsx` -- hyphen in URL
- `src/pages/Storytel.tsx` --  layout changes, add contact buttons
- `src/pages/Sizzle.tsx` -- add contact buttons
- `src/components/menu/DayTabs.tsx` -- compact mobile layout
- `src/components/menu/FilterBar.tsx` -- tighten mobile layout
- `src/components/menu/ContactButtons.tsx` -- new component