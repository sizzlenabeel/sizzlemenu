

## Plan: Add Cart Functionality and Hide Expired Items

### No Database Changes Needed
Both features are purely client-side. The cart is ephemeral (per-session), and due date filtering already exists in the data.

---

### 1. Hide Expired Items on All Pages

**Problem**: `LocationMenu.tsx` (used by Sizzle, Embark, Tobii, etc.) does not filter out items past their due date. Storytel already does this but only for food (snacks bypass it).

**Fix in `src/pages/LocationMenu.tsx`**: Add `if (dish.dueDate < new Date()) return false;` to the filter logic.

**Fix in `src/pages/Storytel.tsx`**: Move the `dueDate < now` check before the category-specific logic so it applies to both food and snacks.

---

### 2. Add Cart Functionality

**New file: `src/contexts/CartContext.tsx`**
- React context providing cart state scoped per location
- State: array of `{ dish: Dish, quantity: number }`
- Actions: `addToCart(dish)`, `removeFromCart(dishId)`, `clearCart()`, `getCartTotal()`
- Wrap the app with `CartProvider` in `App.tsx`

**New file: `src/components/menu/CartBar.tsx`**
- Sticky bottom bar that appears when cart has items
- Shows item count, total price, and a "Pay with Swish" button
- Swish URL format: `locationName-{firstWordOfItem1}{firstWordOfItem2}...` (no spaces, max 50 chars), total price as `amt`
- "Clear cart" button

**Modify `src/components/menu/DishCard.tsx`**
- Replace the individual "Buy now" link with an "Add to cart" button (+ icon or text)
- When tapped, calls `addToCart(dish)` from context
- Keep the individual buy button as well, so users can either buy one item or add to cart

**Modify `src/pages/LocationMenu.tsx`**
- Render `<CartBar locationName={locationName} />` at the bottom
- Pass location name for Swish URL generation

**Modify `src/pages/Storytel.tsx`**
- Same: render `<CartBar locationName="Storytel" />` (only relevant for snacks since food has no buy button)

**Modify `src/App.tsx`**
- Wrap routes with `<CartProvider>`

### Swish URL Message Format (Cart)

For a cart with items "Chicken Teriyaki" and "Mango Smoothie" at location "Sizzle":
- Message: `Sizzle-ChickenMango` (first word of each item, concatenated, no spaces, max 50 chars)
- Amount: sum of all item prices

### Files to Create
- `src/contexts/CartContext.tsx`
- `src/components/menu/CartBar.tsx`

### Files to Modify
- `src/App.tsx` -- wrap with CartProvider
- `src/components/menu/DishCard.tsx` -- add "Add to cart" button alongside existing buy button
- `src/pages/LocationMenu.tsx` -- add expired filter + render CartBar
- `src/pages/Storytel.tsx` -- fix expired filter for snacks + render CartBar

