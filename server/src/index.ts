import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
//import user from "./data/user.json" with { type: "json" };
import { /*getItem,*/ getItems } from "./db.js";
//import Stripe from "stripe";
//import { checkoutBody, successQuery, type CheckoutBody } from "./schemas/checkout.js";
//import { validateBody, validateQuery } from "./middleware/validate.js";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2026-08-26.dahlia",
// });

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

/* STRIPE: disabled while checking the client can reach the server.
   Re-enable together with the commented-out imports and Stripe client at the top of the file.

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

    res.json({ url: session.url });
  },
);

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
