import type { Theme } from "../lib/theme";

interface Props {
  theme: Theme;
  onToggle: () => void;
}

/** Sun / moon pill switch — flips between light and dark palettes. */
export function ThemeToggle({ theme, onToggle }: Props) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        width: 56,
        height: 32,
        padding: 3,
        border: "1px solid var(--color-border-strong)",
        borderRadius: "var(--radius-pill)",
        background: "var(--color-bg-soft)",
        cursor: "pointer",
        transition: "background 0.2s ease, border-color 0.2s ease",
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 3,
          left: isDark ? 27 : 3,
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "var(--color-surface)",
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          transition: "left 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {isDark ? "🌙" : "☀️"}
      </span>
      {/* Spacer glyphs keep the pill's intrinsic width stable */}
      <span aria-hidden style={{ visibility: "hidden", fontSize: 13, marginLeft: 2 }}>
        ☀️
      </span>
      <span aria-hidden style={{ visibility: "hidden", fontSize: 13, marginLeft: "auto", marginRight: 2 }}>
        🌙
      </span>
    </button>
  );
}
