import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import user from "./data/user.json" with { type: "json" };
//import { cors } from "hono/cors";
import Stripe from "stripe";
import { zValidator } from "@hono/zod-validator";
import z from "zod";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-08-26.dahlia",
});
