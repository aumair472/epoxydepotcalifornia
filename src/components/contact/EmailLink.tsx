"use client";

import { useContactDetails } from "@/hooks/useContactDetails";
import { mailtoHref } from "@/lib/contact";

interface EmailLinkProps {
  subject?: string;
  body?: string;
  className?: string;
  addressClassName?: string;
  /** Leave out the address (when `children` already says "Email us" or similar). */
  hideAddress?: boolean;
  /** Rendered before the address, e.g. an icon. */
  children?: React.ReactNode;
}

/** `mailto:` link (optionally prefilled) whose address only exists in the browser. */
export function EmailLink({ subject, body, className, addressClassName, hideAddress = false, children }: EmailLinkProps) {
  const contact = useContactDetails();
  return (
    <a href={contact ? mailtoHref(subject, body) : "/contact"} className={className}>
      {children}
      {!hideAddress && <span className={addressClassName}>{contact?.email ?? "Email us"}</span>}
    </a>
  );
}
