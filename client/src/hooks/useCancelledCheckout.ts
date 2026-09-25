import { useQuery } from "@tanstack/react-query";

export function useCancelledCheckout(sessionId: string | null) {
  return useQuery({
    queryKey: ["cancelled-checkout", sessionId],
    queryFn: async (): Promise<null> => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/checkout-cancelled?sessionId=${encodeURIComponent(sessionId ?? "")}`,
      );
      if (!res.ok) {
        throw new Error(`GET /checkout-cancelled failed: ${res.status}`);
      }
      // TanStack Query doesn't allow undefined as data
      return null;
    },
    // Only fetch when the URL has a session id
    enabled: sessionId != null,
    // A rejected session won't become valid by retrying
    retry: false,
  });
}
