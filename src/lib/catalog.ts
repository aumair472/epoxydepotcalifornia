/**
 * Catalog queries over the mock data layer. Pure functions — safe in server and client components.
 */
import {
  articles,
  categories,
  infoPages,
  packGroups,
  products,
  resourceDocs,
  reviewPool,
  tagLabels,
  trainingClasses,
} from "@/data/mockData";
import type {
  Category,
  CategorySlug,
  PackGroupId,
  Product,
  ProductTag,
  ResourceDoc,
  Spec,
} from "@/types";

const productMap = new Map(products.map((p) => [p.id, p]));
const categoryMap = new Map(categories.map((c) => [c.slug, c]));
const docMap = new Map(resourceDocs.map((d) => [d.id, d]));
const productOrder = new Map(products.map((p, i) => [p.id, i]));

/* ---------------- Lookups ---------------- */

export function getProduct(id: string) {
  return productMap.get(id);
}

export function getProductsByIds(ids: readonly string[]) {
  return ids.map((id) => productMap.get(id)).filter((p): p is Product => Boolean(p));
}

export function isCategorySlug(slug: string): slug is CategorySlug {
  return categoryMap.has(slug as CategorySlug);
}

export function getCategory(slug: string) {
  return categoryMap.get(slug as CategorySlug);
}

export function getCategoryName(slug: CategorySlug) {
  return categoryMap.get(slug)?.name ?? slug;
}

export function isProductTag(tag: string): tag is ProductTag {
  return tag in tagLabels;
}

export function getTagLabel(tag: ProductTag) {
  return tagLabels[tag];
}

export function isPackGroupId(id: string): id is PackGroupId {
  return packGroups.some((g) => g.id === id);
}

export function getProductsByCategory(slug: CategorySlug) {
  return products.filter((p) => p.category === slug);
}

export function getBestsellers(limit = 4) {
  return products
    .filter((p) => p.bestsellerRank !== undefined)
    .sort((a, b) => (a.bestsellerRank ?? 0) - (b.bestsellerRank ?? 0))
    .slice(0, limit);
}

/** Same-category products first, then products sharing a tag. */
export function getRelatedProducts(product: Product, limit = 4) {
  const sameCategory = products.filter((p) => p.id !== product.id && p.category === product.category);
  const sharedTag = products.filter(
    (p) =>
      p.id !== product.id &&
      p.category !== product.category &&
      p.tags.some((t) => product.tags.includes(t))
  );
  return [...sameCategory, ...sharedTag].slice(0, limit);
}

export function getProductDocs(productId: string) {
  return resourceDocs.filter((d) => d.productId === productId);
}

export function getDoc(id: string) {
  return docMap.get(id);
}

export function getDocHref(doc: Pick<ResourceDoc, "id">) {
  return `/docs/${doc.id}`;
}

export function getProductReviews(product: Product) {
  return reviewPool[product.category].slice(0, Math.min(3, product.reviewCount));
}

/** Base specs every product shares, followed by product-specific specs. */
export function getProductSpecs(product: Product): Spec[] {
  return [
    { label: "Category", value: getCategoryName(product.category) },
    { label: "Package", value: product.packSize },
    { label: "SKU", value: product.sku },
    ...product.specs,
  ];
}

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function getInfoPage(slug: string) {
  return infoPages.find((p) => p.slug === slug);
}

export function getTrainingClass(id: string) {
  return trainingClasses.find((c) => c.id === id);
}

/** Classes with open seats, soonest first. */
export function getUpcomingClasses(limit?: number) {
  const open = trainingClasses
    .filter((c) => c.seatsLeft > 0)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  return limit ? open.slice(0, limit) : open;
}

/* ---------------- Search ---------------- */

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9%/"]+/g, " ").trim();

function tokenize(query: string) {
  return normalize(query).split(" ").filter(Boolean);
}

