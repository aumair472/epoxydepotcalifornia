import { Bestsellers } from "@/components/home/Bestsellers";
import { CategoryFeature } from "@/components/home/CategoryFeature";
import { Hero } from "@/components/home/Hero";
import { PathSelector } from "@/components/home/PathSelector";
import { ResourceHighlights } from "@/components/home/ResourceHighlights";
import { ValueProps } from "@/components/home/ValueProps";
import { OfferBanner } from "@/components/offer/OfferBanner";
import { OfferBar } from "@/components/offer/OfferBar";
import { categoryFeatures } from "@/data/mockData";

export default function HomePage() {
  return (
    <>
      <OfferBar />
      <Hero />
      <OfferBanner />
      <ValueProps />
      <PathSelector />
      <Bestsellers />
      {categoryFeatures.map((feature, i) => (
        <CategoryFeature key={feature.id} feature={feature} index={i} />
      ))}
      <ResourceHighlights />
    </>
  );
}
