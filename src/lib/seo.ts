import { siteConfig } from "@/data/mockData";

const TITLE_SUFFIX = ` | ${siteConfig.name}`;

/** Page title for metadata: drops the brand suffix when it would push the title past ~60 characters. */
export function seoTitle(title: string) {
  return title.length + TITLE_SUFFIX.length > 60 ? { absolute: title } : title;
}

/** Meta description clipped to search-snippet length on a word boundary. */
export function seoDescription(text: string, max = 155) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:—-]$/, "")}…`;
}
