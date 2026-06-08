import { useCallback, useEffect, useRef, useState } from "react";
import { fetchLiveSnapshot, type GoldSnapshot } from "../../lib/goldApi";
import { loadHistory, recordSnapshot } from "../../lib/history";

const REFRESH_MS = 5 * 60 * 1000; // poll every 5 minutes while the tab is open

interface State {
  live: GoldSnapshot | null;
  history: GoldSnapshot[];
  status: "loading" | "ready" | "error";
  error: string | null;
  lastFetchedAt: number | null;
}

export function useGoldTracker() {
  const [state, setState] = useState<State>(() => ({
    live: null,
    history: loadHistory(),
    status: "loading",
    error: null,
    lastFetchedAt: null,
  }));
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    try {
      const snap = await fetchLiveSnapshot();
      if (!mounted.current) return;
      const history = recordSnapshot(snap);
      setState({ live: snap, history, status: "ready", error: null, lastFetchedAt: Date.now() });
    } catch (err) {
      if (!mounted.current) return;
      setState((prev) => ({
        ...prev,
        status: prev.live ? "ready" : "error",
        error: err instanceof Error ? err.message : "Could not reach the price feed.",
      }));
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    refresh();
    const id = window.setInterval(refresh, REFRESH_MS);
    return () => {
      mounted.current = false;
      window.clearInterval(id);
    };
  }, [refresh]);

  return { ...state, refresh };
}
