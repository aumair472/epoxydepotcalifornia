# Task checklist

Legend: `[ ]` todo · `[x]` done

## Phase 1: Foundation
- [x] Scaffold Next.js 16 + Tailwind v4 + TS + ESLint (`src/`, `@/*` alias)
- [x] Install lucide-react, clsx, tailwind-merge
- [x] memory.md, docs/claude.md, docs/design.md, docs/phases.md, docs/task.md
- [x] Root CLAUDE.md imports memory + docs
- [x] globals.css tokens + fonts in layout
- [x] next.config.ts (Unsplash remotePatterns with a pinned query string, legacy-URL redirects)
- [x] src/types/index.ts
- [x] src/data/mockData.ts (siteConfig, nav, categories, 54 products, content collections, 100 docs)
- [x] src/lib: cn, format, catalog, coverage, pdf, documents, localStore, validation

## Phase 2: Global layout
- [x] ui: Button, Icon, SectionHeading/Eyebrow, Modal, Drawer, Field, Breadcrumbs, PageHeader, StarRating, Toaster
- [x] hooks: useBodyScrollLock, useHotkey, useDialogFocus (dialog stack + focus trap), useHydrated
- [x] CartContext (add/remove/update/clear, open/close, localStorage via useSyncExternalStore, lastAddedId)
- [x] UIContext (search, sign-in, mobile menu, chat, mock user) + ToastContext + Providers
- [x] Logo, SocialIcons
- [x] AnnouncementBar (marquee below xl)
- [x] Navbar: utility row, main header (search trigger, sign in, cart badge), primary nav, category nav
- [x] MobileMenu
- [x] Footer
- [x] CartDrawer (+ CartLineItem, QuantityStepper, FreeShippingMeter, empty state)
- [x] SearchModal (grouped results, keyboard nav, ⌘K and /)
- [x] SignInModal (mock user: name + email only)
- [x] EvaChatWidget (personas, decision tree, keyword answers, product suggestions, teaser)

## Phase 3: Home
- [x] Hero + CategoryTiles
- [x] ValueProps (hazard stripe)
- [x] PathSelector (DIY / We Install / Learn)
- [x] Bestsellers grid with instant Add
- [x] CategoryFeature bands ×7 (alternating, incl. contractor band)
- [x] Testimonials (grid → snap-scroll on mobile)
- [x] ResourceHighlights
- [x] Newsletter (mock subscribe)

## Phase 4: Sub-pages
- [x] /shop: ShopView, FilterSidebar (category, price, pack size), sort, mobile filter sheet, URL sync, ?q ?tag
- [x] /shop/[category]
- [x] /product/[id]: gallery, purchase panel, tabs, CoverageCalculator, docs, reviews, related
- [x] /docs/[docId] PDF route (100 static PDFs)
- [x] /resources: hub + DocumentLibrary (search + type + category filters) + articles + classes
- [x] /resources/[slug] article pages
- [x] /color-charts
- [x] /contractors: ContractorForm + success state
- [x] /training: class list + BookingModal (book / waitlist / private)
- [x] /contact (?topic=install, ?topic=quote&sku=)
- [x] /cart: summary, promo, fulfillment, demo order confirmation
- [x] /info/[slug]
- [x] not-found

## Phase 5: Polish & verification
- [x] Responsive at 375 / 768 / 1024 / 1440 (fixed header overflow at 375 and 768)
- [x] A11y: dialog semantics, Escape closes topmost dialog, focus in/return, labels, keyboard tabs
- [x] Internal link crawl: 274 URLs, zero 404s; legacy redirects verified
- [x] Console: no app errors (only a Grammarly extension attribute warning, suppressed on `<body>`)
- [x] Cart flows from every Add entry point (home, shop, product, calculator, search, Eva, color charts, empty drawer)
- [x] `npm run lint && npm run build` clean (190 static pages)
- [x] memory.md final update
