# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**The app lives in `client/`, not at the repo root.** The root holds only `README.md`, this file, and `client/`. Every command below, and every `pnpm` invocation, must run from `client/` — that is where `package.json`, the tsconfigs and `vite.config.ts` are. Railway's service root directory must be set to `client` for the same reason.

Keep `CLAUDE.md` and `README.md` at the repo root. Tailwind v4 scans the tree under its own root for class names, and these files quote a lot of utilities in prose (`bg-teal-700`, `shadow-bar`); when they sat inside the scanned tree they added ~1 kB of CSS that no component used. Moving either one into `client/` reinstates that.

Don't add `source("…")` to the `@import "tailwindcss"` line in [client/src/index.css](client/src/index.css) to scope scanning to `src`. It was tried and removed: Tailwind's automatic base path is already `client/`, so the directive produced a byte-identical bundle (same content hash), while `source()` is not valid CSS — VS Code's built-in validator reports *semi-colon expected* on it as a parse error, which no lint setting can suppress. The `@source not` line below it is worth the unknown-at-rule warning; `source()` was not worth the error.

This project uses **pnpm** (pinned via `packageManager` in package.json). Don't run `npm install` — it would regenerate an npm lockfile alongside `pnpm-lock.yaml`.

```bash
cd client
pnpm install
pnpm dev       # Vite dev server
pnpm build     # tsc -b (project references) then vite build
pnpm lint      # eslint over the repo
pnpm preview   # serve the production build
```

There is no test framework in this project — no test runner, config, or test files. `pnpm build` is the type check (`tsc -b` runs before the bundle), so run it after non-trivial type changes.

Note that `pnpm build` passes trailing arguments through to the script, so run it bare — `pnpm build` with anything appended ends up as arguments to `vite build` and fails on unknown options.

Deployed to Railway: https://tailwindproject-staging.up.railway.app/store

## Purpose

Per the README, this is a sandbox for practising Tailwind CSS with DRY styling through Tailwind Variants. Styling decisions (centralising variants rather than repeating class strings) are the point of the project, not incidental.

## Architecture

**Tailwind v4 with a small theme layer.** Tailwind comes in through the `@tailwindcss/vite` plugin in [client/vite.config.ts](client/vite.config.ts). [client/src/index.css](client/src/index.css) holds `@import "tailwindcss"`, self-hosted `@font-face` rules pointing at `client/public/`, an `@theme` block, and an `@layer base`. The theme defines two font tokens (`--font-body` Noto-Serif, `--font-ui` Instrument Sans), three colours (`--color-shell`, `--color-ink`, `--color-stone`), and three shadows — each one generating matching utilities (`font-ui`, `text-ink`, `shadow-bar`). Everything outside those namespaces is still an inline arbitrary value (`bg-[url('...')]`, `w-[clamp(2.5rem,6vw,3.5rem)]`, `[@media_(min-width:768px)_and_(orientation:portrait)]:...`), so a new spacing scale or breakpoint means extending `@theme` again.

**Shadows carry a deliberate elevation hierarchy.** Nothing sits above the surface containing it: the card rests at `xl` and darkens its tint rather than growing (`shadow-stone-900/15`→`/20` on hover) — it is the same `bg-stone-100` as the page, so the shadow is the only thing defining its edge and it cannot afford a lighter resting state; primary buttons `md`→`lg`, the ghost `closeCart` icon button flat→`sm`, the cart's stepper controls and `Delete` flat with no hover step at all, and static imagery `--shadow-media` with no hover step (the card lifts instead). Buttons press back down on `active:`. Shadows are *tinted* rather than left the default near-black — to the element's own fill for buttons (`shadow-teal-950/40`, `shadow-rose-900/40`), and to warm `stone-900` for neutral surfaces; an untinted shadow is close to invisible against saturated fills like `bg-teal-700` or the warm `bg-stone-300` bars.

**The page itself is `--color-shell`, which is Tailwind's `stone-100` (`oklch(97% 0.001 106.424)`).** Two consequences for the tokens. First, a shadow drags a 97%-lightness backdrop down further than it did the saturated shell this project started with, so surface shadows read heavier at the same alpha — `--shadow-media` sits at `0.3` for that reason. Second, the bars are `bg-stone-300` on a `stone-100` page: two steps of one ramp, no hue difference between them, so `--shadow-bar` and `--shadow-bar-inverted` are the main thing separating a bar from the content it overlaps. Those two keep their heavier weights on purpose. Don't flatten the three `--shadow-*` tokens to a single alpha for consistency — the page lightness pushes surface shadows and bar shadows in opposite directions. The warm `rgb(28 25 23)` tint stays right, since the shell is warm-neutral rather than saturated. Button elevation lives in `Button.tsx`'s `tv()` map; the fixed surfaces use the `--shadow-*` theme tokens. Note `--shadow-bar-inverted` has a *negative* y-offset — Tailwind's built-in shadows all cast downward, so on a bottom bar they fall off the page instead of separating it from the content above.

**Class conflicts are resolved by `tailwind-variants` itself.** `tv()` merges conflicting Tailwind classes internally as of tailwind-variants 3.3, so `tailwind-merge` is deliberately *not* a dependency here — it was removed once the lockfile moved to tv 3.3.1. This is load-bearing: `Button`'s `base` sets `rounded-sm` while the `blankPages` variant sets `rounded`, and the variant wins because of that internal merge. Don't reinstall `tailwind-merge` to "fix" such a conflict, and only add it back if something imports `twMerge`/`extendTailwindMerge` directly.

