/** id of the search field on the shop and category pages. */
export const SHOP_SEARCH_ID = "shop-search";

/**
 * On a shop page, search happens in the page's own field, so the header search, the mobile
 * menu's search and the ⌘K / "/" shortcuts bring that field into view instead of opening the
 * search dialog. Returns false when the page has no shop search field.
 */
export function focusShopSearch() {
  const field = document.getElementById(SHOP_SEARCH_ID);
  if (!(field instanceof HTMLInputElement)) return false;
  // After the current event, so a closing dialog's focus return doesn't take focus back.
  setTimeout(() => {
    // Scroll only when the field is out of sight (on phones it's sticky, so usually it isn't),
    // and stop below the sticky header.
    const top = field.getBoundingClientRect().top;
    const headerBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
    if (top < headerBottom || top > window.innerHeight - 80) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: window.scrollY + top - headerBottom - 24, behavior: reduceMotion ? "auto" : "smooth" });
    }
    field.focus({ preventScroll: true });
    field.select();
  }, 0);
  return true;
}
