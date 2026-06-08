/**
 * Widget registry.
 *
 * The landing page renders a gallery of widget cards; clicking one opens
 * it full-width. To add a future widget (silver, currency pairs, indices,
 * crypto, weather, whatever comes next):
 *
 *   1. Build it as a self-contained component under src/widgets/<name>/
 *   2. Import it below and add one entry to WIDGETS — that's the whole
 *      integration surface. Nothing else in the app needs to change.
 */

import type { ComponentType } from "react";
import { GoldTrackerWidget } from "./gold-tracker/GoldTrackerWidget";

export interface WidgetDef {
  id: string;
  title: string;
  /** Short line shown on the gallery card. */
  blurb: string;
  /** One or two letters / glyph shown on the card's icon tile. */
  glyph: string;
  /** Accent used for the icon tile + active states. */
  accent: "gold" | "accent";
  Component: ComponentType;
  /** Set false to show a "coming soon" placeholder card instead. */
  enabled?: boolean;
}

export const WIDGETS: WidgetDef[] = [
  {
    id: "gold-india",
    title: "Gold — India",
    blurb: "Live 22KT / 24KT / 18KT rates per gram, with trend windows from 7 days to a year.",
    glyph: "Au",
    accent: "gold",
    Component: GoldTrackerWidget,
    enabled: true,
  },
  {
    id: "silver-india",
    title: "Silver — India",
    blurb: "Per-gram silver rates with the same trend tooling. Coming soon.",
    glyph: "Ag",
    accent: "accent",
    Component: GoldTrackerWidget,
    enabled: false,
  },
  {
    id: "fx-usd-inr",
    title: "USD ⇄ INR",
    blurb: "Track the rupee against the dollar alongside your gold positions. Coming soon.",
    glyph: "₹$",
    accent: "accent",
    Component: GoldTrackerWidget,
    enabled: false,
  },
];

export function getWidget(id: string | null): WidgetDef | undefined {
  if (!id) return undefined;
  return WIDGETS.find((w) => w.id === id);
}
