import type { Metadata } from "next";
import Link from "next/link";
import { Download, Phone } from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { Chips } from "@/components/product/ProductImage";
import { PageHeader } from "@/components/ui/PageHeader";
import { flakeBlends, metallicColors, siteConfig, solidColors } from "@/data/mockData";

export const metadata: Metadata = {
  title: "Color Charts — Solid, Metallic & Flake",
  description: "Reference palettes for solid color epoxy and polyaspartic, metallic pigments and decorative flake blends.",
};

function SectionTitle({ title, docId }: { title: string; docId: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <h2 className="font-display text-2xl font-semibold text-ink">{title}</h2>
      <a href={`/docs/${docId}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.14em] text-brand uppercase hover:text-brand-dark">
        <Download aria-hidden className="size-3.5" /> PDF chart
      </a>
    </div>
  );
}

export default function ColorChartsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Color Charts"
        breadcrumbs={[{ label: "Resources", href: "/resources" }, { label: "Color Charts" }]}
        body="Reference palettes for solid colors, metallic pigments and flake blends. Screen colors are approximations — request a physical sample board for accurate matching."
      />

      <div className="container-page space-y-16 py-12 md:py-16">
        <section aria-labelledby="solid-colors">
          <SectionTitle title="Solid Colors" docId="chart-solid-colors" />
          <ul id="solid-colors" className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
            {solidColors.map((c) => (
              <li key={c.name} className="overflow-hidden rounded-lg border border-line bg-white">
                <div className="aspect-[4/3]" style={{ backgroundColor: c.hex }} />
                <div className="px-3 py-2.5">
                  <p className="text-[13px] font-semibold text-ink">{c.name}</p>
                  <p className="font-mono text-[10px] tracking-wider text-subtle">{c.hex}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="metallic-colors">
          <SectionTitle title="Metallic Pigments" docId="chart-metallic" />
          <ul id="metallic-colors" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {metallicColors.map((c) => (
              <li key={c.name} className="overflow-hidden rounded-lg border border-line bg-white">
                <div
                  className="aspect-square"
                  style={{ backgroundImage: `linear-gradient(135deg, ${c.gradient[0]} 0%, ${c.gradient[1]} 45%, ${c.gradient[2]} 70%, ${c.gradient[0]} 100%)` }}
                />
                <div className="px-3 py-2.5">
                  <p className="text-[13px] font-semibold text-ink">{c.name}</p>
                  <p className="font-mono text-[10px] tracking-wider text-subtle">{c.hex}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted">
            Metallic pigment packs are sized for one 3 gal kit.{" "}
            <Link href="/product/metallic-pigment-pack" className="font-semibold text-brand-deep hover:underline">
              Shop metallic pigments →
            </Link>
          </p>
        </section>

        <section aria-labelledby="flake-blends">
          <SectionTitle title="Flake Blends" docId="chart-flake-blends" />
          <ul id="flake-blends" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {flakeBlends.map((b) => (
              <li key={b.id} className="flex overflow-hidden rounded-lg border border-line bg-white">
                <svg viewBox="0 0 100 100" className="size-32 shrink-0 sm:size-36" role="img" aria-label={`${b.name} flake blend swatch`}>
                  <rect width={100} height={100} fill={b.chips[0]} />
                  <Chips x={0} y={0} w={100} h={100} colors={b.chips} count={150} seed={`chart-${b.id}`} size={7} />
                </svg>
                <div className="flex min-w-0 flex-1 flex-col p-4">
                  <p className="font-display text-lg font-semibold text-ink">{b.name}</p>
                  <p className="mt-1 text-[13px] leading-snug text-muted">{b.description}</p>
                  <div className="mt-auto flex items-center gap-1.5 pt-3">
                    {b.chips.map((chip) => (
                      <span key={chip} className="size-3.5 rounded-sm border border-black/10" style={{ backgroundColor: chip }} title={chip} />
                    ))}
                  </div>
                  <div className="mt-3">
                    {b.productId ? (
                      <AddToCartButton productId={b.productId} size="xs" label="Add 40 lb box" />
                    ) : (
                      <a href={siteConfig.phoneHref} className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.12em] text-brand uppercase">
                        <Phone aria-hidden className="size-3.5" /> Custom blend — call
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-6 rounded-xl bg-charcoal p-6 text-white md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <p className="eyebrow text-gold">Sales aids</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-white md:text-3xl">Order physical sample boards</h2>
            <p className="mt-2 max-w-lg text-sm text-white/65">
              Get the full flake sample set and printed metallic chart for client meetings — the fastest way to close a job at the kitchen table.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <AddToCartButton productId="flake-sample-board-set" label="Flake sample set · $99" size="md" />
            <AddToCartButton productId="metallic-color-chart" label="Metallic chart · $19" size="md" variant="outline-light" />
          </div>
        </section>
      </div>
    </>
  );
}
