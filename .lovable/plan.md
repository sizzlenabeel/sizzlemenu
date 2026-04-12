

## Fix: English translated ingredients not displaying

### Root Cause
The `translated_ingredients` column in the database is `jsonb`, but the data is inconsistent:
- Some rows store a **JSON array**: `["Chicken", "Mushrooms", ...]` -- works correctly
- Most rows store a **JSON string**: `"Chickpeas, tomato, sweet potato, ..."` -- fails the `Array.isArray()` check and falls back to Swedish

### Fix
**File: `src/hooks/useProducts.ts`** — Update `parseIngredients` to also handle the case where `translatedIngredients` is a string. When it's a string, split by comma just like the Swedish fallback.

```typescript
function parseIngredients(ingredients: string | null, translatedIngredients: unknown): string[] {
  if (Array.isArray(translatedIngredients) && translatedIngredients.length > 0) {
    return translatedIngredients.map(String);
  }
  if (typeof translatedIngredients === 'string' && translatedIngredients.length > 0) {
    return translatedIngredients.split(',').map(i => i.trim()).filter(Boolean);
  }
  if (ingredients) {
    return ingredients.split(',').map(i => i.trim()).filter(Boolean);
  }
  return [];
}
```

### Files
| File | Change |
|---|---|
| `src/hooks/useProducts.ts` | Add string handling to `parseIngredients` |

