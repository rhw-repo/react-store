import { useMutation } from "@tanstack/react-query";
import type { CartItem } from "./useShoppingCart";

export function useCheckout() {
  return useMutation({
    mutationFn: async (items: CartItem[]): Promise<string> => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        },
      );
      if (!res.ok) {
        throw new Error(`POST /create-checkout-session failed: ${res.status}`);
      }
      const { url } = (await res.json()) as { url: string };
      return url;
    },
    // Leave the app for Stripe's hosted payment page
    onSuccess: (url) => {
      window.location.href = url;
    },
  });
}
