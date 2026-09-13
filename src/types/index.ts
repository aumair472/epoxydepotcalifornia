/* Shared domain types. All data lives in src/data/mockData.ts. */

export type CategorySlug =
  | "epoxy"
  | "polyaspartic"
  | "urethane"
  | "flake"
  | "pigments"
  | "stains-sealers"
  | "surface-prep"
  | "tools"
  | "sundries"
  | "sales-aids";

/** Keys resolved to lucide icons by components/ui/Icon.tsx so data stays serializable. */
export type IconKey =
  | "layers"
  | "shield"
  | "shield-check"
  | "droplets"
  | "sparkles"
  | "palette"
  | "paint-bucket"
  | "paintbrush"
  | "wrench"
  | "hammer"
  | "package"
  | "file-text"
  | "book-open"
  | "graduation-cap"
  | "truck"
  | "headset"
  | "badge-percent"
  | "tag"
  | "car"
  | "hard-hat"
  | "warehouse"
  | "home"
  | "flask"
  | "sun"
  | "gauge"
  | "ruler"
  | "hand"
  | "footprints"
  | "brush"
  | "grid"
  | "store"
  | "handshake"
  | "clipboard"
  | "timer"
  | "zap";

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export interface Category {
  slug: CategorySlug;
  name: string;
  /** Shorter label used on the hero tiles ("Flakes"). */
  tileLabel: string;
  description: string;
  longDescription: string;
  icon: IconKey;
  image: string;
  /** Overlay tint for photo tiles. */
  tint: string;
  /** Sidebar bullet + SVG label color. */
  color: string;
}

export type Badge = "Best Seller" | "New" | "Pro" | "Fast Cure" | "Low Stock";

export type PackGroupId =
  | "quart-gal"
  | "2-gal"
  | "3-gal"
  | "5-gal"
  | "system"
  | "box-bag"
  | "tub-pack"
  | "unit"
  | "set";

export interface PackGroup {
  id: PackGroupId;
  label: string;
}

export type ProductTag =
  | "garage-kits"
  | "metallic"
  | "table-top"
  | "topcoat"
  | "primer"
  | "build-coat"
  | "repair"
  | "ppe"
  | "decorative"
  | "commercial"
  | "equipment";

export type VisualKind =
  | "pail"
  | "ab-kit"
  | "system"
  | "jug"
  | "jar"
  | "box"
  | "bag"
  | "hangtag"
  | "crate"
  | "boards"
  | "chart";

export interface ProductVisual {
  kind: VisualKind;
  /** Product color hint (pigment, stain, flake base). */
  tone?: string;
  /** Flake chip colors for boxes/boards. */
  chips?: string[];
  /** Icon printed on hangtag/crate packaging. */
  icon?: IconKey;
}

export interface Spec {
  label: string;
  value: string;
}

export interface Coverage {
  /** Square feet one purchasable unit covers per coat at the stated basis. */
  sqftPerUnit: number;
  /** When set, the calculator scales coverage by requested mils vs this basis. */
  atMils?: number;
  basis: string;
}

export interface ApplicationInfo {
  mixRatio: string;
  potLife: string;
  recoat: string;
  lightTraffic: string;
  fullCure: string;
  temperature: string;
  coverage: Coverage;
  recommendedCoats: number;
  steps: string[];
}

export interface Review {
  id: string;
  author: string;
  role: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  /** Printed on SVG packaging labels. */
  labelName: string;
  category: CategorySlug;
  price: number;
  packSize: string;
  packGroup: PackGroupId;
  tags: ProductTag[];
  badge?: Badge;
  stock: number;
  rating: number;
  reviewCount: number;
  /** Position in the home bestsellers row (lower = first). */
  bestsellerRank?: number;
  shortDescription: string;
  description: string;
  features: string[];
  specs: Spec[];
  application?: ApplicationInfo;
  visual: ProductVisual;
  /** Real product photo path (public/products/…) from the live catalog; falls back to the generated SVG render when absent. */
  image?: string;
}

export type DocType = "TDS" | "SDS" | "Color Chart" | "Mix Guide" | "How-To";

export interface ResourceDoc {
  id: string;
  type: DocType;
  title: string;
  description: string;
  category?: CategorySlug;
  productId?: string;
  pages: number;
  sizeKb: number;
  updated: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  /** Placeholder copy — replace with real customer quotes before launch. */
  isPlaceholder: true;
}

export interface WorkPath {
  id: string;
  kicker: string;
  title: string;
  description: string;
  cta: NavLink;
  icon: IconKey;
}

export interface ValueProp {
  title: string;
  description: string;
  icon: IconKey;
}

export interface FeatureCta extends NavLink {
  variant: "primary" | "outline";
}

export interface CategoryFeature {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  ctas: FeatureCta[];
  icon: IconKey;
}

export interface ResourceCard {
  title: string;
  description: string;
  longDescription: string;
  href: string;
  cta: string;
  icon: IconKey;
}

export interface SolidColor {
  name: string;
  hex: string;
}

export interface MetallicColor {
  name: string;
  hex: string;
  gradient: [string, string, string];
}

export interface FlakeBlend {
  id: string;
  name: string;
  description: string;
  chips: string[];
  productId?: string;
}

export interface Article {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  date: string;
  readMins: number;
  image: string;
  author: string;
  body: { heading?: string; paragraphs: string[] }[];
}

export type ClassLevel = "Beginner" | "Intermediate" | "Advanced" | "All levels";

export interface TrainingClass {
  id: string;
  title: string;
  level: ClassLevel;
  format: "In-person" | "Virtual";
  startDate: string;
  endDate?: string;
  schedule: string;
  city: string;
  venue: string;
  duration: string;
  price: number;
  seatsTotal: number;
  seatsLeft: number;
  summary: string;
  description: string;
  agenda: string[];
  audience: string;
  image: string;
}

export interface InfoPage {
  slug: string;
  title: string;
  eyebrow: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
}

/** What a "Call to order" request is about, shown in the call dialog so the caller knows what to mention. */
export interface CallSubject {
  title: string;
  detail?: string;
}
