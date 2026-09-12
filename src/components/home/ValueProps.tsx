import { Icon } from "@/components/ui/Icon";
import { valueProps } from "@/data/mockData";

/** Hazard stripe over a dark bar of four service promises. */
export function ValueProps() {
  return (
    <section aria-label="Why contractors buy from us" className="bg-charcoal">
      <div aria-hidden className="hazard-stripe h-2.5" />
      <ul className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {valueProps.map((v) => (
          <li key={v.title} className="flex gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-md border border-gold/25 bg-gold/10 text-gold">
              <Icon name={v.icon} className="size-5" />
            </span>
            <div>
              <h3 className="font-sans text-[12px] font-bold tracking-[0.14em] text-white uppercase">{v.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-white/60">{v.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
