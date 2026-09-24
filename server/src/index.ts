import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { getItem, getItems, getUser, setStripeCustomerId } from "./db.js";
import Stripe from "stripe";
import { checkoutBody, successQuery, type CheckoutBody } from "./schemas/checkout.js";
import { validateBody, validateQuery } from "./middleware/validate.js";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not set in server/.env");
}
// Test mode only: this demo must never be able to charge a real card
if (!stripeSecretKey.startsWith("sk_test_")) {
  throw new Error("STRIPE_SECRET_KEY must be a test-mode key (sk_test_...)");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2026-08-26.dahlia",
});

const handledSessions = new Set<string>();

const app = express();
app.disable("x-powered-by");
app.use(helmet());

// Without this check a missing CLIENT_URL would make cors() allow every origin
const clientUrl = process.env.CLIENT_URL;
if (!clientUrl) {
  throw new Error("CLIENT_URL is not set in server/.env");
}

app.use(cors({ origin: clientUrl }));

app.get("/items", async (_req, res) => {
  res.json(await getItems());
});

// Create the checkout sesion for the whole cart. The client sends only ids and
// quantities; prices always come from the database.
app.post(
  "/create-checkout-session",
  express.json(),
  validateBody(checkoutBody),
  async (req, res) => {
    const { items } = req.body as CheckoutBody;

    const lineItems = [];
    for (const { id, quantity } of items) {
      const product = await getItem(id);
      if (product == null) {
        res.status(400).json({ error: `Unknown item ${id}` });
        return;
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

    // The demo user is always signed in until real login exists
    const user = await getUser("user_123");
    if (user == null) {
      res.status(500).json({ error: "User not found" });
      return;
    }

    // Create the Stripe customer on the user's first checkout, then reuse it
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        name: user.name,
        email: user.email,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await setStripeCustomerId(user.id, customerId);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      line_items: lineItems,
      metadata: {
        userId: user.id,
      },
      // Stripe replaces {CHECKOUT_SESSION_ID} with the real id when redirecting
      success_url: `${clientUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/store`,
    });

    if (session.url == null) throw new Error("Session URL is null");

    res.json({ url: session.url });
  },
);

// Order summary for the Thank-you page. Read-only: asks Stripe for the session
// and returns a summary only if it has been paid.
app.get(
  "/order-confirmation",
  validateQuery(successQuery),
  async (req, res) => {
    const sessionId = req.query.sessionId as string;

    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    if (session.payment_status !== "paid") {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
      limit: 100,
    });

    // Stripe amounts are in cents; the client works in euros
    const items = [];
    for (const lineItem of lineItems.data) {
      items.push({
        name: lineItem.description,
        quantity: lineItem.quantity,
        total: lineItem.amount_total / 100,
      });
    }

    res.json({
      orderNumber: sessionId.slice(-8).toUpperCase(),
      items,
      total: (session.amount_total ?? 0) / 100,
    });
  },
);

/* STRIPE WEBHOOKS: future stretch feature, off until a security review.
   Needs STRIPE_WEBHOOK_SECRET.

// Authenticate and authorise a valid purchase event
// express.raw keeps the exact bytes Stripe sent: its signature check fails on a parsed body
app.post(
  "/webhooks/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (typeof signature !== "string" || !secret) {
      res.sendStatus(400);
      return;
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, signature, secret);
    } catch (err) {
      console.log("Webhook signature verification failed.", (err as Error).message);
      res.sendStatus(400);
      return;
    }

    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const success = await fulfillPayment(event.data.object.id);
        if (!success) {
          res.sendStatus(400);
          return;
        }
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}.`);
    }

    res.sendStatus(200);
  },
);

// Send user to home page AFTER all server side logic completed
// validateQuery checks sessionId is a string before the handler runs
app.get(
  "/purchase/success",
  validateQuery(successQuery),
  async (req, res) => {
    const sessionId = req.query.sessionId as string;

    const success = await fulfillPayment(sessionId);
    if (!success) {
      res.sendStatus(400);
      return;
    }
    res.redirect(clientUrl);
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

const port = 4000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
