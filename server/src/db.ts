import { MongoClient } from "mongodb";
import items from "./data/items.json" with { type: "json" };

export type Item = {
  id: number;
  name: string;
  price: number;
  imgUrl: string;
};

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not set in server/.env");
}

const client = new MongoClient(uri);
await client.connect();

// No name given: uses the database named in MONGODB_URI (react_store_dev locally)
const db = client.db();
const itemsCollection = db.collection<Item>("items");

await itemsCollection.createIndex({ id: 1 }, { unique: true });

// Seed from items.json only on first start; after that the database is the
// source of truth
const itemCount = await itemsCollection.countDocuments();
if (itemCount === 0) {
  await itemsCollection.insertMany(items);
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
