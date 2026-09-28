### React + TypeScript + Vite + Tailwind

![Tailwind CSS](https://readmebadge.vercel.app/badges/tailwind.svg) ![React](https://readmebadge.vercel.app/badges/react.svg)
![Typescript](https://readmebadge.vercel.app/badges/typescript.svg)

Iteration of e-commerce app to integrate with Stripe Payment.

Currently in development.

## Tech Stack

- React 19 + TypeScript
- Tailwind CSS v4 with Tailwind Variants
- React Router
- TanStack Query
- Node.js + Express 5
- MongoDB
- Zod
- Helmet
- Stripe Checkout

---

#### To run this project locally:

1. Click Fork on GitHub

2. Clone your fork:

```
git clone https://github.com/<your-username>/react-store.git
```

The project has two parts, each with its own dependencies: `client/` (React) and `server/` (Express API). There is no `package.json` at the repo root.

3. Copy each example environment file and fill in the values. You'll need a MongoDB database and a Stripe secret key.

```
cp react-store/server/.env.example react-store/server/.env
cp react-store/client/.env.example react-store/client/.env
```

4. Install and start the server:

```
cd react-store/server
pnpm install
pnpm dev
```

5. In a second terminal, install and start the client:

```
cd react-store/client
pnpm install
pnpm dev
```

6. Open http://localhost:5173/store

---

### [Connect with me on LinkedIn](https://www.linkedin.com/in/ruth-westnidge/)

---
