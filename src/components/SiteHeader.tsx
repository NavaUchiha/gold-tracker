export function SiteHeader() {
  return (
    <header style={{ borderBottom: "1px solid var(--color-border)", background: "rgba(247, 245, 242, 0.72)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 20 }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            aria-hidden
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "linear-gradient(135deg, var(--color-accent), var(--color-gold))",
              display: "inline-block",
            }}
          />
          <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em" }}>Pulse</span>
          <span
            style={{
              marginLeft: 4,
              fontSize: 12,
              fontWeight: 600,
              color: "var(--color-ink-faint)",
              border: "1px solid var(--color-border-strong)",
              borderRadius: "var(--radius-pill)",
              padding: "3px 10px",
            }}
          >
            Markets, at a glance
          </span>
        </div>
        <nav style={{ display: "flex", alignItems: "center", gap: 22, fontSize: 14.5, color: "var(--color-ink-soft)" }}>
          <span>Widgets</span>
          <span>About</span>
          <a
            href="https://github.com/"
            style={{
              textDecoration: "none",
              fontWeight: 600,
              color: "var(--color-ink)",
              border: "1px solid var(--color-border-strong)",
              borderRadius: "var(--radius-pill)",
              padding: "9px 18px",
              background: "var(--color-surface)",
            }}
          >
            View source
          </a>
        </nav>
      </div>
    </header>
  );
}
