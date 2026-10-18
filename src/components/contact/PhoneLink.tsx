"use client";

import { useContactDetails } from "@/hooks/useContactDetails";
import { MASKED_PHONE } from "@/lib/contact";

interface PhoneLinkProps {
  className?: string;
  numberClassName?: string;
  /** Leave out the number (when `children` already says "Call us" or similar). */
  hideNumber?: boolean;
  /** Rendered before the number, e.g. an icon. */
  children?: React.ReactNode;
}

/**
 * `tel:` link whose number only exists in the browser. Before hydration it shows a masked number
 * of the same width and points to /contact, so bots reading the HTML never see the digits.
 */
export function PhoneLink({ className, numberClassName, hideNumber = false, children }: PhoneLinkProps) {
  const contact = useContactDetails();
  return (
    <a href={contact?.phoneHref ?? "/contact"} className={className}>
      {children}
      {!hideNumber && <span className={numberClassName}>{contact?.phone ?? MASKED_PHONE}</span>}
    </a>
  );
}
