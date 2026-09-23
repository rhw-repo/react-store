# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This project uses **pnpm** (pinned via `packageManager` in package.json). Don't run `npm install` — it would regenerate an npm lockfile alongside `pnpm-lock.yaml`.

```bash
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

**Tailwind v4 with a small theme layer.** Tailwind comes in through the `@tailwindcss/vite` plugin in [vite.config.ts](vite.config.ts). [src/index.css](src/index.css) holds `@import "tailwindcss"`, self-hosted `@font-face` rules pointing at `public/`, an `@theme` block, and an `@layer base`. The theme defines two font tokens (`--font-body` Noto-Serif, `--font-ui` Instrument Sans), three colours (`--color-shell`, `--color-ink`, `--color-stone`), and three shadows — each one generating matching utilities (`font-ui`, `text-ink`, `shadow-bar`). Everything outside those namespaces is still an inline arbitrary value (`bg-[url('...')]`, `w-[clamp(2.5rem,6vw,3.5rem)]`, `[@media_(min-width:768px)_and_(orientation:portrait)]:...`), so a new spacing scale or breakpoint means extending `@theme` again.

**Shadows carry a deliberate elevation hierarchy.** Nothing sits above the surface containing it: card `lg`→`xl` on hover, primary buttons `md`→`lg`, icon buttons `sm`→`md`, outline `xs`→`md`, ghost flat→`sm`, and static imagery `sm` with no hover step (the card lifts instead). Buttons press back down on `active:`. Shadows are *tinted* rather than left the default near-black — to the element's own fill for buttons (`shadow-teal-950/40`, `shadow-rose-900/40`), and to warm `stone-900` for neutral surfaces; an untinted shadow is close to invisible against saturated fills like `bg-teal-700` or the warm `bg-stone-300` bars. Button elevation lives in `Button.tsx`'s `tv()` map; the fixed surfaces use the `--shadow-*` theme tokens. Note `--shadow-bar-inverted` has a *negative* y-offset — Tailwind's built-in shadows all cast downward, so on a bottom bar they fall off the page instead of separating it from the content above.

**Class conflicts are resolved by `tailwind-variants` itself.** `tv()` merges conflicting Tailwind classes internally as of tailwind-variants 3.3, so `tailwind-merge` is deliberately *not* a dependency here — it was removed once the lockfile moved to tv 3.3.1. This is load-bearing: `Button`'s `base` sets `rounded-sm` while the `blankPages` variant sets `rounded`, and the variant wins because of that internal merge. Don't reinstall `tailwind-merge` to "fix" such a conflict, and only add it back if something imports `twMerge`/`extendTailwindMerge` directly.

**Provider tree** ([src/App.tsx](src/App.tsx)): `ErrorBoundary` (class component, resets on `resetKey={location.pathname}`) wraps `ShoppingCartProvider`, which renders `Navbar`, the routed `main`, and `Footer`. `BrowserRouter` lives in [src/main.tsx](src/main.tsx).

**Routes**: `/`, `/store`, `/about`. Only [Store](src/pages/Store.tsx) has real content; [Home](src/pages/Home.tsx) and [About](src/pages/About.tsx) both just render [BlankPagesTemplate](src/components/BlankPagesTemplate.tsx), the shared "Coming Soon" placeholder.

**Cart state** is split across two files to satisfy `react-refresh/only-export-components`, which requires a file exporting a component to export *nothing else*. [src/hooks/useShoppingCart.ts](src/hooks/useShoppingCart.ts) holds the `createContext` object, the `CartItem` type, and the `useShoppingCart()` hook that components consume; [src/context/ShoppingCartProvider.tsx](src/context/ShoppingCartProvider.tsx) exports only `ShoppingCartProvider` and imports the context object from the hook file. Keep that direction — moving the context object back beside the provider puts a non-component export in a component file and the lint error returns. The provider also renders the `ShoppingCart` drawer itself, after `{children}` — the drawer is always mounted and slides in/out on `isOpen`, so it does not appear in any page's JSX. Cart state persists through [useLocalStorage](src/hooks/useLocalStorage.ts) under the key `shopping-cart`. All updates use functional `setCartItems` and build new arrays rather than mutating, so the handlers are wrapped in `useCallback` with `[setCartItems]` and the context value in a `useMemo`.

**Product data is joined by id, not stored in the cart.** `cartItems` holds only `{ id, quantity }`. [StoreItemCard](src/components/StoreItemCard.tsx), [CartItem](src/components/CartItem.tsx), and [ShoppingCart](src/components/ShoppingCart.tsx) each import [src/data/items.json](src/data/items.json) directly and look the item up by id for name, price, and image. Cart totals are computed in the same way at render time.

## Conventions

**Buttons go through [src/components/Button.tsx](src/components/Button.tsx).** It is the DRY pattern the project exists to demonstrate: styles come from a `tv()` variant map, and the *label* comes from `getButtonText(dataKey)` in [src/utilities/getButtonText.ts](src/utilities/getButtonText.ts) — `Button` takes no children. Adding a button means adding a `variant` entry in `Button.tsx` and, if the text is new, a member of the `DataKey` union plus a `switch` case. `dataKey` is also emitted as a `data-key` attribute. The cart icon in [Navbar](src/components/Navbar.tsx) is the one deliberate exception: `Button` renders a string label and takes no children, so it cannot hold an SVG plus the quantity badge. Every other button goes through the component — including the fallback UI in [ErrorBoundary](src/components/ErrorBoundary.tsx), which shares the `blankPages` variant with [BlankPagesTemplate](src/components/BlankPagesTemplate.tsx), so restyling that variant changes both the error screen and the Coming Soon pages together.

**Prices** always render through [formatCurrency](src/utilities/formatCurrency.ts) (EUR, locale-default formatting).

**Images** live in `public/imgs/` and are referenced by absolute path (`/imgs/name.webp`) from `items.json` or imported as `"/imgs/..."`. The README carries per-image photographer credits; adding an image means adding its credit there.

**TypeScript** is strict with `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, and `verbatimModuleSyntax` — type-only imports must be written `import type { ... }` or `import { type Foo }`, as the existing files do.

**Responsive styling** leans heavily on `portrait:` / `landscape:` orientation variants alongside breakpoints; the placeholder and error pages are the main examples.
