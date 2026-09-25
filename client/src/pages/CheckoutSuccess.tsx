import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useShoppingCart } from "../hooks/useShoppingCart";
import { useOrderConfirmation } from "../hooks/useOrderConfirmation";
import { formatCurrency } from "../utilities/formatCurrency";
import PageTemplate from "../components/PageTemplate";
import { NotFound } from "./NotFound";

// Stripe redirects here after a successful test payment
export const CheckoutSuccess: React.FC = () => {
  const { clearCart } = useShoppingCart();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { data: order, isPending, isError } = useOrderConfirmation(sessionId);

  // Empty the cart only once the server has confirmed the payment
  useEffect(() => {
    if (order) {
      clearCart();
    }
  }, [order, clearCart]);

  if (sessionId == null || isError) {
    return <NotFound />;
  }

  if (isPending) {
    return <p className="m-4 text-lg text-gray-800">Loading your order…</p>;
  }

  return (
    <PageTemplate
      heading="Order confirmed"
      subheading={`Order #${order.orderNumber}`}
      imgSrc="/imgs/thankyou.webp"
      imgPosition="bottom"
      imgAlt='Towels dandling into rame next a potted palm, with the words "Thank You. Your order has been placed."'
    >
      <ul className="flex flex-col gap-2 border-y border-stone-300 py-4">
        {order.items.map((item) => (
          <li
            key={item.name}
            className="flex justify-between gap-4 text-gray-800"
          >
            <span>
              {item.quantity} × {item.name}
            </span>
            <span>{formatCurrency(item.total)}</span>
          </li>
        ))}
      </ul>

      <p className="flex justify-between text-lg font-bold text-stone-950">
        <span>Total</span>
        <span>{formatCurrency(order.total)}</span>
      </p>

      <p className="text-base text-gray-800">
        Estimated delivery: 3–5 working days
      </p>

      <p className="border-t border-stone-300 pt-4 text-sm text-gray-700">
        This is a demo store: no real order has been placed, nothing will be
        delivered and no money was charged.
      </p>
    </PageTemplate>
  );
};
