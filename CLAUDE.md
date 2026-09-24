# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Two independent packages, `client/` (React) and `server/` (Express API). No root `package.json`: run commands inside each folder.

```bash
# client/
pnpm dev       # Vite, :5173
pnpm build     # type check + bundle
pnpm lint
pnpm preview

# server/
pnpm dev       # tsx watch, :4000
pnpm build     # tsc → dist/
pnpm start
```

- **Always `pnpm`, never `npm`.**
- Run client and server together in development; the Store page loads products from the server.
- No test framework. `pnpm build` is the type check. Run it bare, with no extra arguments.
- Keep TypeScript at `~6.0` in both packages (`typescript-eslint` doesn't support 7.0). Never `pnpm add typescript@latest`.
- Keep `CLAUDE.md` and `README.md` at the repo root; inside `client/`, Tailwind scans them and adds unused CSS.
- Don't add `source("…")` to the Tailwind import in [client/src/index.css](client/src/index.css).

## Deployment

Not deployed yet. Deploy as two services with root directories `client` and `server`.

- Secrets go in the host's environment variables, never in the repo.
- Before deploying, move hard-coded `localhost` URLs to environment variables: the fetch in `useStoreItems.ts`, and the Stripe redirects in the server.

## Dependency policy

- `client/` and `server/` each have their own `package.json`, lockfile and `pnpm-workspace.yaml`.
- If an install is blocked by `minimumReleaseAge` (7 days) and pnpm offers an exclusion, **answer N**. Wait, or use an older version.
- Don't loosen `blockExoticSubdeps`, `trustPolicy` or the `overrides`. Permit install scripts only through `allowBuilds`.
- Check the package name before installing, and the `package.json` diff before committing.
- `pnpm update` stays within the existing range. Use `pnpm add <pkg>@<version>` to bump, then `pnpm peers check`.

## Purpose

A demo store that uses Stripe's sandbox (test mode) to demonstrate a payment screen.

## Architecture

**Styling**
- Tailwind v4 through the `@tailwindcss/vite` plugin. No PostCSS config; don't add `postcss` or `autoprefixer`.
- Theme tokens live in the `@theme` block of [client/src/index.css](client/src/index.css): fonts (`--font-body`, `--font-ui`), colours (`--color-shell`, `--color-ink`, `--color-stone`) and shadows (`--shadow-media`, `--shadow-bar`, `--shadow-bar-inverted`). Add new scales or breakpoints there.
- Tint shadows: to the button's own fill (`shadow-teal-950/40`) or to `stone-900` for surfaces. Never leave them untinted.
- Nothing casts a bigger shadow than the surface it sits on. Buttons press down on `active:`.
- Don't give the three `--shadow-*` tokens the same alpha; the bar shadows are heavier on purpose. `--shadow-bar-inverted` casts upward, for the bottom bar.
- `tailwind-variants` resolves conflicting classes itself. Don't add `tailwind-merge`.

**App structure**
- [main.tsx](client/src/main.tsx): `QueryClientProvider` → `BrowserRouter` → `App`. Create exactly one `QueryClient`, at module scope.
- [App.tsx](client/src/App.tsx): `ErrorBoundary` (resets on route change) → `ShoppingCartProvider` → `Navbar`, routes, `Footer`.
- Routes: `/store` is the only real page. `/`, `/about` and unknown paths render `BlankPagesTemplate`.
- Keep the cart context object and `useShoppingCart()` in [hooks/useShoppingCart.ts](client/src/hooks/useShoppingCart.ts). [ShoppingCartProvider.tsx](client/src/context/ShoppingCartProvider.tsx) must export only the component, or the `react-refresh` lint rule fails.
- The provider renders the cart drawer itself, so the drawer is always mounted.
- The cart persists in localStorage (`shopping-cart`). Update it immutably through functional `setCartItems`.
- Cart items are `{ id, quantity }` only. Names, prices and images come from [useStoreItems()](client/src/hooks/useStoreItems.ts) (`GET /items` through TanStack Query) and are looked up by id at render time.
- `Store` rethrows a failed product fetch to the `ErrorBoundary`. The cart drawer falls back to an empty list instead.

## The `server/` package

- Express 5 on Node 24, port 4000. Entry point: [server/src/index.ts](server/src/index.ts). Keep `@types/node` at `^24`.
- `helmet()` sets security headers on every response. Keep it first.
- Configuration comes from `server/.env` (gitignored), loaded by `dotenv`. Start the server from `server/`, and restart it after editing `.env`.
- Environment variables: `MONGODB_URI`, `CLIENT_URL`, `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`. `CLIENT_URL` is the only origin CORS allows and must match the client's origin exactly. The server refuses to start without it; never remove that check, because `cors()` with no origin allows every site.
- Request validation: zod schemas go in `src/schemas/`, and routes check them with `validateBody()` / `validateQuery()` from [middleware/validate.ts](server/src/middleware/validate.ts).
- Parse JSON per route with `express.json()`, never app-wide: the Stripe webhook needs the raw body.
- [db.ts](server/src/db.ts) uses the official `mongodb` driver. It connects when imported and stops with an error if `MONGODB_URI` is missing.
- The `items` collection has a unique index on `id` and is seeded from `data/items.json` only when empty; after that the database is the source of truth. `getItems()` and `getItem()` are async and leave out `_id`.
- Prices are stored in euros. Convert with `Math.round(price * 100)` for Stripe.
- [data/user.json](server/src/data/user.json) is a mock user.
- The server tsconfig is strict but doesn't flag unused variables, and there's no lint.

**Stripe is switched off.** Its code is commented out: the block marked `STRIPE:`, plus the commented-out imports and client at the top of `index.ts`.
- Scope: Checkout in test mode only. Cart → `POST /create-checkout-session` → Stripe's hosted payment page → client Thank-you page (`success_url`) or back to the store (`cancel_url`).
- Use a test-mode secret key (`sk_test_…`) in every environment, including deployed.
- Replace the hard-coded `localhost` in `success_url` and `cancel_url`.

**Webhooks are a future stretch feature,** not part of checkout. Leave `/webhooks/stripe`, `/purchase/success` and `fulfillPayment` commented out. Recording orders needs them, and they need a security review before going public.

## Conventions

- **Every button goes through [Button.tsx](client/src/components/Button.tsx).** Styles come from its `tv()` variant map and the label from `getButtonText(dataKey)`; `Button` takes no children. A new button means a new `variant`, plus a `DataKey` case if the text is new. The only exception is the Navbar cart icon.
- The `blankPages` variant styles both the error screen and the Coming Soon pages.
- **Write class names in full.** Never build them from pieces (`` `bg-${color}-600` ``), because Tailwind can't see them and they silently disappear. Put each full class string in a variant map and select it by key.
- Render prices with [formatCurrency](client/src/utilities/formatCurrency.ts) (EUR).
- Images go in `client/public/imgs/` and are referenced as `/imgs/name.webp`. Add a photographer credit to the README for each new image.
- Product images use `alt=""`, because the product name is right beside them. Decorative images with no text next to them get a descriptive `alt`.
- Client TypeScript is strict (`noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, `verbatimModuleSyntax`). Write type-only imports as `import type`.
- Responsive styling uses `portrait:`/`landscape:` variants alongside breakpoints.
