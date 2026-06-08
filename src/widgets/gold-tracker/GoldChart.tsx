import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { GoldSnapshot, Karat } from "../../lib/goldApi";
import { formatInr } from "../../lib/goldApi";

interface Props {
  data: GoldSnapshot[];
  karat: Karat;
}

function formatTick(at: number) {
  return new Date(at).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function GoldChart({ data, karat }: Props) {
  if (data.length < 2) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 280,
          borderRadius: "var(--radius-md)",
          border: "1px dashed var(--color-border-strong)",
          color: "var(--color-ink-faint)",
          fontSize: 14,
          textAlign: "center",
          padding: 24,
          lineHeight: 1.6,
        }}
      >
        Not enough history yet for this window.
        <br />
        Pulse records one snapshot per visit-day — keep this tab in your
        rotation and the trend line fills in over the coming days.
      </div>
    );
  }

  const chartData = data.map((d) => ({ ...d, value: d.perGramInr[karat] }));

  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <AreaChart data={chartData} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-gold)" stopOpacity={0.32} />
              <stop offset="100%" stopColor="var(--color-gold)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="at"
            tickFormatter={formatTick}
            tick={{ fontSize: 12, fill: "var(--color-ink-faint)" }}
            axisLine={{ stroke: "var(--color-border)" }}
            tickLine={false}
            minTickGap={32}
          />
          <YAxis
            dataKey="value"
            domain={["auto", "auto"]}
            tickFormatter={(v) => `₹${Math.round(v).toLocaleString("en-IN")}`}
            tick={{ fontSize: 12, fill: "var(--color-ink-faint)" }}
            axisLine={false}
            tickLine={false}
            width={64}
          />
          <Tooltip
            content={({ active, payload }) =>
              active && payload?.length ? (
                <div
                  style={{
                    background: "var(--color-ink)",
                    color: "var(--color-surface)",
                    borderRadius: "var(--radius-sm)",
                    padding: "10px 14px",
                    fontSize: 13,
                    boxShadow: "var(--shadow-md)",
                  }}
                >
                  <div style={{ opacity: 0.7, marginBottom: 4 }}>
                    {new Date((payload[0].payload as GoldSnapshot).at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>
                    {formatInr((payload[0].payload as any).value)}{" "}
                    <span style={{ opacity: 0.6, fontWeight: 500 }}>/ gram</span>
                  </div>
                </div>
              ) : null
            }
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--color-gold-strong)"
            strokeWidth={2.25}
            fill="url(#goldFill)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: "var(--color-gold-strong)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
