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
- 2026-10-14: Client markup of the Tools page (printed). Prices: Wooster Big Ben frame $21.99, 20" polyester pad $18.65, 18" floor scraper $43.99. Polyester pad → `surface-prep`; garage door jacks, chip brushes, mixing containers and the 4" mini roller 12-pack → `sundries` (the mini roller had no mark; moved per his "move everything here to Sundries" note — confirm). Added two Tools SKUs not on the live store yet: `microfiber-roller-frame` (18"/24"/36") and `fuzion-spray-gun`, both with the new `Product.callForPrice` flag (shown as "Call for price" via `formatProductPrice()`, excluded from price filters, sorted last by price). They use the SVG render until the client sends photos and prices. Added `PrintImageLoader` (layout) so lazy images load on `beforeprint`; his printout had blank cards.
- 2026-10-15: Client's real color charts on `/color-charts` (and the chart PDFs). Metallics: 56 colors including 4 marked `isNew`. Flakes: 18 blends, with 1/8" also offered for Coyote, Garnet, Shoreline and Outback (new `FlakeBlend.sizes`). All 18 call into the Full Flake system. Solids: 7 colors. Hex values for colors sold on the live store were sampled from the store's own per-color photos (44 pigment jars, 11 flake blends). The rest are name-based estimates, listed in comments in `mockData.ts`; replace them once the client sends swatches. "Cooper Brown" on the client's list was entered as "Copper Brown", matching the store and the jar label. The "Shop metallic pigments" link now points to the real `8-oz-e4e-metallic-pigment-powder`.
- 2026-10-15: Fuzion line. Fuzion Spray Gun is now $104.99 (no longer call-for-price). New SKUs: `fuzion-hand-spray` ($33, 20 colors) and `fuzion-spray-gun-colors` ($35, 21 colors), both in `pigments` with SVG renders. New `Product.colors` (`ProductColor[]`): `ProductPurchasePanel` shows swatches, and the chosen color is passed as `CallToOrderButton`'s `option`, so the call request names it. Hexes were sampled from RCM's Fuzion photos on a distributor's listing. Classic White and Classic Black are estimates. "Fusc Green" and "Apple Green" are treated as RCM's Apple Green Pearl; confirm with the client.
- 2026-10-15: Client sent all 22 flake swatch photos, in chart order. The originals are in `flakechart/` (image.png, then image (1)…(21).png; ~14 MB, gitignored). They are resized to 400px WebP in `public/flakes/<id>.webp` (committed) and shown via `FlakeBlend.image`, with chips sampled from them. The 1/8" versions of Coyote, Garnet, Shoreline and Outback are now their own cards (`<id>-1-8`, with their own photos). `FlakeBlend.sizes` was replaced by a single `size`. Garnet is cocoa brown, not red.
- 2026-10-15: 20" Non-Woven Polyester pad repriced to $8.65 (was $18.65 from the 10-14 markup).
- 2026-10-15: Client category cleanup. Moves: Premera T2, White Out and RCM Fuzion Relax → stains-sealers; E4E Acetone, E4E-UR-A-FILL, E4E Gel Patch and Epoxy Resinous Cleaner → surface-prep; Polyrez 6000/6100 → urethane; Smith S103EX → tools. Microfiber Roller Frame renamed "Microfiber Frame" (id `microfiber-frame`). The Full Flake Epoxy Flooring System product was removed. The Flake category is now one product per flake blend (`flake-<blendId>`, built by `flakeProduct()` from `flakeBlends`, which now sits above `products`), using the client's swatch photos. Prices are `callForPrice` until the client gives flake box prices.
- 2026-10-16: Luis's replies and "Metallic Color Pictures.docx".
  - **Metallics:** 44 jar photos added (`public/metallics/<slug>.webp`, via `MetallicColor.image`). They also fixed Bronze (peachy rose), Light Grey and Satin White Grey (both dark charcoal powders), and Deep Brown. The jar label says "Cooper Brown"; the site still says "Copper Brown".
  - **Flakes:** stay call-for-price, sold as a 40 lb box.
  - **Fuzion:** Fusc Green (hand spray) and Apple Green (gun) are different colors. Fusc Green's hex is an estimate until he sends a photo. The spray gun has a photo now. The doc also shows an RCM "Gun Cleaner" that isn't a product yet.
  - **Microfiber:** Frame is $12.99/$15.99/$21.99 for 18"/24"/36". New `microfiber-pad` SKU is $5.25/$7.25/$8.25. New `Product.priceOptions` adds a size picker, shows the price as "From $x", and names the size in the call request.
  - **Solids:** the doc's solid-color photos are labeled white tubs, so the chart keeps its hex swatches.
- 2026-10-16: Rest of the "Metallic Color Pictures" doc (a copy also sits in `flakechart/`). The doc's 18 RCM Fuzion photos (no Iron Gray) are in `public/fuzion/`. `ProductColor.image` carries them, and the product page shows the picked color's photo. A new "Fuzion Mica Sprays" section on `/color-charts` (`fuzionColors`) merges both color lists and tags each color Hand spray / Gun. The 6 solid base-color tub photos are in `public/solids/` (`SolidColor.image`); White has none. New call-for-price `fuzion-gun-cleaner` SKU (tools) uses the doc's Gun Cleaner photo.
