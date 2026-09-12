# Execution phases

Phases run in order. Each ends with `npm run lint && npm run build` passing and an update to `memory.md`.

## Phase 1: Setup & design system foundation
- Scaffold Next.js 16 (App Router, TS, Tailwind v4, ESLint, `src/`). Install `lucide-react`, `clsx`, `tailwind-merge`.
- Write the docs ecosystem: `memory.md`, `docs/claude.md`, `docs/design.md`, `docs/task.md`, `docs/phases.md`. Point root `CLAUDE.md` at them.
- Add design tokens and utility classes to `globals.css`, plus fonts.
- `next.config.ts`: Unsplash `remotePatterns`, legacy-URL redirects.
- `src/types/index.ts` and the full `src/data/mockData.ts`: siteConfig, nav, 10 categories, ~50 products with specs/application/docs/reviews, testimonials, resource docs, color charts, blog, training, info pages, Eva script.
- `src/lib`: `cn`, `format`, `catalog` (queries/search/filter/sort/facets), `coverage`, `pdf`.

**Exit:** types compile; data helpers return what the pages will need.

## Phase 2: Global layout & navigation
- ui primitives: Button, Badge, Eyebrow, SectionHeading, Container, Modal, Drawer, Field/Input/Select/Textarea, Breadcrumbs, HazardStripe, Toaster.
- Contexts: `CartContext` (reducer + localStorage + drawer state) and `UIContext` (search / sign-in / menu / chat, mock user, toasts).
- Layout components: Logo, AnnouncementBar, Navbar (utility, main header, primary nav, category nav), MobileMenu, Footer, SocialIcons.
- Overlays: CartDrawer (+ line items, stepper, free-shipping meter), SearchModal, SignInModal, EvaChatWidget.
- Wire everything in `app/layout.tsx`.

**Exit:** every page shows the header/footer; the cart drawer, search, sign-in and Eva all open and close.

## Phase 3: Home page & instant add
- Hero + category tiles, value props (hazard stripe), 3-path selector, bestsellers (AddToCartButton → drawer), six alternating category bands, contractor band, testimonials, resource highlights, newsletter.
- Pick the Unsplash images and verify each one loads.

**Exit:** home matches the reference section-for-section; "Add" opens the drawer with the item.

## Phase 4: Sub-pages & dynamic routing
- `/shop` and `/shop/[category]`: ShopView with category, price and pack-size filters, sort, URL sync, mobile filter sheet.
- `/product/[id]`: gallery, purchase panel, tabs (overview/specs/application/docs/reviews), coverage calculator, related products.
- `/docs/[docId]`: static PDF route.
- `/resources` (hub + searchable library + blog + classes), `/color-charts`, `/contractors`, `/training` (+ booking modal), `/contact`, `/cart`, `/info/[slug]`, `not-found`.

**Exit:** every nav/footer/CTA link resolves; all forms reach their success state.

## Phase 5: Polish, responsive testing & optimization
- Responsive pass at 375 / 768 / 1024 / 1440. Compare side-by-side with the reference.
- A11y pass: dialog semantics, focus return, labels, keyboard use of search and chat.
- Scripted internal-link crawl (no 404s). Console clean (no hydration warnings).
- Final `npm run lint && npm run build`. Update `memory.md`.
