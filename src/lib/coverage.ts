import type { Coverage } from "@/types";

export interface CoverageInput {
  sqft: number;
  coats: number;
  /** Target thickness; only applied when the product's coverage has an `atMils` basis. */
  mils?: number;
}

export interface CoverageResult {
  units: number;
  /** Effective square feet one unit covers per coat at the requested thickness. */
  sqftPerUnit: number;
  totalSqft: number;
}

/** How many purchasable units cover `sqft` × `coats` at the requested thickness. */
export function calculateCoverage(coverage: Coverage, input: CoverageInput): CoverageResult {
  const sqft = Math.max(0, input.sqft);
  const coats = Math.max(1, Math.round(input.coats));
  const milFactor = coverage.atMils && input.mils && input.mils > 0 ? input.mils / coverage.atMils : 1;
  const sqftPerUnit = coverage.sqftPerUnit / milFactor;
  const totalSqft = sqft * coats;
  const units = sqft > 0 ? Math.max(1, Math.ceil(totalSqft / sqftPerUnit)) : 0;
  return { units, sqftPerUnit, totalSqft };
}
