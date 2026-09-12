# Epoxy Depot California — storefront (front-end)

A front-end-only storefront for **Epoxy Depot California**. It mirrors the layout, design and UX of coatingwarehouse.com. It's built with Next.js 16 (App Router), Tailwind CSS v4 and TypeScript.

- **No backend.** All catalog and content data lives in [`src/data/mockData.ts`](src/data/mockData.ts).
- **Instant add.** Every "Add" button updates a local cart (React context + `localStorage`) and slides the cart drawer open.
- **Mock flows.** Sign-in, contractor application, class booking, contact/estimate and checkout all validate input and show a success state. Nothing is sent anywhere.

## Scripts

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build && npm start
```

## Routes

| Route | What it is |
|---|---|
| `/` | Home: hero + category tiles, value props, 3 paths, bestsellers, category bands, testimonials, resources, newsletter |
| `/shop`, `/shop/[category]` | Catalog with category / price / pack-size filters, sort, `?q=` search, `?tag=` collections (URL-synced) |
| `/product/[id]` | Gallery, purchase panel, coverage calculator, specs / application / documents / reviews tabs, related products |
| `/resources`, `/resources/[slug]` | Resource hub, searchable document library, how-to articles |
| `/docs/[docId]` | Generated placeholder PDFs (TDS, SDS, color charts, mix guides) |
| `/color-charts` | Solid, metallic and flake-blend palettes |
| `/contractors` | 15% contractor program + application form |
| `/training` | Class schedule, booking / waitlist / private-training modal |
| `/contact` | Contact + install estimate form (`?topic=install`, `?topic=quote&sku=`) |
| `/cart` | Cart, promo code (`CONTRACTOR15`), ship vs will-call, demo order confirmation |
| `/info/[slug]` | About, locations, careers, wholesale, order status, returns, shipping, terms, privacy |

Global UI: 5-tier sticky header, mobile menu, search palette (⌘K or `/`), cart drawer, sign-in modal, and the **Eva** chat assistant.

## Project docs

- [`memory.md`](memory.md): project context, decisions, component map
- [`docs/claude.md`](docs/claude.md): coding rules and conventions
- [`docs/design.md`](docs/design.md): design tokens and visual spec
- [`docs/task.md`](docs/task.md) / [`docs/phases.md`](docs/phases.md): build checklist and phases

## Before launch

Replace the placeholders:
- `siteConfig` (phone, email, addresses, socials) in `mockData.ts`
- Testimonials and reviews
- Generated PDF documents: use the manufacturer's real TDS/SDS
- Unsplash photography: swap in the client's own photos
