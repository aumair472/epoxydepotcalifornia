import { Bestsellers } from "@/components/home/Bestsellers";
import { CategoryFeature } from "@/components/home/CategoryFeature";
import { Hero } from "@/components/home/Hero";
import { Newsletter } from "@/components/home/Newsletter";
import { PathSelector } from "@/components/home/PathSelector";
import { ResourceHighlights } from "@/components/home/ResourceHighlights";
import { Testimonials } from "@/components/home/Testimonials";
import { ValueProps } from "@/components/home/ValueProps";
import { categoryFeatures } from "@/data/mockData";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueProps />
      <PathSelector />
      <Bestsellers />
      {categoryFeatures.map((feature, i) => (
        <CategoryFeature key={feature.id} feature={feature} index={i} />
      ))}
      <Testimonials />
      <ResourceHighlights />
      <Newsletter />
    </>
  );
}
