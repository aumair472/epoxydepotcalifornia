/** Minimal brand glyphs — lucide v1 no longer ships brand icons. */
const paths: Record<string, React.ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </>
  ),
  facebook: <path d="M14 8h2.5V4.5H14c-2.5 0-4 1.7-4 4.2V11H7.5v3.5H10V21h3.5v-6.5H16l.5-3.5h-3V9c0-.6.4-1 1-1z" />,
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10.5 9.5 4 2.5-4 2.5z" fill="currentColor" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10.5V17M8 7.5v.01M11.5 17v-6.5M11.5 13.5c0-1.7 1-3 2.6-3s2.4 1.1 2.4 3V17" />
    </>
  ),
};

export function SocialIcon({ name, className }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
}
