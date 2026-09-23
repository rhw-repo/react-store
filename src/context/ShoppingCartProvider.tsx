import { useCallback, useMemo, useState, type ReactNode } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  ShoppingCartContext,
  type CartItem,
} from "../hooks/useShoppingCart";

type ShoppingCartProviderProps = {
  children: ReactNode;
};

export const ShoppingCartProvider = ({
  children,
}: ShoppingCartProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    "shopping-cart",
    []
  );

  // reduce() method to transform this array of objects into single aggregate value (a number)
  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const getItemQuantity = useCallback(
    (id: number) => {
      return cartItems.find((item) => item.id === id)?.quantity || 0;
    },
    [cartItems]
  );

  // Build new arrays by inducing functional state updates rather than directly
  // mutating state to avoid introducing errors
  const increaseCartQuantity = useCallback(
    (id: number) => {
      setCartItems((currItems) => {
        if (!currItems.some((item) => item.id === id)) {
          return [...currItems, { id, quantity: 1 }];
        } else {
          return currItems.map((item) => {
            if (item.id === id) {
              return { ...item, quantity: item.quantity + 1 };
            } else {
              return item;
            }
          });
        }
      });
    },
    [setCartItems]
  );

  const decreaseCartQuantity = useCallback(
    (id: number) => {
      setCartItems((currItems) => {
        // Drop the item at the last one rather than decrementing to zero, which
        // would leave a { quantity: 0 } entry that the cart drawer still renders
        // as a row costing nothing.
        if (currItems.find((item) => item.id === id)?.quantity === 1) {
          return currItems.filter((item) => item.id !== id);
        } else {
          return currItems.map((item) => {
            if (item.id === id) {
              return { ...item, quantity: item.quantity - 1 };
            } else {
              return item;
            }
          });
        }
      });
    },
    [setCartItems]
  );

  const removeFromCart = useCallback(
    (id: number) => {
      setCartItems((currItems) => {
        // Filter to return an array where item(s) with matching id are ommitted
        return currItems.filter((item) => item.id !== id);
      });
    },
    [setCartItems]
  );

  const value = useMemo(
    () => ({
      getItemQuantity,
      increaseCartQuantity,
      decreaseCartQuantity,
      removeFromCart,
      openCart,
      closeCart,
      cartItems,
      cartQuantity,
      isOpen,
    }),
    [
      getItemQuantity,
      increaseCartQuantity,
      decreaseCartQuantity,
      removeFromCart,
      openCart,
      closeCart,
      cartItems,
      cartQuantity,
      isOpen,
    ]
  );

  return (
    <ShoppingCartContext.Provider value={value}>
      {children}
      <ShoppingCart />
    </ShoppingCartContext.Provider>
  );
};
