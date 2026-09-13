import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/data/mockData";
import { cn } from "@/lib/cn";
import type { CategorySlug, Product } from "@/types";

/**
 * Generated SVG packaging renders — consistent, crisp product imagery with no external assets.
 * Every render is deterministic (seeded from the product id) so server and client output match.
 */

const labelColors: Record<CategorySlug, string> = {
  epoxy: "#F97316",
  polyaspartic: "#3C4A57",
  urethane: "#B45309",
  flake: "#7C5C45",
  pigments: "#B91C1C",
  "stains-sealers": "#57534E",
  "surface-prep": "#52525B",
  tools: "#1E293B",
  sundries: "#71717A",
  "sales-aids": "#A16207",
};

const INK = "#18181B";
const CHARCOAL = "#1A1A1D";
const PAIL = "#FAFAF9";
const EDGE = "#E7E5E4";
const DISPLAY = { fontFamily: "var(--font-space-grotesk), ui-sans-serif, sans-serif" };
const MONO = { fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace" };
const BRAND = siteConfig.shortName.toUpperCase();

type ImageProduct = Pick<Product, "id" | "labelName" | "sku" | "category" | "visual" | "packSize" | "image">;

function hash(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function seededRandom(seedKey: string) {
  let seed = hash(seedKey);
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Split a label into at most two lines of roughly `max` characters, never breaking inside a word. */
function splitLabel(text: string, max = 13): [string, string?] {
  if (text.length <= max) return [text];
  const words = text.split(" ");
  let first = words[0];
  let i = 1;
  while (i < words.length && `${first} ${words[i]}`.length <= max) {
    first = `${first} ${words[i]}`;
    i++;
  }
  return [first, words.slice(i).join(" ") || undefined];
}

/** Shrink the font so the longest word still fits the label width. */
function fitFontSize(text: string, size: number, width: number) {
  const longest = Math.max(...text.split(" ").map((w) => w.length));
  return Math.min(size, r1(width / (longest * 0.64)));
}

/** Deterministic scatter of flake chips inside a rectangle (also used for color-chart swatches). */
export function Chips({ x, y, w, h, colors, count, seed, size = 6 }: { x: number; y: number; w: number; h: number; colors: string[]; count: number; seed: string; size?: number }) {
  const rand = seededRandom(seed);
  const chips = Array.from({ length: count }, () => {
    const cw = size * (0.6 + rand() * 0.7);
    const ch = size * (0.45 + rand() * 0.45);
    const cx = x + size / 2 + rand() * (w - size * 1.5);
    const cy = y + size / 2 + rand() * (h - size * 1.5);
    return { cw, ch, cx, cy, rot: Math.round(rand() * 180), color: colors[Math.floor(rand() * colors.length)] };
  });
  return (
    <g>
      {chips.map((c, i) => (
        <rect
          key={i}
          x={r1(c.cx - c.cw / 2)}
          y={r1(c.cy - c.ch / 2)}
          width={r1(c.cw)}
          height={r1(c.ch)}
          rx={1}
          fill={c.color}
          stroke="rgba(0,0,0,0.12)"
          strokeWidth={0.3}
          transform={`rotate(${c.rot} ${r1(c.cx)} ${r1(c.cy)})`}
        />
      ))}
    </g>
  );
}

function LabelText({ product, x, y, width, dark = false, size: baseSize = 9 }: { product: ImageProduct; x: number; y: number; width: number; dark?: boolean; size?: number }) {
  const label = product.labelName.toUpperCase();
  const size = fitFontSize(label, baseSize, width);
  const [l1, l2] = splitLabel(label, Math.floor(width / (size * 0.62)));
  return (
    <g style={DISPLAY} textAnchor="middle" fill={dark ? "#FFFFFF" : INK} fontWeight={700}>
      <text x={x} y={y} fontSize={size} letterSpacing={0.2}>
        {l1}
      </text>
      {l2 && (
        <text x={x} y={y + size + 1.5} fontSize={size} letterSpacing={0.2}>
          {l2}
        </text>
      )}
    </g>
  );
}

function BrandBand({ x, y, w, h, color }: { x: number; y: number; w: number; h: number; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={color} />
      <text x={x + w / 2} y={y + h / 2 + 2.2} fontSize={Math.min(6.5, h * 0.55)} fontWeight={700} textAnchor="middle" fill="#FFFFFF" letterSpacing={1.4} style={DISPLAY}>
        {BRAND}
      </text>
    </g>
  );
}

function Sku({ product, x, y, fill = "#71717A" }: { product: ImageProduct; x: number; y: number; fill?: string }) {
  return (
    <text x={x} y={y} fontSize={5.2} textAnchor="middle" fill={fill} letterSpacing={0.6} style={MONO}>
      {product.sku}
    </text>
  );
}

/* ---------------- Packaging shapes ---------------- */

function Pail({ product, color }: { product: ImageProduct; color: string }) {
  const lid = product.visual.tone ? color : CHARCOAL;
  return (
    <g>
      <path d="M58 66 C 58 22, 142 22, 142 66" fill="none" stroke="#A1A1AA" strokeWidth={3} />
      <path d="M52 72 L148 72 L141 172 Q140 177 135 177 L65 177 Q60 177 59 172 Z" fill={PAIL} stroke={EDGE} />
      <path d="M128 72 L148 72 L141 172 Q140 177 135 177 L122 177 Z" fill="#000" opacity={0.05} />
      <rect x={62} y={78} width={5} height={92} fill="#fff" opacity={0.8} />
      <rect x={49} y={56} width={102} height={12} rx={3} fill={lid} />
      <rect x={46} y={65} width={108} height={8} rx={3} fill={lid} />
      <rect x={46} y={69} width={108} height={4} rx={2} fill="#000" opacity={0.18} />
      <rect x={63} y={96} width={74} height={62} rx={2} fill="#fff" stroke={EDGE} />
      <BrandBand x={63} y={96} w={74} h={12} color={color} />
      <LabelText product={product} x={100} y={123} width={70} />
      {product.visual.tone && <rect x={63} y={150} width={74} height={8} fill={product.visual.tone} stroke={EDGE} strokeWidth={0.5} />}
      <Sku product={product} x={100} y={product.visual.tone ? 146 : 152} />
    </g>
  );
}

function AbKit({ product, color }: { product: ImageProduct; color: string }) {
  const tone = product.visual.tone;
  return (
    <g>
      {/* Part A */}
      <path d="M50 104 L150 104 L144 174 Q143 178 138 178 L62 178 Q57 178 56 174 Z" fill={PAIL} stroke={EDGE} />
      <path d="M132 104 L150 104 L144 174 Q143 178 138 178 L126 178 Z" fill="#000" opacity={0.05} />
      <rect x={59} y={108} width={5} height={64} fill="#fff" opacity={0.8} />
      <rect x={46} y={92} width={108} height={9} rx={3} fill={CHARCOAL} />
      <rect x={44} y={99} width={112} height={7} rx={3} fill={CHARCOAL} />
      <rect x={63} y={114} width={74} height={56} rx={2} fill="#fff" stroke={EDGE} />
      <BrandBand x={63} y={114} w={74} h={11} color={color} />
      <LabelText product={product} x={100} y={138} width={62} size={8.5} />
      {tone && <rect x={63} y={162} width={74} height={8} fill={tone} stroke={EDGE} strokeWidth={0.5} />}
      <Sku product={product} x={100} y={tone ? 159 : 163} />
      <circle cx={130} cy={153} r={6} fill={CHARCOAL} />
      <text x={130} y={156} fontSize={8} fontWeight={700} textAnchor="middle" fill="#fff" style={DISPLAY}>
        A
      </text>
      {/* Part B */}
      <path d="M64 40 L136 40 L131 88 Q130 91 126 91 L74 91 Q70 91 69 88 Z" fill={PAIL} stroke={EDGE} />
      <path d="M122 40 L136 40 L131 88 Q130 91 126 91 L117 91 Z" fill="#000" opacity={0.05} />
      <rect x={60} y={31} width={80} height={8} rx={2.5} fill={color} />
      <rect x={58} y={37} width={84} height={5} rx={2} fill={color} />
      <rect x={58} y={40} width={84} height={2} fill="#000" opacity={0.2} />
      <rect x={74} y={50} width={52} height={32} rx={2} fill="#fff" stroke={EDGE} />
      <rect x={74} y={50} width={52} height={7} fill={CHARCOAL} />
      <text x={100} y={71} fontSize={9} fontWeight={700} textAnchor="middle" fill={INK} style={DISPLAY}>
        PART B
      </text>
      <text x={100} y={78} fontSize={4.8} textAnchor="middle" fill="#71717A" letterSpacing={0.8} style={MONO}>
        HARDENER
      </text>
    </g>
  );
}

function SystemKit({ product }: { product: ImageProduct }) {
  const [l1, l2] = splitLabel(product.labelName.toUpperCase(), 11);
  return (
    <g>
      <polygon points="36,72 100,48 164,72 100,96" fill="#3F3F46" />
      <ellipse cx={100} cy={72} rx={14} ry={5} fill="#27272A" />
      <polygon points="36,72 100,96 100,180 36,156" fill={CHARCOAL} />
      <polygon points="100,96 164,72 164,156 100,180" fill="#2A2A2E" />
      <polygon points="36,128 100,152 100,160 36,136" fill="#F97316" />
      <polygon points="100,152 164,128 164,136 100,160" fill="#EA580C" />
      <g transform="matrix(1 0.375 0 1 0 0)" style={DISPLAY}>
        <text x={44} y={78} fontSize={5.5} fontWeight={700} fill="#D9A441" letterSpacing={1}>
          SYSTEM KIT
        </text>
        <text x={44} y={91} fontSize={8.5} fontWeight={700} fill="#fff">
          {l1}
        </text>
        {l2 && (
          <text x={44} y={101} fontSize={8.5} fontWeight={700} fill="#fff">
            {l2}
          </text>
        )}
      </g>
      <g transform="matrix(1 -0.375 0 1 0 0)" style={DISPLAY}>
        <text x={108} y={146} fontSize={6.5} fontWeight={700} fill="#fff" letterSpacing={1.2}>
          {BRAND}
        </text>
        <text x={108} y={154} fontSize={4.6} fill="#A1A1AA" letterSpacing={1} style={MONO}>
          {product.sku}
        </text>
      </g>
    </g>
  );
}

function Jug({ product, color }: { product: ImageProduct; color: string }) {
  const tone = product.visual.tone ?? "#D6D3D1";
  return (
    <g>
      <path
        d="M68 177 Q62 177 62 171 L62 86 Q62 70 78 66 L96 60 L96 46 L118 46 L118 60 L126 62 Q138 66 138 82 L138 171 Q138 177 132 177 Z"
        fill={PAIL}
        stroke={EDGE}
      />
      <path d="M62 124 L138 124 L138 171 Q138 177 132 177 L68 177 Q62 177 62 171 Z" fill={tone} opacity={0.4} />
      <ellipse cx={125} cy={84} rx={7} ry={10} fill="#EFEBE1" stroke={EDGE} />
      <rect x={93} y={36} width={28} height={12} rx={2} fill={color} />
      <rect x={93} y={44} width={28} height={3} fill="#000" opacity={0.2} />
      <rect x={67} y={70} width={4} height={100} fill="#fff" opacity={0.8} />
      <rect x={72} y={100} width={56} height={52} rx={2} fill="#fff" stroke={EDGE} />
      <BrandBand x={72} y={100} w={56} h={10} color={color} />
      <LabelText product={product} x={100} y={124} width={52} size={7.5} />
      <Sku product={product} x={100} y={146} />
    </g>
  );
}

function Jar({ product, color }: { product: ImageProduct; color: string }) {
  const tone = product.visual.tone ?? color;
  return (
    <g>
      <rect x={56} y={98} width={88} height={78} rx={8} fill={PAIL} stroke={EDGE} />
      <rect x={128} y={98} width={16} height={78} rx={6} fill="#000" opacity={0.05} />
      <rect x={52} y={80} width={96} height={22} rx={5} fill={tone} />
      <rect x={52} y={80} width={96} height={5} rx={2.5} fill="#fff" opacity={0.25} />
      <rect x={52} y={97} width={96} height={5} rx={2} fill="#000" opacity={0.2} />
      <rect x={56} y={114} width={88} height={46} fill="#fff" stroke={EDGE} />
      <BrandBand x={56} y={114} w={88} h={10} color={color} />
      <LabelText product={product} x={94} y={138} width={62} size={8} />
      <circle cx={132} cy={145} r={6} fill={tone} stroke={EDGE} />
      <Sku product={product} x={94} y={154} />
    </g>
  );
}

function FlakeBox({ product }: { product: ImageProduct }) {
  const chips = product.visual.chips ?? ["#A8A29E", "#44403C", "#F5F5F4"];
  return (
    <g>
      <polygon points="44,64 60,50 172,50 156,64" fill="#3F3F46" />
      <polygon points="156,64 172,50 172,164 156,178" fill={CHARCOAL} />
      <rect x={44} y={64} width={112} height={114} fill="#262629" />
      <rect x={56} y={76} width={88} height={52} rx={3} fill="#F5F5F4" />
      <Chips x={57} y={77} w={86} h={50} colors={chips} count={70} seed={product.id} size={7} />
      <rect x={56} y={76} width={88} height={52} rx={3} fill="none" stroke="#52525B" strokeWidth={1.5} />
      <text x={100} y={141} fontSize={6} fontWeight={700} textAnchor="middle" fill="#D9A441" letterSpacing={1.4} style={DISPLAY}>
        {BRAND} FLAKE
      </text>
      <LabelText product={product} x={100} y={153} width={100} size={9} dark />
      <text x={100} y={166} fontSize={5} textAnchor="middle" fill="#A1A1AA" letterSpacing={0.8} style={MONO}>
        {product.packSize.toUpperCase()} · 1/4&quot; CHIP
      </text>
      <rect x={44} y={172} width={112} height={6} fill="#F97316" />
    </g>
  );
}

function Bag({ product, color }: { product: ImageProduct; color: string }) {
  const tone = product.visual.tone ?? "#E5E7EB";
  const rand = seededRandom(product.id);
  return (
    <g>
      <path d="M62 54 L138 54 L142 70 L142 170 Q142 177 135 177 L65 177 Q58 177 58 170 L58 70 Z" fill="#fff" stroke={EDGE} />
      <line x1={60} y1={66} x2={140} y2={66} stroke={EDGE} strokeWidth={2} />
      <rect x={58} y={72} width={84} height={14} fill={color} />
      <text x={100} y={82} fontSize={6.5} fontWeight={700} textAnchor="middle" fill="#fff" letterSpacing={1.4} style={DISPLAY}>
        {BRAND}
      </text>
      <LabelText product={product} x={100} y={100} width={76} size={8} />
      <rect x={74} y={116} width={52} height={42} rx={8} fill={tone} stroke={EDGE} />
      {Array.from({ length: 26 }, (_, i) => (
        <circle key={i} cx={r1(78 + rand() * 44)} cy={r1(120 + rand() * 34)} r={r1(0.8 + rand() * 0.9)} fill="#fff" opacity={0.9} />
      ))}
      <Sku product={product} x={100} y={169} />
    </g>
  );
}

function HangTag({ product, color }: { product: ImageProduct; color: string }) {
  return (
    <g>
      <rect x={52} y={28} width={96} height={150} rx={8} fill="#fff" stroke={EDGE} />
      <rect x={87} y={36} width={26} height={7} rx={3.5} fill="#EFEBE1" stroke={EDGE} />
      <BrandBand x={52} y={50} w={96} h={15} color={color} />
      <rect x={64} y={74} width={72} height={64} rx={12} fill="#F5F5F4" stroke={EDGE} />
      <rect x={68} y={78} width={64} height={10} rx={5} fill="#fff" opacity={0.7} />
      <Icon name={product.visual.icon ?? "wrench"} x={76} y={82} width={48} height={48} color={color} strokeWidth={1.6} />
      <LabelText product={product} x={100} y={153} width={86} size={8} />
      <Sku product={product} x={100} y={171} />
    </g>
  );
}

function Crate({ product }: { product: ImageProduct }) {
  return (
    <g>
      <polygon points="38,72 56,56 180,56 162,72" fill="#D9BE95" />
      <polygon points="162,72 180,56 180,160 162,176" fill="#AD8A5B" />
      <rect x={38} y={72} width={124} height={104} fill="#C8A97E" />
      <polygon points="92,72 108,72 124,56 108,56" fill="#E8D4B0" opacity={0.9} />
      <rect x={92} y={72} width={16} height={40} fill="#E8D4B0" opacity={0.9} />
      <circle cx={68} cy={100} r={17} fill="#fff" />
      <Icon name={product.visual.icon ?? "gauge"} x={56} y={88} width={24} height={24} color={CHARCOAL} strokeWidth={1.8} />
      <g stroke={CHARCOAL} strokeWidth={1.8} fill="none" strokeLinecap="round">
        <path d="M132 96 V84 M127 89 L132 84 L137 89" />
        <path d="M146 96 V84 M141 89 L146 84 L151 89" />
      </g>
      <rect x={50} y={128} width={100} height={38} rx={2} fill="#fff" />
      <rect x={50} y={128} width={100} height={8} fill={CHARCOAL} />
      <text x={100} y={134} fontSize={5} fontWeight={700} textAnchor="middle" fill="#D9A441" letterSpacing={1.2} style={DISPLAY}>
        EQUIPMENT · {BRAND}
      </text>
      <LabelText product={product} x={100} y={149} width={92} size={8} />
      <Sku product={product} x={100} y={162} />
    </g>
  );
}

function Boards({ product }: { product: ImageProduct }) {
  const chips = product.visual.chips ?? ["#A8A29E", "#44403C", "#F5F5F4"];
  const boards = [
    { rot: -14, colors: [chips[0], chips[2] ?? "#fff", chips[4] ?? "#555"] },
    { rot: 0, colors: [chips[1], chips[3] ?? "#999", chips[5] ?? "#eee"] },
    { rot: 14, colors: [chips[2] ?? "#ccc", chips[0], chips[1]] },
  ];
  return (
    <g>
      {boards.map((b, i) => (
        <g key={i} transform={`rotate(${b.rot} 100 150)`}>
          <rect x={62} y={56} width={76} height={76} rx={6} fill={b.colors[0]} stroke="rgba(0,0,0,0.15)" />
          <Chips x={64} y={58} w={72} h={72} colors={b.colors} count={60} seed={`${product.id}-${i}`} size={6} />
        </g>
      ))}
      <rect x={70} y={140} width={60} height={26} rx={3} fill={CHARCOAL} />
      <text x={100} y={151} fontSize={5.5} fontWeight={700} textAnchor="middle" fill="#D9A441" letterSpacing={1.2} style={DISPLAY}>
        {BRAND}
      </text>
      <text x={100} y={160} fontSize={6.5} fontWeight={700} textAnchor="middle" fill="#fff" style={DISPLAY}>
        SAMPLE SET
      </text>
    </g>
  );
}

function Chart({ product, color }: { product: ImageProduct; color: string }) {
  const chips = product.visual.chips ?? ["#F97316", "#1A1A1D", "#D9A441"];
  return (
    <g>
      <polygon points="40,62 84,52 84,170 40,180" fill="#F5F5F4" stroke={EDGE} />
      <polygon points="116,52 160,62 160,180 116,170" fill="#F5F5F4" stroke={EDGE} />
      <rect x={84} y={52} width={32} height={118} fill="#fff" stroke={EDGE} />
      <polygon points="40,62 84,52 84,64 40,74" fill={CHARCOAL} />
      <rect x={84} y={52} width={32} height={12} fill={color} />
      <polygon points="116,52 160,62 160,74 116,64" fill={CHARCOAL} />
      {chips.slice(0, 6).map((c, i) => (
        <rect key={i} x={88 + (i % 2) * 13} y={72 + Math.floor(i / 2) * 15} width={11} height={11} rx={1.5} fill={c} stroke="rgba(0,0,0,0.12)" />
      ))}
      {chips.slice(0, 4).map((c, i) => (
        <polygon key={`l${i}`} points={`46,${86 + i * 18} 78,${79 + i * 18} 78,${91 + i * 18} 46,${98 + i * 18}`} fill={c} opacity={0.9} />
      ))}
      <g style={DISPLAY} textAnchor="middle">
        <text x={100} y={130} fontSize={5.5} fontWeight={700} fill={INK}>
          {product.labelName.split(" ")[0].toUpperCase()}
        </text>
        <text x={100} y={138} fontSize={5.5} fontWeight={700} fill={INK}>
          {product.labelName.split(" ").slice(1).join(" ").toUpperCase()}
        </text>
      </g>
      <text x={100} y={160} fontSize={4.2} textAnchor="middle" fill="#71717A" style={MONO}>
        {product.sku}
      </text>
    </g>
  );
}

export function ProductImage({
  product,
  className,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  priority = false,
}: {
  product: ImageProduct;
  className?: string;
  /** Pass a wider hint (e.g. gallery stages) — defaults to a card-grid-sized hint. */
  sizes?: string;
  priority?: boolean;
}) {
  if (product.image) {
    return (
      <div className={cn("relative h-full w-full", className)}>
        <Image
          src={product.image}
          alt={`${product.labelName} — product photo`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain"
        />
      </div>
    );
  }
  const color = labelColors[product.category];
  let body: React.ReactNode;
  switch (product.visual.kind) {
    case "pail":
      body = <Pail product={product} color={color} />;
      break;
    case "ab-kit":
      body = <AbKit product={product} color={color} />;
      break;
    case "system":
      body = <SystemKit product={product} />;
      break;
    case "jug":
      body = <Jug product={product} color={color} />;
      break;
    case "jar":
      body = <Jar product={product} color={color} />;
      break;
    case "box":
      body = <FlakeBox product={product} />;
      break;
    case "bag":
      body = <Bag product={product} color={color} />;
      break;
    case "hangtag":
      body = <HangTag product={product} color={color} />;
      break;
    case "crate":
      body = <Crate product={product} />;
      break;
    case "boards":
      body = <Boards product={product} />;
      break;
    case "chart":
      body = <Chart product={product} color={color} />;
      break;
  }
  return (
    <svg viewBox="0 0 200 200" className={cn("h-full w-full", className)} role="img" aria-label={`${product.labelName} — product packaging`}>
      <ellipse cx={100} cy={182} rx={66} ry={6} fill="#000" opacity={0.1} />
      {body}
    </svg>
  );
}
