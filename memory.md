# memory.md — Epoxy Depot California storefront

Living context file. Update the **Current phase** and **Log** sections at the end of every phase.

## What this is
A front-end-only clone of the layout, design and UX of coatingwarehouse.com, rebranded as **Epoxy Depot California**.
- No backend, no database, no real auth. All catalog and content data is hardcoded in `src/data/mockData.ts`.
- **Orders are taken by phone.** There is no cart, checkout, sign-in or sign-up. Every buy action (product "Call" buttons, training seats, "Write a review", the header Call button) calls `useUI().requestCall(subject)`: touch devices (`pointer: coarse`) go straight to `siteConfig.phoneHref`; desktops open `CallToOrderModal` showing the number and what to mention (product · SKU · qty).

## Decisions (confirmed with client)
| Topic | Decision |
|---|---|
| Brand | Epoxy Depot California. Every brand string comes from `siteConfig` in `mockData.ts`. |
| Contact details | Placeholders (phone `1-800-555-0142`, `orders@epoxydepotca.example`). Swap before launch. |
| Palette | Match the live reference exactly (warm charcoal + cream + safety orange + gold). See `docs/design.md`. |
| Imagery | Unsplash for lifestyle/hero photos. Product cards use generated SVG renders (`ProductImage`). Nothing is copied from the reference site. |
| Copy | Original copy that mirrors the reference's structure and tone. Testimonials are placeholders (`isPlaceholder: true`). |
| Catalog | About 50 generic SKUs across 10 categories. No third-party manufacturer brand names. |
| Ordering | Phone only (2026-09-13). No cart, checkout or accounts. "Contractor account" means the approved trade-pricing program, not a login. |

## Stack
- Next.js **16.3** (App Router, Turbopack, React 19.2). `params`/`searchParams` are Promises; use the `PageProps<'/route'>` / `RouteContext` helpers.
- Tailwind CSS **v4**: CSS-first config in `src/app/globals.css` (`@theme`). There is no `tailwind.config.*`.
- TypeScript strict, `lucide-react` v1 (no brand icons, so social glyphs are inline SVG in `components/layout/SocialIcons.tsx`), `clsx` + `tailwind-merge` via `cn()`.
- Fonts via `next/font/google`: Inter (body), Space Grotesk (display), JetBrains Mono (SKUs).
- Lint with `npm run lint` (ESLint CLI; `next lint` was removed in v16).

## Design tokens (quick ref; full spec in docs/design.md)
`cream #F6F4EE` · `charcoal #1A1A1D` · `charcoal-2 #262629` · `ink #18181B` · `muted #52525B` · `subtle #71717A` · `dim #8A8F98` · `line #E5E0D5` · `brand #F97316` · `brand-dark #EA580C` · `gold #D9A441` · `success #4ADE80`

## Component dependency map
- `app/layout.tsx` → `Providers` (ToastProvider > UIProvider) → `AnnouncementBar`, `Navbar`, `{children}`, `Footer`, overlays (`CallToOrderModal`, `MobileMenu`, `SearchModal`, `CallFab`, `Toaster`)
- `ProductCard` (server) → `ProductImage` (SVG), `ProductBadge`, `CallToOrderButton` (client) → `useUI().requestCall`. The call overlay replaces search / mobile menu (one overlay at a time).
- `ShopView` (client, inside `<Suspense fallback={<ShopFallback/>}>`) → `useShopParams` (URL state via `window.history.replaceState`) → `FilterSidebar`, `ProductGrid`, bottom-sheet `Drawer`
- `product/[id]` → `ProductGallery`, `ProductPurchasePanel`, `CoverageCalculator` (`lib/coverage`), `ProductTabs`
- `docs/[docId]/route.ts` → `lib/documents.renderDocumentPdf` → `lib/pdf.buildPdf` (dependency-free PDF writer)
- `SearchModal` → `lib/catalog.searchCatalog / searchProducts`
- `Modal` (unmounts when closed) / `Drawer` (always mounted, `inert` when closed) → `useBodyScrollLock`, `useDialogFocus` (topmost-dialog Escape, focus trap and return)

