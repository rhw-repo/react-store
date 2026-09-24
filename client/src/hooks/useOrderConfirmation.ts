import { useQuery } from "@tanstack/react-query";

export type OrderConfirmation = {
  orderNumber: string;
  items: { name: string; quantity: number; total: number }[];
  total: number;
};

export function useOrderConfirmation(sessionId: string | null) {
  return useQuery({
    queryKey: ["order-confirmation", sessionId],
    queryFn: async (): Promise<OrderConfirmation> => {
      const res = await fetch(
        `http://localhost:4000/order-confirmation?sessionId=${encodeURIComponent(sessionId ?? "")}`,
      );
      if (!res.ok) {
        throw new Error(`GET /order-confirmation failed: ${res.status}`);
      }
      return res.json();
    },
    // Only fetch when the URL has a session id
    enabled: sessionId != null,
    // "Order not found" won't change by retrying
    retry: false,
  });
}