function scoreProduct(p: Product, tokens: string[], phrase: string) {
  const name = normalize(`${p.name} ${p.labelName}`);
  const categoryName = normalize(getCategoryName(p.category));
  const tags = normalize(p.tags.map((t) => `${t} ${tagLabels[t]}`).join(" "));
  const rest = normalize(`${p.sku} ${p.shortDescription} ${p.packSize} ${p.description}`);

  let score = 0;
  for (const token of tokens) {
    if (name.includes(token)) score += name.split(" ").some((w) => w.startsWith(token)) ? 4 : 3;
    else if (categoryName.includes(token)) score += 2;
    else if (tags.includes(token)) score += 2;
    else if (rest.includes(token)) score += 1;
    else return 0; // every token must match somewhere
  }
  if (name.includes(phrase)) score += 6;
  if (name.startsWith(phrase)) score += 4;
  if (categoryName.includes(phrase)) score += 5;
  return score;
}

export interface SearchResults {
  products: Product[];
  categories: Category[];
  docs: ResourceDoc[];
  total: number;
}

export function searchProducts(query: string) {
  const tokens = tokenize(query);
  if (!tokens.length) return [];
  const phrase = tokens.join(" ");
  return products
    .map((p) => ({ p, score: scoreProduct(p, tokens, phrase) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.p.rating - a.p.rating)
    .map((r) => r.p);
}

export function searchCatalog(
  query: string,
  limits: { products?: number; categories?: number; docs?: number } = {}
): SearchResults {
  const tokens = tokenize(query);
  if (!tokens.length) return { products: [], categories: [], docs: [], total: 0 };

  const matchedProducts = searchProducts(query);
  const matchedCategories = categories.filter((c) => {
    const hay = normalize(`${c.name} ${c.description}`);
    return tokens.every((t) => hay.includes(t));
  });
  const matchedDocs = resourceDocs.filter((d) => {
    const hay = normalize(`${d.title} ${d.type} ${d.description}`);
    return tokens.every((t) => hay.includes(t));
  });

  return {
    products: matchedProducts.slice(0, limits.products ?? 6),
    categories: matchedCategories.slice(0, limits.categories ?? 3),
    docs: matchedDocs.slice(0, limits.docs ?? 4),
    total: matchedProducts.length + matchedCategories.length + matchedDocs.length,
  };
}

/* ---------------- Filtering & sorting ---------------- */

export interface ProductFilters {
  category?: CategorySlug;
  q?: string;
  tag?: ProductTag;
  min?: number;
  max?: number;
  packs?: PackGroupId[];
}

export type SortKey = "featured" | "price-asc" | "price-desc" | "name-asc" | "rating";

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "rating", label: "Top rated" },
];

export function isSortKey(value: string): value is SortKey {
  return sortOptions.some((o) => o.value === value);
}

function matches(p: Product, f: ProductFilters, skip?: "category" | "packs") {
  if (skip !== "category" && f.category && p.category !== f.category) return false;
  if (f.tag && !p.tags.includes(f.tag)) return false;
  if (f.min !== undefined && p.price < f.min) return false;
  if (f.max !== undefined && p.price > f.max) return false;
  if (skip !== "packs" && f.packs?.length && !f.packs.includes(p.packGroup)) return false;
  return true;
}

export function filterProducts(filters: ProductFilters, list: Product[] = products) {
  const pool = filters.q ? searchProducts(filters.q).filter((p) => list.includes(p)) : list;
  return pool.filter((p) => matches(p, filters));
}

export function sortProducts(list: Product[], sort: SortKey) {
  const sorted = [...list];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    default:
      return sorted.sort((a, b) => (productOrder.get(a.id) ?? 0) - (productOrder.get(b.id) ?? 0));
  }
}

/** Counts for each facet value given every *other* active filter (standard faceted search). */
export function getFacetCounts(filters: ProductFilters) {
  const base = filters.q ? searchProducts(filters.q) : products;
  const byCategory = new Map<CategorySlug, number>();
  const byPack = new Map<PackGroupId, number>();
  for (const p of base) {
    if (matches(p, filters, "category")) byCategory.set(p.category, (byCategory.get(p.category) ?? 0) + 1);
    if (matches(p, filters, "packs")) byPack.set(p.packGroup, (byPack.get(p.packGroup) ?? 0) + 1);
  }
  const allCategories = base.filter((p) => matches(p, filters, "category")).length;
  return { byCategory, byPack, allCategories };
}