## Gotchas learned
- The `react-hooks` v7 rules run as **errors** (`set-state-in-effect`, `refs`, `purity`). Keep setState in event handlers or external stores, and never call `Date.now()`/`Math.random()` in render.
- Don't export plain values from a `"use client"` module for server components to use (they become client references). Shared constants go in `mockData.ts`.
- Locale formatting in client components: always pass `"en-US"` to avoid hydration mismatches.
- The browser tool's synthetic Enter doesn't trigger native implicit form submission, so the chat input also handles Enter explicitly.

## Current phase
All 5 phases complete, plus the phone-ordering change (2026-09-13). Remaining before launch: replace the placeholders (contact details, testimonials/reviews, PDFs, photography).

## Log
- 2026-09-12: Phase 1. Scaffolded Next 16.3.5 + Tailwind v4 + TS (git disabled). Installed lucide-react, clsx, tailwind-merge. Wrote the docs ecosystem, tokens, types, mock data (54 SKUs, 100 docs) and lib helpers.
- 2026-09-12: Phase 2. UI primitives, contexts, 5-tier navbar, footer, cart drawer, search palette, sign-in, Eva chat.
- 2026-09-12: Phase 3. Home page, section-for-section with the reference.
- 2026-09-12: Phase 4. Shop/category with URL-synced filters, product detail + calculator, PDF route, resources + articles, color charts, contractors, training, contact, cart, info pages, 404.
- 2026-09-12: Phase 5.
  - Fixed header overflow at 375px and 768px, and drawer focus/Escape (dialog stack).
  - Cart drawer now closes other overlays; success panels scroll into view; SVG label fitting.
  - Link crawl: 274 URLs, 0 broken. Lint and build clean.
- 2026-09-13: Phone ordering. Removed cart (drawer, /cart, CartContext), checkout, SignInModal, mock user and BookingModal. Added `requestCall` in UIContext + `CallToOrderButton` / `CallToOrderModal` (components/call). Rewrote cart/checkout/sign-in copy.
- 2026-09-13: Removed the Eva chat widget (component, `chatOpen` state, `evaConfig`/`evaSurfaces`/`evaKeywordAnswers` mock data, `Eva*` types) — it was scope for a real chatbot we're not building yet. Replaced its floating launcher with `CallFab` (components/call), a plain "Call us" pill that opens the same `requestCall()` flow as every other buy button. Scrollbars were also restyled to the CTA brand-orange thumb on a flat 8px track (`globals.css`).
- 2026-09-13: Real catalog import. Client confirmed epoxydepotcalifornia.com (Shopify) is their own live store, not the competitor reference. Pulled the real catalog via the store's public `/products.json` endpoint: 42 real SKUs, names and prices now live in `products` in `mockData.ts` (replacing the 54 placeholder SKUs). Downloaded one real product photo per SKU into `public/products/` and the real site logo/favicon into `public/logo.png` / `public/favicon.png` (now `src/app/icon.png`); `Logo.tsx`'s monogram was swapped for the real logo image. Added `Product.image?: string` to `src/types/index.ts` — `ProductImage` renders it via `next/image` when present, else falls back to the generated SVG render (unchanged for any future placeholder SKUs). Product descriptions/features are original short copy built from the real facts (name, price, option count), not copied from the store's marketing text — the store itself still has leftover default-theme placeholder copy ("Best Deal Infinity" boilerplate) that was deliberately not touched or copied. Full Shopify variant matrices (e.g. 144 options on the flake system) were not modeled — each product currently maps to one representative price/pack size; extending `Product`/`ProductPurchasePanel` for real option groups is follow-up work. `siteConfig` contact placeholders were left as-is (unchanged decision). `npm run lint && npm run build` clean; spot-checked `/shop` and a product detail page in-browser.
