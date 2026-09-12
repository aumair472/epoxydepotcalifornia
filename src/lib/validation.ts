/** Small client-side validators for the mock forms. */

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export const isPhone = (v: string) => v.replace(/\D/g, "").length >= 10;

export const isZip = (v: string) => /^\d{5}(-\d{4})?$/.test(v.trim());

export type FieldErrors = Record<string, string>;

/** Read a trimmed string field from FormData. */
export const field = (data: FormData, name: string) => String(data.get(name) ?? "").trim();

/** Focus the first invalid control so keyboard and screen-reader users land on the problem. */
export function focusFirstError(form: HTMLFormElement, errors: FieldErrors) {
  const first = Object.keys(errors)[0];
  if (!first) return;
  const el = form.elements.namedItem(first);
  if (el instanceof HTMLElement) el.focus();
}
