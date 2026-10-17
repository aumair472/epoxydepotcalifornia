import { siteConfig } from "@/data/mockData";

/** A `mailto:` link to the store, optionally prefilled with a subject and body. */
export function mailtoHref(subject?: string, body?: string) {
  const params = [subject && `subject=${encodeURIComponent(subject)}`, body && `body=${encodeURIComponent(body)}`].filter(Boolean);
  return params.length ? `${siteConfig.emailHref}?${params.join("&")}` : siteConfig.emailHref;
}
