import type { MetadataRoute } from "next";
import { articles, categories, infoPages, products, siteConfig } from "@/data/mockData";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/shop",
    "/color-charts",
    "/training",
    "/resources",
    "/contractors",
    "/contact",
    ...categories.map((c) => `/shop/${c.slug}`),
    ...products.map((p) => `/product/${p.id}`),
    ...articles.map((a) => `/resources/${a.slug}`),
    ...infoPages.map((p) => `/info/${p.slug}`),
  ];
  return paths.map((path) => ({ url: `${siteConfig.url}${path === "/" ? "" : path}` }));
}
