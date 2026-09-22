import { useEffect, useRef } from "react";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { CartItem } from "./CartItem";
import { formatCurrency } from "../utilities/formatCurrency";
import storeItems from "../data/items.json";
import Button from "./Button";

export const ShoppingCart = () => {
  const { isOpen, closeCart, cartItems } = useShoppingCart();

  const dialogRef = useRef<HTMLDialogElement>(null);

  // The browser owns a dialog's open state, so it has to be driven imperatively
  // rather than rendered from isOpen. showModal() is what earns the element its
  // keep: top-layer placement (which is what lets it cover the sticky Navbar
  // without any z-index), a focus trap, the rest of the page inerted, and
  // Esc-to-close — none of which a div with role="dialog" gets for free.
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
      // Fires for Esc and for close() alike, so context state cannot drift out
      // of step with the element's own open state.
      onClose={closeCart}
      // `hidden open:block` rather than a bare display utility: Tailwind's
      // display classes are author styles and would override the UA's
      // `dialog:not([open]) { display: none }`, leaving the dialog permanently
      // on screen and never modal.
      // overflow-hidden keeps the off-screen panel from widening the scrollable
      // area mid-transition, which the browser would otherwise rubber-band.
      // The durations here must stay >= the panel's, or the dialog stops being
      // displayed while the panel is still sliding out on close.
      className={`group fixed inset-0 m-0 p-0 h-full max-h-full w-full max-w-none border-none bg-transparent overflow-hidden
        hidden open:block
        transition-[display,overlay] transition-discrete duration-500 sm:duration-300
        backdrop:bg-black/50 backdrop:opacity-0 open:backdrop:opacity-100 starting:open:backdrop:opacity-0
        backdrop:transition-[opacity,display,overlay] backdrop:transition-discrete backdrop:duration-500 sm:backdrop:duration-300
      `}
    >
      {/* The same centred column as the Navbar and the Store grid. Aligning the
          panel this way rather than by calculating a viewport offset means it
          lands on the content edge by construction. */}
      <div className="mx-auto flex h-full w-full max-w-content justify-end">
        <div
          // Below sm the panel is full-width, so it crosses the whole screen
          // rather than the 28rem it travels on desktop — same duration, far
          // higher apparent speed. Slower here keeps the two feeling alike.
          // Kept in step with the dialog's discrete display transition above.
          className={`flex h-full w-full max-w-md flex-col bg-white shadow-2xl
            translate-x-full group-open:translate-x-0 starting:group-open:translate-x-full
            transition-transform duration-500 sm:duration-300 ease-in-out`}
        >
          <header className="flex items-center justify-between px-6 py-4 border-b">
            <h2 id="cart-heading" className="text-xl font-semibold">
              Cart
            </h2>
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
    </dialog>
  );
};
