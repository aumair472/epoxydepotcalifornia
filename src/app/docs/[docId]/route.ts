import { resourceDocs } from "@/data/mockData";
import { getDoc } from "@/lib/catalog";
import { renderDocumentPdf } from "@/lib/documents";

export const dynamicParams = false;

export function generateStaticParams() {
  return resourceDocs.map((d) => ({ docId: d.id }));
}

/** Placeholder TDS / SDS / chart / guide PDFs, generated from the mock catalog at build time. */
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
