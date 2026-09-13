# Design system: Epoxy Depot California

Measured from the reference site (coatingwarehouse.com) at 1440px. The aesthetic is industrial contractor: warm cream pages, warm charcoal bars, safety orange for action, gold for iconography on dark surfaces. Crisp display type over neutral body type.

## Color palette
| Token (Tailwind) | Hex | Use |
|---|---|---|
| `cream` | `#F6F4EE` | Page background, alternating section bands |
| `cream-2` | `#EFEBE1` | Hover on cream, image wells |
| `white` | `#FFFFFF` | Cards, main header, alternating bands |
| `charcoal` | `#1A1A1D` | Announcement/utility bars, category nav, path cards, footer, icon tiles |
| `charcoal-2` | `#262629` | Raised dark surfaces, dark hovers |
| `charcoal-3` | `#323236` | Borders on dark surfaces |
| `ink` | `#18181B` | Primary text, headings |
| `muted` | `#52525B` | Body copy, secondary text |
| `subtle` | `#71717A` | Captions, eyebrow-gray labels, meta |
| `dim` | `#8A8F98` | Muted text on dark surfaces |
| `line` | `#E5E0D5` | Card borders, dividers, inputs |
| `brand` | `#F97316` | Primary CTA, eyebrows, badges, active nav, links |
| `brand-dark` | `#EA580C` | CTA hover |
| `brand-deep` | `#C2410C` | Small orange text on light backgrounds where contrast matters |
| `gold` | `#D9A441` | Icons on dark tiles, "Contractor Pricing" utility link, announcement icons |
| `success` | `#4ADE80` | "Online" dot, success ticks on dark |
| `danger` | `#DC2626` | Form errors |

Tints: `brand/10` and `brand/15` for pills and icon wells on light, `gold/10` with a `gold/20` border for icon wells on dark.

## Typography
| Role | Font | Size / weight / tracking |
|---|---|---|
| Display h1 | Space Grotesk | 60px / 700 / `-0.01em`, leading 1.05 (40px mobile) |
| Section h2 | Space Grotesk | 36px / 600, leading 1.15 (28px mobile) |
| Card title | Space Grotesk | 16–22px / 600 |
| Body | Inter | 16px / 400, leading 1.6, color `muted` |
| Small body | Inter | 13–14px |
| Eyebrow | Inter | 11px / 600 / uppercase / `0.18em`, color `brand` |
| Button | Inter | 11–12px / 700 / uppercase / `0.14em` |
| Nav (primary) | Inter | 12px / 500 / uppercase / `0.14em` |
| Nav (category bar) | Inter | 11px / 700 / uppercase / `0.16em`, white |
| SKU / codes | JetBrains Mono | 11px / uppercase / `0.12em`, color `subtle` |

Font wiring: `next/font/google` exposes `--font-inter`, `--font-space-grotesk` and `--font-jetbrains-mono`. `@theme inline` maps them to `font-sans`, `font-display` and `font-mono`.

## Spacing & layout
- Container: `.container-page` = `mx-auto w-full max-w-[1296px] px-4 sm:px-6 lg:px-8`. That gives about a 1264px content width at desktop, matching the reference.
- Section vertical rhythm: `py-16 md:py-20 lg:py-24`. Hero: `py-12 lg:py-20`.
- Grid gaps: 16px for cards on mobile, 20–24px on desktop.
- Breakpoints (Tailwind defaults): sm 640 · md 768 · lg 1024 · xl 1280. Test at 375 / 768 / 1024 / 1440.

