import { useEffect, useRef } from "react";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { CartItem } from "./CartItem";
import { formatCurrency } from "../utilities/formatCurrency";
import storeItems from "../data/items.json";
import Button from "./Button";

export const ShoppingCart = () => {
  const { isOpen, closeCart, cartItems } = useShoppingCart();

  const isOpenRef = useRef(isOpen);
  const closeCartRef = useRef(closeCart);

  useEffect(() => {
    isOpenRef.current = isOpen;
    closeCartRef.current = closeCart;
  }, [isOpen, closeCart]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpenRef.current) {
        closeCartRef.current();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`fixed inset-y-0 left-auto right-[max(0px,calc((100%_-_var(--container-content))_/_2))] m-0 z-50 w-full max-w-md bg-white shadow-2xl
          transform transition-transform duration-300 ease-in-out
          flex flex-col
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <header className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Cart</h2>
          <Button
            variant="closeCart"
            dataKey="closeCart"
            onClick={closeCart}
            aria-label="Close cart"
          />
        </header>

        <div className="p-6 overflow-y-auto">
          <div className="flex flex-col gap-4 text-gray-500">
            {cartItems.map((item) => (
              <CartItem key={item.id} {...item} />
            ))}
          </div>
          <p className="text-gray-950 text-right font-bold mt-4">
            Total:{" "}
            {formatCurrency(
              cartItems.reduce((total, cartItem) => {
                const item = storeItems.find((i) => i.id === cartItem.id);
                return total + (item?.price || 0) * cartItem.quantity;
              }, 0),
            )}
          </p>
        </div>
        <footer className="px-6 py-4 border-t">
          <Button variant="default" dataKey="checkout" />
        </footer>
      </div>
    </div>
  );
};
