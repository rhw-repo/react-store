import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useShoppingCart } from "../hooks/useShoppingCart";
import { useOrderConfirmation } from "../hooks/useOrderConfirmation";
import { formatCurrency } from "../utilities/formatCurrency";
import Button from "../components/Button";

const cardClasses =
  "flex flex-col gap-4 w-full max-w-md m-4 p-8 bg-stone-100 rounded-sm shadow-xl shadow-stone-900/15";

// Stripe redirects here after a successful test payment
export const CheckoutSuccess: React.FC = () => {
  const { clearCart } = useShoppingCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { data: order, isPending, isError } = useOrderConfirmation(sessionId);

  // Empty the cart only once the server has confirmed the payment
  useEffect(() => {
    if (order) {
      clearCart();
    }
  }, [order, clearCart]);

  function handleGoToStore() {
    navigate("/store");
  }

  if (sessionId == null || isError) {
    return (
      <section className={cardClasses}>
        <h1 className="text-3xl font-bold text-stone-950 text-center">
          Order not found
        </h1>
        <p className="text-base text-gray-700 text-center">
          We couldn't find a paid order for this page.
        </p>
        <Button variant="default" dataKey="goToStore" onClick={handleGoToStore} />
      </section>
    );
  }

  if (isPending) {
    return <p className="m-4 text-lg text-gray-800">Loading your order…</p>;
  }

  return (
    <section className={cardClasses}>
      <h1 className="text-3xl font-bold text-stone-950 text-center">Thank you!</h1>
      <p className="text-lg text-gray-800 text-center">
        Order <span className="font-bold">#{order.orderNumber}</span>
      </p>

      <ul className="flex flex-col gap-2 border-y border-stone-300 py-4">
        {order.items.map((item) => (
          <li key={item.name} className="flex justify-between gap-4 text-gray-800">
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

      <Button variant="default" dataKey="goToStore" onClick={handleGoToStore} />
    </section>
  );
};
