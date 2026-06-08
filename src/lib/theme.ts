/**
 * Light/dark theme controller.
 *
 * The whole app is themed through CSS custom properties (see
 * src/styles/theme.css): `:root` holds the light palette, and
 * `[data-theme="dark"]` overrides the same variable names. This hook
 * just decides which one is active and writes `data-theme` onto
 * <html> — every component that already reads `var(--color-*)` follows
 * along for free.
 *
 * Preference order on first load: a saved choice in localStorage, then
 * the OS-level `prefers-color-scheme`, then light as the final fallback.
 * The choice is persisted, and the toggle in the header flips it.
 */

import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "pulse.theme";

function systemPrefersDark(): boolean {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;
}

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    /* localStorage unavailable — fall through to system preference */
  }
  return systemPrefersDark() ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Apply on mount and whenever it changes.
  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore — theme just won't persist between visits */
    }
  }, [theme]);

  // If the visitor never explicitly chose, keep following the OS setting.
  useEffect(() => {
    let hasSavedChoice = false;
    try {
      hasSavedChoice = localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
      /* ignore */
    }
    if (hasSavedChoice) return;

    const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mql) return;
    const onChange = (e: MediaQueryListEvent) => setTheme(e.matches ? "dark" : "light");
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return [theme, toggle];
}
