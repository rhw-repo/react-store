import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import user from "./data/user.json" with { type: "json" };
import { getItem, getItems } from "./db.js";
import { cors } from "hono/cors";
//import Stripe from "stripe";
import { zValidator } from "@hono/zod-validator";
import z from "zod";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2026-08-26.dahlia",
// });

const handledSessions = new Set<string>();

const app = new Hono();

//const port = process.env.PORT;

app.use("*", cors({ origin: process.env.CLIENT_URL! }));

app.get("/items", (c) => c.json(getItems()));

/* STRIPE: disabled while checking the client can reach the server.
   Re-enable together with the Stripe import and client at the top of the file.

const checkoutBody = z.object({
  items: z
    .array(
      z.object({
        id: z.number().int(),
        quantity: z.number().int().positive(),
      }),
    )
    .nonempty(),
});

// Create the checkout sesion for the whole cart. The client sends only ids and
// quantities; prices always come from the database.
app.post(
  "/create-checkout-session",
  zValidator("json", checkoutBody),
  async (c) => {
    const { items } = c.req.valid("json");

    const lineItems = [];
    for (const { id, quantity } of items) {
      const product = getItem(id);
      if (product == null) {
        return c.json({ error: `Unknown item ${id}` }, 400);
      }
      lineItems.push({
        price_data: {
          currency: "eur",
          unit_amount: Math.round(product.price * 100),
          product_data: {
            name: product.name,
            metadata: { productId: String(product.id) },
          },
        },
        quantity,
      });
    }

    let customerId = user.stripeCustomerId;
    if (customerId == null) {
      // If no stripeCustomerId then create a new one
      const customer = await stripe.customers.create({
        name: user.name,
        email: user.email,
        // metadata is custom data can set to anything useful to you
        // example: linking stripeCustomerId to your customer id in DB etc
        metadata: {
          userID: user.id,
        },
      });
      customerId = customer.id;
      // Save customer ID to the user in the DB here if you have one
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      line_items: lineItems,
      metadata: {
        userId: user.id,
      },
      success_url:
        // Stripe replaces CHECKOUT_SESSION_ID with real checkout session id which contains ALL of the session info
        // metadata, item, price, quantity, user, everything will be provided and passed to purchase/sucess redirect
        "http://localhost:4000/purchase/success?sessionId={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/",
    });

    if (session.url == null) throw new Error("Session URL is null");

    return c.redirect(session.url);
  },
);

// Authenticate and authorise a valid purchase event
app.post("/webhooks/stripe", async (c) => {
  const signature = c.req.header("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (signature == null || secret == null) {
    return c.text("Error", 400);
  }

  // pass sessionId to fulfillPayment by destructuring it from event.data.object.id
  try {
    const event = stripe.webhooks.constructEvent(
      await c.req.raw.text(),
      signature,
      secret,
    );
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const success = await fulfillPayment(event.data.object.id);
        if (!success) return c.text("Error", 400);
        break;
      }
    }

    return c.text("Success", 200);
  } catch (err) {
    return c.text("Error", 400);
  }
});

// Send user to home page AFTER all server side logic completed
// zValidator checks sessionId is string for additional type saftey
app.get(
  "/purchase/success",
  zValidator(
    "query",
    z.object({
      sessionId: z.string(),
    }),
  ),
  async (c) => {
    const { sessionId } = c.req.query();
    if (sessionId == null) return c.text("Error", 400);

    const success = await fulfillPayment(sessionId);
    if (!success) return c.text("Error", 400);
    return c.redirect("http://localhost:5173");
  },
);

// Resuable
async function fulfillPayment(sessionId: string) {
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  if (checkoutSession.payment_status === "unpaid") {
    return false;
  }

  const productId = checkoutSession.metadata?.productId;
  const userId = checkoutSession.metadata?.userId;

  if (productId == null || userId == null) {
    return false;
  }

  if (checkoutSession.line_items?.data[0].quantity == null) {
    return false;
  }

  if (!handledSessions.has(sessionId)) {
    handledSessions.add(sessionId);
    // await addOwnedProduct(
    //   userId,
    //   productId,
    //   checkoutSession.line_items.data[0].quantity,
    // );
  }

  return true;
}
*/

serve({ fetch: app.fetch, port: 4000 }, (info) => {
  console.log(`Server running on http://localhost:${info.port}`);
});