## Shape & elevation
- Cards: `rounded-lg` (8px), `border border-line`, `bg-white`. Hover: `shadow-[0_8px_24px_-12px_rgba(24,24,27,0.25)]` plus a slightly darker border.
- Dark path cards and icon tiles: `rounded-xl` / `rounded-2xl`, `bg-charcoal`, with a soft `shadow-xl` on the icon tiles.
- Buttons: `rounded-md` (6px). Pills and chips: `rounded-full`.
- Hazard stripe: `.hazard-stripe` = `repeating-linear-gradient(-45deg, #F97316 0 12px, #1A1A1D 12px 24px)`, 10px tall. It sits above the dark value-props bar.
- Scrollbars (global, `globals.css` base layer): thin flat style everywhere — 8px, `cream-2` track, `brand`-orange thumb (same as the CTA buttons) with a 4px radius, `brand-dark` on hover. Firefox falls back to `scrollbar-color`. Hide one with `.scrollbar-none`.

## Components (visual spec)
- **Button variants**
  - `primary`: `bg-brand` white text, hover `bg-brand-dark`.
  - `outline`: 2px `ink` border on transparent, hover `bg-ink text-white`.
  - `dark`: `bg-charcoal` white text.
  - `ghost-link`: orange uppercase text with a `→`.
  - Sizes `sm` (h-9), `md` (h-11), `lg` (h-13).
- **ProductCard.** White card with a square image well (`bg-gradient-to-b from-cream-2 to-white`). Badge top-left (orange, white 9px uppercase). Below the image:
  - category eyebrow (`subtle`)
  - Space Grotesk name
  - 2-line description
  - price (Space Grotesk 18px bold) with pack size below
  - "+ ADD" primary sm button, flashing "✓ Added"
- **Badges:** Best Seller (brand), New (ink), Pro (charcoal + gold text), Fast Cure (gold), Low Stock (danger).
- **Category tiles (hero):** photo with a category tint overlay at 70–80% (`mix-blend-multiply`), a "SHOP" kicker, a Space Grotesk name, and an outline icon in the top-right corner.
- **Header**
  - Announcement 30px, utility 32px, main 80px, primary nav 40px, category nav 40px.
  - Everything except the announcement bar is sticky (`top-0`).
  - Mobile: announcement becomes a marquee; the header row has hamburger, logo, search icon and Call button.
- **Drawer:** 420px right panel with a `bg-black/40` overlay, slides in 300ms `ease-out`.
- **Modal:** centered, max-w 480–640px, `rounded-xl`, over the same `bg-black/40` overlay.
- **Call FAB:** orange pill "Call us" (`CallFab`) fixed bottom-right on every page, same styling family as the CTA buttons. Opens `CallToOrderModal` (or dials directly on touch devices). Replaced the old Eva chat launcher.

## Imagery
- **Lifestyle photos:** Unsplash, loaded through `next/image` (`images.unsplash.com` in `remotePatterns`). Always add a category tint so the palette stays consistent.
- **Product imagery:** `ProductImage` renders SVG packaging per `visual.kind`:
  - `pail`: single bucket
  - `ab-kit`: Part A + Part B pails stacked
  - `box`: flake box
  - `bag`
  - `jar`: pigment tub
  - `jug`
  - `tool`, `machine`, `roll`, `chart`

  Each render uses the category label color, the product short name and the SKU.

## Motion
- Transitions 150–300ms. Drawer and chat slide, modal fades and scales from 0.98. Honor `prefers-reduced-motion` (disable the marquee and slide animations).

## Tailwind v4 configuration (lives in `src/app/globals.css`)
```css
@import "tailwindcss";
@theme {
  --color-cream: #F6F4EE;   --color-cream-2: #EFEBE1;
  --color-charcoal: #1A1A1D; --color-charcoal-2: #262629; --color-charcoal-3: #323236;
  --color-ink: #18181B; --color-muted: #52525B; --color-subtle: #71717A; --color-dim: #8A8F98;
  --color-line: #E5E0D5;
  --color-brand: #F97316; --color-brand-dark: #EA580C; --color-brand-deep: #C2410C;
  --color-gold: #D9A441; --color-success: #4ADE80; --color-danger: #DC2626;
}
@theme inline {
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, monospace;
}
```
