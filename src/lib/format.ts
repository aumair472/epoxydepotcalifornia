const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatPrice(value: number) {
  return usd.format(value);
}

/** Product price, "From $x" for SKUs with sized prices, or "Call for price" when unconfirmed. */
export function formatProductPrice(product: { price: number; callForPrice?: boolean; priceOptions?: { price: number }[] }) {
  if (product.callForPrice) return "Call for price";
  return product.priceOptions && product.priceOptions.length > 1 ? `From ${usd.format(product.price)}` : usd.format(product.price);
}

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

/** "Aug 28, 2026" — dates are ISO (YYYY-MM-DD) strings parsed as UTC to avoid TZ drift. */
export function formatDate(iso: string) {
  return dateFmt.format(new Date(`${iso}T00:00:00Z`));
}

export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}
