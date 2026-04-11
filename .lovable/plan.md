

## Small Visual Fixes

### 1. Language Toggle - match height and use orange for selected state
**File: `src/components/menu/LanguageToggle.tsx`**
- Replace `ToggleGroup`/`ToggleGroupItem` with a custom button pair matching the `ViewToggle` pattern (same `border border-input bg-background` wrapper, same `p-2` sizing)
- Selected state uses `bg-primary text-primary-foreground` (orange, same as ViewToggle) instead of the default green/accent

### 2. Snacks category - orange instead of purple/blue when selected
**File: `src/components/menu/CategoryToggle.tsx`**
- Change `bg-snacks` to `bg-food` (which is orange) for the selected snacks button, so both Food and Snacks highlight in orange

### 3. Center the vegan + sort row
**File: `src/components/menu/FilterBar.tsx`**
- Change the vegan/sort row from `flex items-center gap-3` to `flex items-center justify-center gap-3`

### Files
| File | Change |
|---|---|
| `src/components/menu/LanguageToggle.tsx` | Rewrite as custom buttons matching ViewToggle height/style, orange selected state |
| `src/components/menu/CategoryToggle.tsx` | Change snacks selected color from `bg-snacks` to `bg-food` |
| `src/components/menu/FilterBar.tsx` | Add `justify-center` to vegan/sort row |

