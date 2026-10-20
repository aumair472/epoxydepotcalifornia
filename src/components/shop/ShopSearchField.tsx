"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { SHOP_SEARCH_ID } from "@/lib/shopSearch";

interface ShopSearchFieldProps {
  /** The trimmed `q` from the URL. */
  query?: string;
  placeholder: string;
  onSearch: (text: string) => void;
  className?: string;
}

/** The shop's own search field. Filters the grid as you type; the text lives in the URL as `q`. */
export function ShopSearchField({ query = "", placeholder, onSearch, className }: ShopSearchFieldProps) {
  // What's typed, kept apart from the trimmed URL value so a trailing space survives while typing.
  // When `q` changes somewhere else (a filter chip, Clear all, the back button), the URL wins.
  const [draft, setDraft] = useState(query);
  const value = draft.trim() === query ? draft : query;

  const change = (text: string) => {
    setDraft(text);
    onSearch(text);
  };

  return (
    <div
      className={cn(
        "flex h-11 items-center rounded-md border border-line bg-white transition focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/15",
        className
      )}
    >
      <Search aria-hidden className="ml-3.5 size-4 shrink-0 text-subtle" />
      <label htmlFor={SHOP_SEARCH_ID} className="sr-only">
        Search products
      </label>
      <input
        id={SHOP_SEARCH_ID}
        type="search"
        value={value}
        onChange={(e) => change(e.target.value)}
        onKeyDown={(e) => {
          // Enter closes the phone keyboard so the results are visible; Escape clears.
          if (e.key === "Enter") e.currentTarget.blur();
          else if (e.key === "Escape" && value) {
            e.preventDefault();
            change("");
          }
        }}
        placeholder={placeholder}
        enterKeyHint="search"
        autoComplete="off"
        spellCheck={false}
        className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-base text-ink outline-none placeholder:text-subtle sm:text-[15px] [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            change("");
            document.getElementById(SHOP_SEARCH_ID)?.focus();
          }}
          aria-label="Clear search"
          className="mr-1 grid size-9 shrink-0 place-items-center rounded-md text-subtle transition hover:bg-cream hover:text-ink"
        >
          <X aria-hidden className="size-4" />
        </button>
      )}
    </div>
  );
}
