/**
 * Minimal, dependency-free PDF 1.4 writer for placeholder TDS/SDS/guide documents.
 * Supports a branded header band, headings, wrapped paragraphs, bullet and key/value rows,
 * and automatic pagination on US Letter pages using the built-in Helvetica fonts.
 */

export type PdfBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "rows"; rows: [string, string][] }
  | { type: "note"; text: string };

export interface PdfDocumentInput {
  brand: string;
  docType: string;
  title: string;
  subtitle?: string;
  blocks: PdfBlock[];
  footer: string;
}

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN_X = 54;
const TOP_Y = 686;
const BOTTOM_Y = 72;

/** Map typographic characters to WinAnsi-safe equivalents; drop anything else outside Latin-1. */
function sanitize(text: string) {
  return text
    .replace(/[–—]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/…/g, "...")
    .replace(/×/g, "x")
    .replace(/≥/g, ">=")
    .replace(/≤/g, "<=")
    .replace(/·/g, "-")
    .replace(/[^\x20-\xFF]/g, "?");
}

function escapePdf(text: string) {
  return sanitize(text).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

/** Rough Helvetica wrap: average glyph width ≈ 0.5em. */
function wrap(text: string, size: number, width: number) {
  const maxChars = Math.floor(width / (size * 0.5));
  const words = sanitize(text).split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

interface Op {
  font: "F1" | "F2";
  size: number;
  x: number;
  text: string;
  color?: [number, number, number];
  gapBefore?: number;
}

function layout(blocks: PdfBlock[]): Op[] {
  const width = PAGE_W - MARGIN_X * 2;
  const ops: Op[] = [];
  for (const block of blocks) {
    switch (block.type) {
      case "heading":
        ops.push({ font: "F2", size: 12, x: MARGIN_X, text: block.text.toUpperCase(), color: [0.918, 0.345, 0.047], gapBefore: 14 });
        break;
      case "paragraph":
        wrap(block.text, 10, width).forEach((l, i) => ops.push({ font: "F1", size: 10, x: MARGIN_X, text: l, gapBefore: i === 0 ? 4 : 0 }));
        break;
      case "note":
        wrap(block.text, 9, width).forEach((l, i) => ops.push({ font: "F2", size: 9, x: MARGIN_X, text: l, color: [0.45, 0.45, 0.48], gapBefore: i === 0 ? 8 : 0 }));
        break;
      case "bullets":
        block.items.forEach((item, idx) =>
          wrap(item, 10, width - 14).forEach((l, i) =>
            ops.push({ font: "F1", size: 10, x: MARGIN_X + 14, text: i === 0 ? `-  ${l}` : `   ${l}`, gapBefore: idx === 0 && i === 0 ? 4 : 0 })
          )
        );
        break;
      case "rows":
        block.rows.forEach(([label, value], idx) => {
          const valueLines = wrap(value, 10, width - 170);
          valueLines.forEach((l, i) => {
            if (i === 0) ops.push({ font: "F2", size: 10, x: MARGIN_X, text: label, gapBefore: idx === 0 ? 4 : 0 });
            ops.push({ font: "F1", size: 10, x: MARGIN_X + 170, text: l, gapBefore: i === 0 ? -14 : 0 });
          });
        });
        break;
    }
  }
  return ops;
}

function pageStream(input: PdfDocumentInput, ops: Op[], pageNo: number, pageCount: number) {
  const out: string[] = [];
  // Header band
  out.push("0.102 0.102 0.114 rg 0 732 612 60 re f");
  out.push("0.976 0.451 0.086 rg 0 726 612 6 re f");
  out.push(`BT /F2 15 Tf 1 1 1 rg ${MARGIN_X} 762 Td (${escapePdf(input.brand.toUpperCase())}) Tj ET`);
  out.push(`BT /F2 9 Tf 0.851 0.643 0.255 rg ${MARGIN_X} 746 Td (${escapePdf(input.docType.toUpperCase())}) Tj ET`);
  if (pageNo === 1) {
    wrap(input.title, 18, PAGE_W - MARGIN_X * 2).forEach((line, i) => {
      out.push(`BT /F2 18 Tf 0.094 0.094 0.106 rg ${MARGIN_X} ${704 - i * 22} Td (${escapePdf(line)}) Tj ET`);
    });
  }
  // Body
  let y = pageNo === 1 ? TOP_Y - (input.subtitle ? 44 : 30) : TOP_Y + 10;
  if (pageNo === 1 && input.subtitle) {
    out.push(`BT /F1 10 Tf 0.322 0.322 0.357 rg ${MARGIN_X} ${TOP_Y - 26} Td (${escapePdf(input.subtitle)}) Tj ET`);
  }
  for (const op of ops) {
    y -= (op.gapBefore ?? 0) + op.size + 4;
    const [r, g, b] = op.color ?? [0.094, 0.094, 0.106];
    out.push(`BT /${op.font} ${op.size} Tf ${r} ${g} ${b} rg ${op.x} ${y.toFixed(1)} Td (${escapePdf(op.text)}) Tj ET`);
  }
  // Footer
  out.push("0.898 0.878 0.835 RG 0.75 w 54 52 m 558 52 l S");
  out.push(`BT /F1 8 Tf 0.443 0.443 0.478 rg ${MARGIN_X} 38 Td (${escapePdf(input.footer)}) Tj ET`);
  out.push(`BT /F1 8 Tf 0.443 0.443 0.478 rg 510 38 Td (Page ${pageNo} of ${pageCount}) Tj ET`);
  return out.join("\n");
}

/** Split laid-out ops into pages by vertical space. */
function paginate(input: PdfDocumentInput, ops: Op[]) {
  const pages: Op[][] = [];
  let current: Op[] = [];
  let y = TOP_Y - (input.subtitle ? 44 : 30);
  for (const op of ops) {
    const step = (op.gapBefore ?? 0) + op.size + 4;
    if (y - step < BOTTOM_Y && current.length) {
      pages.push(current);
      current = [];
      y = TOP_Y + 10;
    }
    y -= step;
    current.push(op);
  }
  if (current.length || !pages.length) pages.push(current);
  return pages;
}

export function buildPdf(input: PdfDocumentInput): Uint8Array<ArrayBuffer> {
  const pages = paginate(input, layout(input.blocks));
  const objects: string[] = [];
  // 1: catalog, 2: pages, 3: Helvetica, 4: Helvetica-Bold, then (page, content) pairs
  const pageIds = pages.map((_, i) => 5 + i * 2);
  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[2] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pages.length} >>`;
  objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>";
  objects[4] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>";
  pages.forEach((ops, i) => {
    const pageId = pageIds[i];
    const stream = pageStream(input, ops, i + 1, pages.length);
    objects[pageId] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
      `/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${pageId + 1} 0 R >>`;
    objects[pageId + 1] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  });

  let body = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const offsets: number[] = [];
  for (let id = 1; id < objects.length; id++) {
    offsets[id] = body.length;
    body += `${id} 0 obj\n${objects[id]}\nendobj\n`;
  }
  const xrefAt = body.length;
  body += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let id = 1; id < objects.length; id++) {
    body += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
  }
  body += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF\n`;

  // Every character is Latin-1 after sanitize(), so one char === one byte.
  const bytes = new Uint8Array(body.length);
  for (let i = 0; i < body.length; i++) bytes[i] = body.charCodeAt(i) & 0xff;
  return bytes;
}
