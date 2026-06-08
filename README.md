# Pulse — Gold Price Tracker (India)

A small, fast, **static** single-page app: a "Pulse" dashboard that starts with a
live gold-rate widget for India (22KT / 24KT / 18KT, per gram, in INR) and is
built so you can drop in more widgets later (silver, USD↔INR, indices…) without
restructuring anything.

No backend, no database, no API keys — it's designed to be built once and
served as plain static files from GitHub Pages, raw.githack.com, Netlify,
Cloudflare Pages, or literally any static file host.

## Stack

- React 18 + TypeScript
- Vite (build tool / dev server)
- Recharts (trend chart)
- Plain CSS with design tokens (no Tailwind/build-step CSS framework — keeps the
  bundle small and the theme easy to retint)

## Design

The look takes its cues from [wisprflow.ai](https://wisprflow.ai): a warm
off-white canvas, an indigo "flow blue" accent, soft rounded cards with subtle
shadows, generous whitespace, Inter for UI text and a serif (Newsreader) for
display headlines. Tokens live in `src/styles/theme.css` — change the
`--color-accent`, `--color-gold`, etc. CSS variables there to retheme everything
at once.

## How the data works (important — read this before you ship it)

This is a **static** app, so every number is computed in the visitor's browser
from two free, key-less, CORS-enabled public endpoints:

1. `https://api.gold-api.com/price/XAU` — live spot price of gold, USD per troy ounce
2. `https://api.frankfurter.app/latest?from=USD&to=INR` — live USD→INR rate

From the spot price we derive INR-per-gram for 24K (fine gold) and scale by
purity (22K = ×22⁄24, 18K = ×18⁄24) to match how Indian jewellers quote rates.
This will track the international market closely but **will not exactly match**
a specific jeweller's counter price, which also bakes in making charges, local
premiums and GST. Treat it as a live reference rate, not a transaction price.

**Historical trend** — free historical gold-in-INR data without an API key is
hard to come by, so rather than fabricate numbers, Pulse **builds its own
history client-side**: each time the page loads, it records one snapshot per
calendar day into the visitor's `localStorage` (see `src/lib/history.ts`). Day
one shows just a live price; a week in, the 7-day window has real data; a year
in, so does the 1-year window. The 7D / 1M / 3M / 6M / 1Y selector simply
filters whatever has accumulated so far.

> If you'd rather show a populated chart from day one, swap in a paid
> historical-data provider (MetalpriceAPI, GoldAPI.io, Metals-API all support
> INR) inside `src/lib/goldApi.ts` and seed `src/lib/history.ts` from its
> response on first load.

## Project layout

```
src/
  lib/
    goldApi.ts        live price fetch + USD→INR conversion + karat math
    history.ts        localStorage-backed daily snapshot history + window filter
  widgets/
    registry.ts       <- add future widgets here (one entry each)
    gold-tracker/
      GoldTrackerWidget.tsx   widget shell: price, karat tabs, change badge
      useGoldTracker.ts       data hook (fetch, poll, persist)
      WindowSelector.tsx      7D / 1M / 3M / 6M / 1Y pill selector
      GoldChart.tsx           recharts area chart
  components/
    SiteHeader.tsx
    WidgetCard.tsx    gallery card shown on the landing page
  App.tsx             landing page: widget gallery + active widget
  styles/theme.css    design tokens (colors, type, radii, shadows)
```

## Adding your next widget

1. Create `src/widgets/<name>/<Name>Widget.tsx` as a self-contained component
   (own data hook, own UI — model it on `gold-tracker/`).
2. Import it in `src/widgets/registry.ts` and add one `WidgetDef` entry
   (`id`, `title`, `blurb`, `glyph`, `accent`, `Component`, `enabled: true`).

That's the entire integration surface — the gallery, routing-by-selection, and
"last viewed" persistence are all generic and need no changes.

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
```

## Build

```bash
npm run build     # outputs static files to dist/
npm run preview   # serve the production build locally to sanity-check it
```

## Deploy as a static site

The Vite config uses a **relative base path** (`base: "./"`), so the build in
`dist/` works from a sub-path on any static host without extra config.

### GitHub Pages (recommended — "raw github… public hosting")

1. Build: `npm run build`
2. Push the contents of `dist/` to a `gh-pages` branch (or the `/docs` folder
   of `main`, whichever your repo's Pages settings point at). A quick way:
   ```bash
   npm install -g gh-pages
   gh-pages -d dist
   ```
3. In the repo's **Settings → Pages**, point the source at that branch/folder.
4. Your app is live at `https://<username>.github.io/<repo>/`.

### raw.githack.com / similar "serve a repo file as a website" proxies

Push `dist/` to any branch and point the proxy at `dist/index.html`. Because
the base path is relative, it'll resolve assets correctly regardless of the
URL prefix the proxy adds.

### Netlify / Cloudflare Pages / Vercel (static mode)

Build command `npm run build`, publish directory `dist` — no other
configuration required.

## Notes & caveats

- **Rates, not receipts.** The displayed price is a derived reference rate, not
  a guaranteed transaction price — see "How the data works" above.
- **Polling, not push.** The widget refreshes every 5 minutes while the tab is
  open and on load. Static hosting can't push updates, so this is the practical
  ceiling for a zero-backend setup.
- **History lives in the browser.** Clearing site data resets the trend chart's
  accumulated history (the live price itself is unaffected — it's always
  fetched fresh).
