import { siteConfig } from "@/data/mockData";
import type { Article, Product } from "@/types";

/**
 * schema.org JSON-LD builders. Every URL is absolute (from `siteConfig.url`), and the
 * business is referenced by `@id` so each page links back to one Organization node.
 */

const ORG_ID = `${siteConfig.url}/#organization`;
const SITE_ID = `${siteConfig.url}/#website`;

export const absoluteUrl = (path: string) => (/^https?:/.test(path) ? path : `${siteConfig.url}${path === "/" ? "" : path}`);

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": ORG_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/logo.png"),
    image: absoluteUrl("/logo.png"),
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: "US",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "17:00",
    },
    sameAs: siteConfig.socials.map((s) => s.href),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteConfig.url}/shop?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Home is always the first crumb; a crumb without `href` is the current page. */
export function breadcrumbSchema(items: { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

/** A product photo for structured data: the product's own photo, else its first color photo. */
function productImage(product: Product) {
  const image = product.image ?? product.colors?.find((c) => c.image)?.image;
  return image ? absoluteUrl(image) : undefined;
}

/**
 * Product + Offer. Call-for-price SKUs return null: Google requires a price on an Offer,
 * and a Product without offers is reported as invalid.
 */
export function productSchema(product: Product, categoryName: string) {
  if (product.callForPrice) return null;
  const url = absoluteUrl(`/product/${product.id}`);
  const prices = product.priceOptions?.map((o) => o.price) ?? [product.price];
  const common = {
    priceCurrency: "USD",
    availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    url,
    seller: { "@id": ORG_ID },
  };
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    sku: product.sku,
    description: product.description,
    category: categoryName,
    url,
    image: productImage(product),
    offers:
      prices.length > 1
        ? { "@type": "AggregateOffer", lowPrice: Math.min(...prices), highPrice: Math.max(...prices), offerCount: prices.length, ...common }
        : { "@type": "Offer", price: prices[0], ...common },
  };
}

/** A category or "shop all" listing: the page plus an ItemList of its product URLs. */
export function collectionSchema(name: string, description: string, path: string, products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: { "@id": SITE_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/product/${p.id}`), name: p.name })),
    },
  };
}

export function articleSchema(article: Article) {
  const url = absoluteUrl(`/resources/${article.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.date,
    url,
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: article.author, url: siteConfig.url },
    publisher: { "@id": ORG_ID },
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

/** A plain page typed as ContactPage, AboutPage, etc., tied to the business. */
export function webPageSchema(type: "WebPage" | "ContactPage" | "AboutPage" | "CollectionPage", name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
  };
}

export function courseListSchema(courses: { title: string; summary: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: courses.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@type": "Course", name: c.title, description: c.summary, provider: { "@id": ORG_ID } },
    })),
  };
}
