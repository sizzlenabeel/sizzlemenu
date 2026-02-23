

## Fix: Use Database `week_number` for Filtering, Default to Current Week

### Problem

1. Week number is calculated from `due_date` using `getISOWeek` -- wrong results
2. The database already has a `week_number` column (values 1-9 currently) that should be used directly
3. The app still needs to know the current calendar week (via `date-fns`) to set the default selection, while letting the user pick previous weeks

### Changes

**1. `src/hooks/useProducts.ts`**
- Add `week_number` to the SELECT query and `ProductRow` interface
- Replace calculated `weekNumber`/`weekYear` with `row.week_number`
- Remove `getISOWeek`/`getISOWeekYear` imports (no longer needed here)

**2. `src/types/menu.ts`**
- Remove `weekYear` from `Dish` interface (database only stores week number)
- Keep `weekNumber` as `number | undefined`

**3. `src/components/menu/WeekSelector.tsx`**
- Simplify to work with plain week numbers (not week+year objects)
- Still use `getISOWeek(new Date())` to determine the **current** calendar week for the default selection
- Generate dropdown options: current week + previous 4 weeks (wrapping from 1 to 52 if needed)
- `getCurrentWeek()` returns just a number
- `onChange` emits just a number

**4. `src/pages/Storytel.tsx`**
- `selectedWeek` becomes a simple number (from `getCurrentWeek()`)
- Week filter: `dish.weekNumber === selectedWeek`
- Snacks: skip day filter (show all week)
- Food: filter by `dish.day === selectedDay`
- Hide expired items: `dish.dueDate >= now`

**5. `src/pages/Sizzle.tsx`**
- Same week filter simplification: `dish.weekNumber === selectedWeek`

### How Current Week Works

The `WeekSelector` component uses `getISOWeek(new Date())` at render time to know what the current calendar week is. This becomes the default selected value. The dropdown then shows options like:

- Week 9 (current)
- Week 8
- Week 7
- Week 6
- Week 5

The selected week number is compared against the `week_number` column from the database.

### Files to Modify
- `src/hooks/useProducts.ts` -- fetch `week_number`, remove date-fns calculation
- `src/types/menu.ts` -- remove `weekYear`
- `src/components/menu/WeekSelector.tsx` -- simplify to plain week numbers
- `src/pages/Storytel.tsx` -- simplified week filter, snack logic, expiry check
- `src/pages/Sizzle.tsx` -- simplified week filter

