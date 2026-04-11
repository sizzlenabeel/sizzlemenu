

## Fix Swish Cart Message Format

### Change
In `src/components/menu/CartBar.tsx`, update the `buildSwishUrl` function to join the first words of each item with a hyphen instead of concatenating them directly.

**Current:** `const firstWords = items.map((i) => i.dish.name.split(/\s+/)[0]).join("");`
**New:** `const firstWords = items.map((i) => i.dish.name.split(/\s+/)[0]).join("-");`

### Files
| File | Change |
|---|---|
| `src/components/menu/CartBar.tsx` | Change `.join("")` to `.join("-")` on line 16 |

