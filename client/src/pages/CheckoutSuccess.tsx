import { useEffect } from "react";
import { useShoppingCart } from "../hooks/useShoppingCart";
import BlankPagesTemplate from "../components/BlankPagesTemplate";

// Stripe redirects here after a successful test payment
export const CheckoutSuccess: React.FC = () => {
  const { clearCart } = useShoppingCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <BlankPagesTemplate
      heading="Thank you!"
      subheading="Your test payment was successful."
      message="This was a Stripe test payment, so no real money was charged."
    />
  );
};
