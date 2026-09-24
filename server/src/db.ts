import { DatabaseSync } from "node:sqlite";
import items from "./data/items.json" with { type: "json" };

export type Item = {
  id: number;
  name: string;
  price: number;
  imgUrl: string;
};

// Resolves to server/store.db whether this runs from src/ (tsx) or dist/ (node)
const db = new DatabaseSync(new URL("../store.db", import.meta.url));

// Prices are stored as whole cents: floats can't represent most euro amounts exactly
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id          INTEGER PRIMARY KEY,
    name        TEXT    NOT NULL,
    price_cents INTEGER NOT NULL,
    img_url     TEXT    NOT NULL
  )
`);

// Upsert so edits to items.json reach the database on the next start
const seedItem = db.prepare(`
  INSERT INTO items (id, name, price_cents, img_url)
  VALUES (?, ?, ?, ?)
  ON CONFLICT (id) DO UPDATE SET
    name        = excluded.name,
    price_cents = excluded.price_cents,
    img_url     = excluded.img_url
`);

for (const item of items) {
  seedItem.run(item.id, item.name, Math.round(item.price * 100), item.imgUrl);
}

const itemColumns = "id, name, price_cents / 100.0 AS price, img_url AS imgUrl";
const selectItems = db.prepare(`SELECT ${itemColumns} FROM items ORDER BY id`);
const selectItem = db.prepare(`SELECT ${itemColumns} FROM items WHERE id = ?`);

export const getItems = () => selectItems.all() as Item[];

export const getItem = (id: number) => selectItem.get(id) as Item | undefined;
