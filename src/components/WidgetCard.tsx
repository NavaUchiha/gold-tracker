import type { WidgetDef } from "../widgets/registry";

interface Props {
  widget: WidgetDef;
  active: boolean;
  onSelect: (id: string) => void;
}

export function WidgetCard({ widget, active, onSelect }: Props) {
  const disabled = widget.enabled === false;
  const accentVar = widget.accent === "gold" ? "var(--color-gold)" : "var(--color-accent)";
  const accentSoftVar = widget.accent === "gold" ? "var(--color-gold-soft)" : "var(--color-accent-soft)";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(widget.id)}
      className="card fade-up"
      style={{
        textAlign: "left",
        padding: "22px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        cursor: disabled ? "default" : "pointer",
        borderColor: active ? accentVar : "var(--color-border)",
        boxShadow: active ? "var(--shadow-md)" : "var(--shadow-sm)",
        opacity: disabled ? 0.55 : 1,
        transform: active ? "translateY(-2px)" : "none",
        transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          aria-hidden
          style={{
            width: 44,
            height: 44,
            borderRadius: "var(--radius-md)",
            background: accentSoftVar,
            color: widget.accent === "gold" ? "var(--color-gold-strong)" : "var(--color-accent-ink)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: "-0.02em",
          }}
        >
          {widget.glyph}
        </div>
        {disabled ? (
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "var(--color-ink-faint)",
              background: "var(--color-bg-soft)",
              borderRadius: "var(--radius-pill)",
              padding: "5px 11px",
            }}
          >
            Coming soon
          </span>
        ) : (
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: active ? "var(--color-accent-ink)" : "var(--color-ink-faint)",
            }}
          >
            {active ? "Viewing" : "Select →"}
          </span>
        )}
      </div>
      <div>
        <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 650, letterSpacing: "-0.01em" }}>
          {widget.title}
        </h3>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "var(--color-ink-soft)" }}>
          {widget.blurb}
        </p>
      </div>
    </button>
  );
}
