const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatPrice(value: number) {
  return usd.format(value);
}

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const monthDay = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

/** "Aug 28, 2026" — dates are ISO (YYYY-MM-DD) strings parsed as UTC to avoid TZ drift. */
export function formatDate(iso: string) {
  return dateFmt.format(new Date(`${iso}T00:00:00Z`));
}

/** "Oct 8–9" or "Oct 30 – Nov 1" style class date ranges. */
export function formatDateRange(start: string, end?: string) {
  const s = new Date(`${start}T00:00:00Z`);
  if (!end) return monthDay.format(s);
  const e = new Date(`${end}T00:00:00Z`);
  if (s.getUTCMonth() === e.getUTCMonth()) {
    return `${monthDay.format(s)}–${e.getUTCDate()}`;
  }
  return `${monthDay.format(s)} – ${monthDay.format(e)}`;
}

export function formatFileSize(kb: number) {
  return kb >= 1000 ? `${(kb / 1000).toFixed(1)} MB` : `${kb} KB`;
}

export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

/** Short random-looking reference for mock form confirmations. */
export function makeReference(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}
