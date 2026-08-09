# Fix: blank page + "Invalid time value" on category click

## What's wrong

Three dishes in the database store their best-before date in day/month/year text form
(`24/08/2026`, `24/09/2026`, `31/01/2027`) instead of the standard year-month-day form.
The app turns that text into a date, gets an unusable value, and when a card tries to print
"24 Aug" the whole page crashes with `RangeError: Invalid time value` and goes blank.

It only shows up on certain categories because that's where those three dishes live.

## The fix

1. **Parse dates safely** (`src/hooks/useProducts.ts`)
   - Add a small date parser that accepts both `YYYY-MM-DD` and `DD/MM/YYYY`.
   - If a date can't be understood, store it as "no date" instead of a broken date.
   - Filters that compare against today skip dishes with no date rather than crash.

2. **Never crash on a missing date** (`src/components/menu/DishCard.tsx`)
   - Only format and display the best-before line when a valid date exists.
   - Card still renders name, price, badges and buttons when the date is absent.

3. **Same guard on the sorting paths** (`src/pages/LocationMenu.tsx`, `src/pages/DailyMenu.tsx`)
   - Dishes without a date sort last instead of producing `NaN` comparisons.

## Technical notes

- `Dish.dueDate` becomes `Date | null`; all read sites updated.
- `new Date("24/08/2026")` is `Invalid Date` in Chrome/Safari, and `date-fns` `format`
  throws `RangeError` on it — that throw during render unmounts the tree, which is the blank page.
- No database change: the three rows keep their current text; the app handles both formats.
  Optionally I can normalise those rows later so all dates share one format.
