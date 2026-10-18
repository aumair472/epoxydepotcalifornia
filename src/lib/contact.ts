import { siteConfig } from "@/data/mockData";

export interface ContactDetails {
  phone: string;
  phoneHref: string;
  email: string;
  emailHref: string;
}

/** Shown in place of the number until the browser decodes it (same width, so nothing shifts). */
export const MASKED_PHONE = "(•••) •••-••••";

const decode = (value: string) => [...atob(value)].reverse().join("");

/** Decodes the store's phone and email. Only call this in the browser (events, or useContactDetails). */
export function decodeContact(): ContactDetails {
  const { phone, phoneDial, email } = siteConfig.contactEncoded;
  const address = decode(email);
  return { phone: decode(phone), phoneHref: `tel:${decode(phoneDial)}`, email: address, emailHref: `mailto:${address}` };
}

/** A `mailto:` link to the store, optionally prefilled with a subject and body. Browser only. */
export function mailtoHref(subject?: string, body?: string) {
  const params = [subject && `subject=${encodeURIComponent(subject)}`, body && `body=${encodeURIComponent(body)}`].filter(Boolean);
  const { emailHref } = decodeContact();
  return params.length ? `${emailHref}?${params.join("&")}` : emailHref;
}
