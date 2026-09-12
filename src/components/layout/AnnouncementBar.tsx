import { Icon } from "@/components/ui/Icon";
import { announcements, siteConfig } from "@/data/mockData";

function Items() {
  return (
    <>
      {announcements.map((a) => (
        <span key={a.text} className="inline-flex items-center gap-2 whitespace-nowrap">
          <Icon name={a.icon} className="size-3.5 text-gold" />
          {a.text}
        </span>
      ))}
    </>
  );
}

/** Top strip. Static row on wide desktops, auto-scrolling marquee below xl (where it wouldn't fit). */
export function AnnouncementBar() {
  return (
    <div className="border-b border-white/5 bg-charcoal text-[10.5px] font-medium tracking-[0.16em] text-white/75 uppercase">
      <div className="container-page hidden h-[30px] items-center justify-between xl:flex">
        <div className="flex items-center gap-9">
          <Items />
        </div>
        <span className="text-white/55">{siteConfig.hours}</span>
      </div>
      <div className="relative flex h-[30px] items-center overflow-hidden xl:hidden" aria-label="Store announcements">
        <div className="flex w-max animate-marquee gap-10 pr-10">
          <Items />
          <span aria-hidden className="contents">
            <Items />
          </span>
        </div>
      </div>
    </div>
  );
}
