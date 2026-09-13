# Coding rules — Epoxy Depot California

Rules for anyone (human or AI) writing code in this repo.

## Framework ground rules
- This is **Next.js 16**. Before using an unfamiliar API, check `node_modules/next/dist/docs/`.
- `params` and `searchParams` are **Promises** in pages, layouts and route handlers. Always `await` them, and type props with the generated helpers: `PageProps<'/product/[id]'>`, `LayoutProps<'/'>`, `RouteContext<'/docs/[docId]'>`.
- Dynamic routes backed by mock data export `generateStaticParams()` and `dynamicParams = false`, so unknown slugs 404.
- A client component that calls `useSearchParams()` must render inside a `<Suspense>` boundary.
- Tailwind v4: add design tokens to `@theme` in `src/app/globals.css`. Never create a `tailwind.config.*`.
- Don't add a backend, API calls, auth providers or a database. Everything reads from `src/data/mockData.ts`.

## File organization
```
src/app/            routes only: thin pages that compose components
src/components/<domain>/   layout · home · product · shop · call · search · chat · training · contractors · resources · ui
src/context/        React context providers (UIContext, ToastContext, Providers)
src/hooks/          reusable client hooks
src/lib/            pure helpers (no React): catalog queries, formatting, coverage math, PDF writer
src/data/mockData.ts  the ONLY source of catalog/content data
src/types/index.ts    shared types
```
- Pages stay thin: fetch from `lib/catalog`, pass props down, no big JSX blobs.
- Put a component in `components/ui/` only if it's domain-agnostic (Button, Modal, Drawer, Field…).
- One component per file. The file name matches the default/named export.

## Naming
- Components: `PascalCase.tsx`, named exports (`export function ProductCard`). Route files use default exports, as Next requires.
- Hooks: `useThing.ts`. Helpers: `camelCase` functions in `camelCase.ts` files.
- Types/interfaces: `PascalCase`, no `I` prefix. Union string literals for enums (`type Badge = 'Best Seller' | 'New'`).
- Data constants in mockData: `camelCase` (`products`, `trainingClasses`, `siteConfig`).
- Product and category ids are URL slugs (`100-solids-epoxy-kit`, `stains-sealers`).

## Server vs client
- Default to Server Components. Add `'use client'` only for state, effects, event handlers or context.
- Keep client islands small. For example, `ProductCard` stays a server component and embeds the client `CallToOrderButton`.
- Never read `localStorage` / `window` during render. Touch `window` only in event handlers or effects (e.g. `requestCall`'s `matchMedia` check).
- No cart, checkout or accounts: every buy action goes through `useUI().requestCall(subject)`.
- A `"use client"` file should export only components and hooks. Constants that server components also need live in `mockData.ts` or `lib/`.
- The `react-hooks` v7 lint rules are errors: no synchronous `setState` inside `useEffect`, no reading `ref.current` during render, no `Math.random()` / `Date.now()` in render.

## Styling
- Tailwind utilities with the design tokens (`bg-cream`, `text-ink`, `border-line`, `bg-brand`…). No raw hex values in JSX unless it's data (e.g. swatch colors).
- Compose conditional classes with `cn()` from `src/lib/cn.ts`.
- Shared patterns: `.eyebrow`, `.hazard-stripe`, `.container-page` (see `docs/design.md`).
- Mobile-first: write base styles for 375px, then layer `sm: md: lg: xl:`.

## Accessibility & UX
- Every overlay (drawer, modal, chat) uses the shared `Modal`/`Drawer` primitives, which provide `role="dialog"`, `aria-modal`, a label, Esc to close, scroll lock and focus return.
- Icon-only buttons need an `aria-label`. Form fields need `<label>`s.
- Interactive elements are real `<button>` / `<Link>`, never clickable `<div>`s.

## Content
- Write original copy. Don't paste paragraphs from the reference site.
- Brand strings, phone, email and hours come from `siteConfig`. Never hardcode them in components.
- Prices are numbers in USD; format with `formatPrice()` from `lib/format.ts`.

## Quality gate (run before calling a phase done)
```bash
npm run lint && npm run build
```
Both must pass with zero errors, and every internal link must resolve (see `docs/task.md`, Phase 5).
