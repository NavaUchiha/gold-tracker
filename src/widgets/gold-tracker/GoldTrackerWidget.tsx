import { useMemo, useState } from "react";
import { formatInr, type Karat } from "../../lib/goldApi";
import { filterByWindow, WINDOWS, type WindowId } from "../../lib/history";
import { useGoldTracker } from "./useGoldTracker";
import { WindowSelector } from "./WindowSelector";
import { GoldChart } from "./GoldChart";

const KARATS: { id: Karat; label: string }[] = [
  { id: 22, label: "22 KT" },
  { id: 24, label: "24 KT" },
  { id: 18, label: "18 KT" },
];

function timeAgo(ts: number | null): string {
  if (!ts) return "—";
  const seconds = Math.max(1, Math.round((Date.now() - ts) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  return `${hours} hr ago`;
}

export function GoldTrackerWidget() {
  const { live, history, status, error, lastFetchedAt, refresh } = useGoldTracker();
  const [karat, setKarat] = useState<Karat>(22);
  const [windowId, setWindowId] = useState<WindowId>("1m");

  const windowed = useMemo(() => filterByWindow(history, windowId), [history, windowId]);

  const change = useMemo(() => {
    if (!live || windowed.length < 2) return null;
    const first = windowed[0].perGramInr[karat];
    const current = live.perGramInr[karat];
    const abs = current - first;
    const pct = (abs / first) * 100;
    return { abs, pct };
  }, [live, windowed, karat]);

  const activeWindowLabel = WINDOWS.find((w) => w.id === windowId)?.label ?? "";

  return (
    <div className="card fade-up" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <span className="eyebrow" style={{ background: "var(--color-gold-soft)", color: "var(--color-gold-strong)" }}>
            ● Gold · India
          </span>
          <h2 className="serif-display" style={{ margin: "14px 0 4px", fontSize: 24 }}>
            Gold price tracker
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: "var(--color-ink-soft)" }}>
            Per-gram retail-equivalent rate, derived live from the international spot price and the USD→INR rate.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12.5, color: "var(--color-ink-faint)" }}>
            {status === "loading" && !live ? "Fetching…" : `Updated ${timeAgo(lastFetchedAt)}`}
          </span>
          <button
            onClick={() => refresh()}
            aria-label="Refresh price"
            style={{
              border: "1px solid var(--color-border-strong)",
              background: "var(--color-surface)",
              borderRadius: "var(--radius-pill)",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 15,
            }}
            title="Refresh"
          >
            ↻
          </button>
        </div>
      </div>

      {error && !live && (
        <div
          role="alert"
          style={{
            background: "var(--color-negative-soft)",
            color: "var(--color-negative)",
            borderRadius: "var(--radius-md)",
            padding: "14px 18px",
            fontSize: 14,
          }}
        >
          Couldn't reach the price feed ({error}). It will retry automatically — or tap refresh.
        </div>
      )}

      {/* Karat tabs */}
      <div style={{ display: "flex", gap: 8 }}>
        {KARATS.map((k) => {
          const isActive = k.id === karat;
          return (
            <button
              key={k.id}
              onClick={() => setKarat(k.id)}
              style={{
                border: `1px solid ${isActive ? "var(--color-gold)" : "var(--color-border)"}`,
                background: isActive ? "var(--color-gold-soft)" : "var(--color-surface)",
                color: isActive ? "var(--color-gold-strong)" : "var(--color-ink-soft)",
                borderRadius: "var(--radius-pill)",
                padding: "8px 18px",
                fontSize: 13.5,
                fontWeight: 650,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {k.label}
            </button>
          );
        })}
      </div>

      {/* Big price */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 14 }}>
        <span className="serif-display" style={{ fontSize: "clamp(40px, 6vw, 60px)", lineHeight: 1, letterSpacing: "-0.02em" }}>
          {live ? formatInr(live.perGramInr[karat], { maximumFractionDigits: 0 }) : "₹ —"}
        </span>
        <span style={{ fontSize: 16, color: "var(--color-ink-faint)" }}>per gram · {karat}KT</span>
      </div>

      {change && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: -10 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13.5,
              fontWeight: 650,
              padding: "6px 12px",
              borderRadius: "var(--radius-pill)",
              color: change.abs >= 0 ? "var(--color-positive)" : "var(--color-negative)",
              background: change.abs >= 0 ? "var(--color-positive-soft)" : "var(--color-negative-soft)",
            }}
          >
            {change.abs >= 0 ? "▲" : "▼"} {formatInr(Math.abs(change.abs), { maximumFractionDigits: 0 })} ({Math.abs(change.pct).toFixed(2)}%)
          </span>
          <span style={{ fontSize: 13, color: "var(--color-ink-faint)" }}>over the {activeWindowLabel.toLowerCase()} window</span>
        </div>
      )}

      {/* Window selector + chart */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 650 }}>Trend</h3>
          <WindowSelector value={windowId} onChange={setWindowId} />
        </div>
        <GoldChart data={windowed} karat={karat} />
        <p style={{ margin: 0, fontSize: 12.5, color: "var(--color-ink-faint)", lineHeight: 1.6 }}>
          Pulse is a static page with no server, so it builds this trend itself — recording one
          snapshot per day directly in your browser. The longer you keep it open in your
          rotation, the further back the chart will reach.
        </p>
      </div>

      {/* Other karats at a glance */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
        {KARATS.map((k) => (
          <div
            key={k.id}
            style={{
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: "16px 18px",
              background: k.id === karat ? "var(--color-gold-soft)" : "var(--color-bg-soft)",
            }}
          >
            <div style={{ fontSize: 12.5, fontWeight: 650, color: "var(--color-ink-faint)", marginBottom: 6 }}>{k.label} / gram</div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em" }}>
              {live ? formatInr(live.perGramInr[k.id], { maximumFractionDigits: 0 }) : "—"}
            </div>
          </div>
        ))}
        <div
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "16px 18px",
            background: "var(--color-bg-soft)",
          }}
        >
          <div style={{ fontSize: 12.5, fontWeight: 650, color: "var(--color-ink-faint)", marginBottom: 6 }}>Spot · USD/oz</div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em" }}>
            {live ? `$${live.spotUsdPerOz.toLocaleString("en-US", { maximumFractionDigits: 2 })}` : "—"}
          </div>
          <div style={{ fontSize: 12, color: "var(--color-ink-faint)", marginTop: 4 }}>
            {live ? `1 USD ≈ ₹${live.usdInr.toFixed(2)}` : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
