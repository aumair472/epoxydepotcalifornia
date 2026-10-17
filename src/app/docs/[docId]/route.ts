import { resourceDocs } from "@/data/mockData";
import { getDoc } from "@/lib/catalog";
import { renderDocumentPdf } from "@/lib/documents";

export const dynamicParams = false;

export function generateStaticParams() {
  return resourceDocs.map((d) => ({ docId: d.id }));
}

/** Printable color chart PDFs, generated from the color data at build time. */
export async function GET(_request: Request, { params }: RouteContext<"/docs/[docId]">) {
  const { docId } = await params;
  const doc = getDoc(docId);
  if (!doc) return new Response("Document not found", { status: 404 });

  return new Response(renderDocumentPdf(doc), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${doc.id}.pdf"`,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
