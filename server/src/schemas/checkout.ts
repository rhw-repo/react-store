import z from "zod";

// The cart sent to POST /create-checkout-session: ids and quantities only.
// Prices always come from the database, never from the client.
export const checkoutBody = z.object({
  items: z
    .array(
      z.object({
        id: z.number().int(),
        quantity: z.number().int().positive(),
      }),
    )
    .nonempty(),
});

export type CheckoutBody = z.infer<typeof checkoutBody>;

// The ?sessionId=... Stripe adds when redirecting to GET /purchase/success
export const successQuery = z.object({
  sessionId: z.string(),
});
