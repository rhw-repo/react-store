import { useSearchParams } from "react-router-dom";
import { useCancelledCheckout } from "../hooks/useCancelledCheckout";
import PageTemplate from "../components/PageTemplate";
import { NotFound } from "./NotFound";

// Stripe redirects here when the shopper leaves the payment page without paying
export const CheckoutCancelled = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { isPending, isError } = useCancelledCheckout(sessionId);

  if (sessionId == null || isError) {
    return <NotFound />;
  }

  if (isPending) {
    return <p className="m-4 text-lg text-gray-800">Checking your checkout…</p>;
  }

  return (
    <PageTemplate
      heading="Your cart is saved"
      subheading="No payment was taken."
      message="Check out whenever you're ready."
      imgSrc="/imgs/cancel.webp"
      imgPosition="bottom"
      imgAlt='Towels hanging from a wooden rack next to a potted palm, with the words "Order Cancelled. This order has not been fulfilled."'
    />
  );
};