**Provider tree** ([client/src/App.tsx](client/src/App.tsx)): `ErrorBoundary` (class component, resets on `resetKey={location.pathname}`) wraps `ShoppingCartProvider`, which renders `Navbar`, the routed `main`, and `Footer`. `BrowserRouter` lives in [client/src/main.tsx](client/src/main.tsx).

**Routes**: `/`, `/store`, `/about`. Only [Store](client/src/pages/Store.tsx) has real content; [Home](client/src/pages/Home.tsx) and [About](client/src/pages/About.tsx) both just render [BlankPagesTemplate](client/src/components/BlankPagesTemplate.tsx), the shared "Coming Soon" placeholder.

**Cart state** is split across two files to satisfy `react-refresh/only-export-components`, which requires a file exporting a component to export *nothing else*. [client/src/hooks/useShoppingCart.ts](client/src/hooks/useShoppingCart.ts) holds the `createContext` object, the `CartItem` type, and the `useShoppingCart()` hook that components consume; [client/src/context/ShoppingCartProvider.tsx](client/src/context/ShoppingCartProvider.tsx) exports only `ShoppingCartProvider` and imports the context object from the hook file. Keep that direction — moving the context object back beside the provider puts a non-component export in a component file and the lint error returns. The provider also renders the `ShoppingCart` drawer itself, after `{children}` — the drawer is always mounted and slides in/out on `isOpen`, so it does not appear in any page's JSX. Cart state persists through [useLocalStorage](client/src/hooks/useLocalStorage.ts) under the key `shopping-cart`. All updates use functional `setCartItems` and build new arrays rather than mutating, so the handlers are wrapped in `useCallback` with `[setCartItems]` and the context value in a `useMemo`.

**Product data is joined by id, not stored in the cart.** `cartItems` holds only `{ id, quantity }`. [StoreItemCard](client/src/components/StoreItemCard.tsx), [CartItem](client/src/components/CartItem.tsx), and [ShoppingCart](client/src/components/ShoppingCart.tsx) each import [client/src/data/items.json](client/src/data/items.json) directly and look the item up by id for name, price, and image. Cart totals are computed in the same way at render time.

## Conventions

**Buttons go through [client/src/components/Button.tsx](client/src/components/Button.tsx).** It is the DRY pattern the project exists to demonstrate: styles come from a `tv()` variant map, and the *label* comes from `getButtonText(dataKey)` in [client/src/utilities/getButtonText.ts](client/src/utilities/getButtonText.ts) — `Button` takes no children. Adding a button means adding a `variant` entry in `Button.tsx` and, if the text is new, a member of the `DataKey` union plus a `switch` case. `dataKey` is also emitted as a `data-key` attribute. The cart icon in [Navbar](client/src/components/Navbar.tsx) is the one deliberate exception: `Button` renders a string label and takes no children, so it cannot hold an SVG plus the quantity badge. Every other button goes through the component — including the fallback UI in [ErrorBoundary](client/src/components/ErrorBoundary.tsx), which shares the `blankPages` variant with [BlankPagesTemplate](client/src/components/BlankPagesTemplate.tsx), so restyling that variant changes both the error screen and the Coming Soon pages together.

**Class names are always written out in full.** Tailwind's extractor scans source files as plain text and generates a rule for every substring that looks like a utility — it never evaluates the code. A class assembled from fragments (`` `bg-${color}-600` ``) therefore matches nothing and is silently absent from the bundle, with no build error. There is currently no interpolation in any `className` in `src`, and the way to keep it that way is [client/src/components/Button.tsx](client/src/components/Button.tsx): map each prop value to a complete class string in the `tv()` variant map, then select by key at the call site, as `variant={isLastOne ? "remove" : "decrement"}` does in [CartItem](client/src/components/CartItem.tsx) and [StoreItemCard](client/src/components/StoreItemCard.tsx). The template literals in [ShoppingCart](client/src/components/ShoppingCart.tsx) are line-wrapping only and interpolate nothing. This is the same scanning behaviour that made the docs' placement matter, seen from the other side: only literal text counts.

**Prices** always render through [formatCurrency](client/src/utilities/formatCurrency.ts) (EUR, locale-default formatting).

**Images** live in `client/public/imgs/` and are referenced by absolute path (`/imgs/name.webp`, resolved against `client/public/` by Vite at serve time) from `items.json` or imported as `"/imgs/..."`. The README carries per-image photographer credits; adding an image means adding its credit there. Product images in [StoreItemCard](client/src/components/StoreItemCard.tsx) and [CartItem](client/src/components/CartItem.tsx) carry `alt=""` on purpose — the item name renders as text right beside them, so a filled `alt` is redundant and WAVE flags it. Decorative images with no adjacent duplicate text, like the robot in [BlankPagesTemplate](client/src/components/BlankPagesTemplate.tsx), keep a descriptive `alt`.

**TypeScript** is strict with `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, and `verbatimModuleSyntax` — type-only imports must be written `import type { ... }` or `import { type Foo }`, as the existing files do.

**Responsive styling** leans heavily on `portrait:` / `landscape:` orientation variants alongside breakpoints; the placeholder and error pages are the main examples.
