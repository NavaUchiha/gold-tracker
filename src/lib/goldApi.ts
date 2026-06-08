/**
 * Gold price data layer.
 *
 * This is a static SPA with no backend, so every figure is computed
 * client-side from two free, key-less, CORS-enabled public APIs:
 *
 *   1. https://api.gold-api.com/price/XAU   — live spot price of gold (XAU) in USD per troy ounce
 *   2. https://api.frankfurter.app          — live USD → INR exchange rate (ECB reference rates)
 *
 * From the USD/oz spot price we derive INR-per-gram for 24K (999 fine),
 * then scale by purity to get 22K (916) and 18K (750) — the standard
 * jewellery purities quoted by Indian bullion dealers.
 *
 * Swap GOLD_SPOT_URL / FX_URL below if you'd rather point at a paid
 * provider (e.g. one that returns Indian-association rates directly).
 */

const GOLD_SPOT_URL = "https://api.gold-api.com/price/XAU";
// `base=USD&symbols=INR` (rather than `from=USD&to=INR`) returns the most
// recent date Frankfurter has for the pair directly — the `from/to` form
// can resolve to a stale cross-rate date for some currency combinations.
const FX_URL = "https://api.frankfurter.app/latest?base=USD&symbols=INR";

const TROY_OUNCE_IN_GRAMS = 31.1034768;

// Purity ratios for common Indian jewellery karats, expressed as a
// fraction of 24K (fine) gold.
export const PURITY = {
  24: 1,
  22: 22 / 24,
  18: 18 / 24,
} as const;

export type Karat = keyof typeof PURITY;

export interface GoldSnapshot {
  /** Unix ms timestamp this snapshot was captured at (client clock). */
  at: number;
  /** ISO date (YYYY-MM-DD) — used to dedupe one snapshot per day. */
  date: string;
  /** Spot gold price in USD per troy ounce. */
  spotUsdPerOz: number;
  /** USD → INR rate used for the conversion. */
  usdInr: number;
  /** Derived INR price per gram, keyed by karat. */
  perGramInr: Record<Karat, number>;
}

interface GoldApiResponse {
  price: number;
  currency: string;
  updatedAt?: string;
}

interface FrankfurterResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`Request to ${url} failed with status ${res.status}`);
  }
  return (await res.json()) as T;
}

/** Build per-karat INR/gram figures from a USD/oz spot price + FX rate. */
export function deriveSnapshot(spotUsdPerOz: number, usdInr: number): GoldSnapshot {
  const finePerGramInr = (spotUsdPerOz / TROY_OUNCE_IN_GRAMS) * usdInr;
  const now = new Date();
  return {
    at: now.getTime(),
    date: now.toISOString().slice(0, 10),
    spotUsdPerOz,
    usdInr,
    perGramInr: {
      24: finePerGramInr * PURITY[24],
      22: finePerGramInr * PURITY[22],
      18: finePerGramInr * PURITY[18],
    },
  };
}

/** Fetch the current live gold snapshot, converted to INR per gram. */
export async function fetchLiveSnapshot(): Promise<GoldSnapshot> {
  const [gold, fx] = await Promise.all([
    fetchJson<GoldApiResponse>(GOLD_SPOT_URL),
    fetchJson<FrankfurterResponse>(FX_URL),
  ]);

  const usdInr = fx.rates?.INR;
  if (!usdInr) throw new Error("USD→INR rate missing from FX response");

  return deriveSnapshot(gold.price, usdInr);
}

export function formatInr(value: number, opts: Intl.NumberFormatOptions = {}): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    ...opts,
  }).format(value);
}
