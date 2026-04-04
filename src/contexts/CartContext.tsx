import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Dish } from "@/types/menu";

interface CartItem {
  dish: Dish;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (dish: Dish) => void;
  removeFromCart: (dishId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((dish: Dish) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { dish, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((dishId: string) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.dish.id === dishId);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.dish.id === dishId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter((item) => item.dish.id !== dishId);
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const getCartTotal = useCallback(
    () => items.reduce((sum, item) => sum + item.dish.price * item.quantity, 0),
    [items]
  );

  const getItemCount = useCallback(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, getCartTotal, getItemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
