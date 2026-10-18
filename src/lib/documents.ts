import { flakeBlends, metallicColors, siteConfig, solidColors } from "@/data/mockData";
import { buildPdf, type PdfBlock } from "@/lib/pdf";
import type { ResourceDoc } from "@/types";

function chartBlocks(doc: ResourceDoc): PdfBlock[] {
  if (doc.id === "chart-metallic") {
    return [
      { type: "paragraph", text: doc.description },
      { type: "heading", text: "Metallic pigments" },
      { type: "rows", rows: metallicColors.map((c) => [c.isNew ? `${c.name} (NEW)` : c.name, c.hex]) },
      { type: "note", text: "Screen and print colors are approximations. Order a physical metallic chart for accurate matching." },
    ];
  }
  if (doc.id === "chart-flake-blends") {
    return [
      { type: "paragraph", text: doc.description },
      { type: "heading", text: "Flake blends" },
      { type: "rows", rows: flakeBlends.map((b) => [b.size ? `${b.name} (${b.size})` : b.name, `${b.description} Chips: ${b.chips.join(", ")}`]) },
      { type: "note", text: "Order a flake sample board set for accurate color matching." },
    ];
  }
  return [
    { type: "paragraph", text: doc.description },
    { type: "heading", text: "Solid colors" },
    { type: "rows", rows: solidColors.map((c) => [c.name, c.hex]) },
    { type: "note", text: "Screen and print colors are approximations. Request a physical sample for accurate matching." },
  ];
}

/** Render a color chart document to PDF bytes. */
export function renderDocumentPdf(doc: ResourceDoc) {
  return buildPdf({
    brand: siteConfig.name,
    docType: doc.type,
    title: doc.title,
    subtitle: `Revised ${doc.updated}`,
    blocks: chartBlocks(doc),
    footer: `${siteConfig.name}  -  ${siteConfig.url.replace("https://", "")}`,
  });
}
