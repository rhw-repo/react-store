import { MongoClient } from "mongodb";
import items from "./data/items.json" with { type: "json" };
import user from "./data/user.json" with { type: "json" };

export type Item = {
  id: number;
  name: string;
  price: number;
  imgUrl: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  // Set on the user's first checkout
  stripeCustomerId?: string;
};

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not set in server/.env");
}

const client = new MongoClient(uri);
await client.connect();

const db = client.db();
const itemsCollection = db.collection<Item>("items");

await itemsCollection.createIndex({ id: 1 }, { unique: true });

// Seed from items.json only on first start; after that the database is the
// source of truth
const itemCount = await itemsCollection.countDocuments();
if (itemCount === 0) {
  await itemsCollection.insertMany(items);
}

const usersCollection = db.collection<User>("users");

await usersCollection.createIndex({ id: 1 }, { unique: true });
await usersCollection.createIndex({ email: 1 }, { unique: true });

// Seed the mock user only on first start, so a saved stripeCustomerId survives restarts
const userCount = await usersCollection.countDocuments();
if (userCount === 0) {
  await usersCollection.insertOne(user);
}

export async function getItems(): Promise<Item[]> {
  return itemsCollection
    .find({}, { projection: { _id: 0 } })
    .sort({ id: 1 })
    .toArray();
}

export async function getItem(id: number): Promise<Item | null> {
  return itemsCollection.findOne({ id }, { projection: { _id: 0 } });
}

export async function getUser(id: string): Promise<User | null> {
  return usersCollection.findOne({ id }, { projection: { _id: 0 } });
}

export async function setStripeCustomerId(
  userId: string,
  stripeCustomerId: string,
): Promise<void> {
  await usersCollection.updateOne({ id: userId }, { $set: { stripeCustomerId } });
}
