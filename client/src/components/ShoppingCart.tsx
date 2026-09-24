import { useEffect, useRef } from "react";
import { useShoppingCart } from "../hooks/useShoppingCart";
import { CartItem } from "./CartItem";
import { formatCurrency } from "../utilities/formatCurrency";
import { useStoreItems } from "../hooks/useStoreItems";
import Button from "./Button";

export const ShoppingCart = () => {
  const { isOpen, closeCart, cartItems } = useShoppingCart();
  const { data: storeItems = [] } = useStoreItems();

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog == null) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="cart-heading"
      onClose={closeCart}
      // `hidden open:block`, not a bare display utility: Tailwind's display
      // classes are author styles and override the UA's
      // `dialog:not([open]) { display: none }`, leaving the dialog permanently
      // on screen and never modal. Durations must stay >= the panel's below,
      // or the dialog stops being displayed mid-slide on close.
      className={`group fixed inset-0 h-full max-h-full w-full max-w-none bg-transparent overflow-hidden
        hidden open:block
        transition-[display,overlay] transition-discrete duration-500 sm:duration-300
        backdrop:bg-black/50 backdrop:opacity-0 open:backdrop:opacity-100 starting:open:backdrop:opacity-0
        backdrop:transition-[opacity,display,overlay] backdrop:transition-discrete backdrop:duration-500 sm:backdrop:duration-300
      `}
    >
      <div className="mx-auto flex h-full w-full max-w-content justify-end">
        <div
          className={`flex h-full w-full max-w-md flex-col bg-white shadow-2xl
            translate-x-full group-open:translate-x-0 starting:group-open:translate-x-full
            transition-transform duration-500 sm:duration-300 ease-in-out`}
        >
          <header className="flex items-center justify-between px-6 py-4 border-b">
            <h2 id="cart-heading" className="text-xl font-semibold">
              Basket
            </h2>
            <Button
              variant="closeCart"
              dataKey="closeCart"
              onClick={closeCart}
              aria-label="Close cart"
            />
          </header>

          <div className="p-6 overflow-y-auto scrollbar-none">
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
    </dialog>
  );
};
