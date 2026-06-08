import { WINDOWS, type WindowId } from "../../lib/history";

interface Props {
  value: WindowId;
  onChange: (id: WindowId) => void;
}

export function WindowSelector({ value, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Trend window"
      className="scrollbar-hidden"
      style={{
        display: "inline-flex",
        gap: 4,
        padding: 4,
        background: "var(--color-bg-soft)",
        borderRadius: "var(--radius-pill)",
        overflowX: "auto",
      }}
    >
      {WINDOWS.map((w) => {
        const isActive = w.id === value;
        return (
          <button
            key={w.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(w.id)}
            style={{
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontSize: 13.5,
              fontWeight: 600,
              padding: "8px 16px",
              borderRadius: "var(--radius-pill)",
              color: isActive ? "var(--color-surface)" : "var(--color-ink-soft)",
              background: isActive ? "var(--color-ink)" : "transparent",
              transition: "background 0.15s ease, color 0.15s ease",
            }}
          >
            {w.label}
          </button>
        );
      })}
    </div>
  );
}
