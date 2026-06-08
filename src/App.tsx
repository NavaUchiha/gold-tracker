import { useEffect, useState } from "react";
import { SiteHeader } from "./components/SiteHeader";
import { WidgetCard } from "./components/WidgetCard";
import { WIDGETS, getWidget } from "./widgets/registry";
import { useTheme } from "./lib/theme";

const LAST_WIDGET_KEY = "pulse.lastWidget";

export default function App() {
  const [theme, toggleTheme] = useTheme();

  const [activeId, setActiveId] = useState<string>(() => {
    try {
      return localStorage.getItem(LAST_WIDGET_KEY) || WIDGETS[0].id;
    } catch {
      return WIDGETS[0].id;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LAST_WIDGET_KEY, activeId);
    } catch {
      /* ignore */
    }
  }, [activeId]);

  const active = getWidget(activeId) ?? WIDGETS[0];
  const ActiveComponent = active.Component;

  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <SiteHeader theme={theme} onToggleTheme={toggleTheme} />

      <main style={{ flex: 1 }}>
        <section className="container" style={{ paddingTop: 56, paddingBottom: 28 }}>
          <span className="eyebrow">Live · India</span>
          <h1
            className="serif-display fade-up"
            style={{ fontSize: "clamp(32px, 5vw, 48px)", margin: "18px 0 12px", lineHeight: 1.12, maxWidth: 720 }}
          >
            One calm dashboard for the numbers you check every day.
          </h1>
          <p style={{ fontSize: 16.5, color: "var(--color-ink-soft)", maxWidth: 580, lineHeight: 1.6, margin: 0 }}>
            Pick a widget below to bring it into focus. Pulse starts with gold rates for the
            Indian market — silver, currency pairs and more are on the way, each just a click apart.
          </p>
        </section>

        <section className="container" style={{ paddingBottom: 8 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {WIDGETS.map((w) => (
              <WidgetCard key={w.id} widget={w} active={w.id === activeId} onSelect={setActiveId} />
            ))}
          </div>
        </section>

        <section className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
          <ActiveComponent />
        </section>
      </main>

      <footer style={{ borderTop: "1px solid var(--color-border)" }}>
        <div
          className="container"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
            fontSize: 13,
            color: "var(--color-ink-faint)",
          }}
        >
          <span>Pulse — a static dashboard, hosted as a single page app.</span>
          <span>Spot price via gold-api.com · FX via frankfurter.app · Not financial advice.</span>
        </div>
      </footer>
    </div>
  );
}
