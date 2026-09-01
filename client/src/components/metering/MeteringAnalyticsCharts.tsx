import { useState, useMemo } from "react";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, TrendingUp, Zap } from "lucide-react";

export function MeteringAnalyticsCharts() {
  const { theme } = useTheme();
  const { energyHistory } = useDashboardData();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState<"balance" | "grid_shared" | "revenue">("balance");

  // Revenue settlement progression data dynamically derived from live energyHistory
  const settlementHistory = useMemo(() => {
    return energyHistory.map((point, index) => {
      const cumulativeRevenue = Math.round(point.solar * 6.8 * (index + 1) * 0.4);
      const avoidedCost = Math.round(point.demand * 7.5 * (index + 1) * 0.5);
      const sharedKwh = Math.round(Math.max(0, point.solar - point.demand) * 1.5);

      return {
        time: point.time,
        solar: point.solar,
        demand: point.demand,
        grid: point.grid,
        battery: point.battery,
        shared: sharedKwh,
        revenue: cumulativeRevenue,
        avoidedCost: avoidedCost,
      };
    });
  }, [energyHistory]);

  const gridColor = isDark ? "#2a3226" : "#d4d9ca";
  const textColor = isDark ? "#95a38c" : "#5a6554";
  const solarColor = isDark ? "#B7E64A" : "#4d7a1e";
  const demandColor = isDark ? "#e4b259" : "#8a5a0e";
  const gridLineColor = isDark ? "#3a4534" : "#aab3a2";
  const revenueColor = isDark ? "#B7E64A" : "#2f6b15";
  const avoidedColor = isDark ? "#60a5fa" : "#2563eb";

  return (
    <div className="w-full min-w-0 border border-border bg-surface rounded-lg p-4 sm:p-6 space-y-4">
      {/* Header and Chart Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-text-secondary">
            <BarChart3 size={17} />
          </div>
          <div>
            <span className="font-mono text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-text-tertiary">
              Analytical Visualizations
            </span>
            <h3 className="font-sans text-base sm:text-lg font-bold text-foreground leading-tight">
              Energy Generation, Grid Interaction & Settlement Trends
            </h3>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-soft rounded-lg border border-border">
          <button
            type="button"
            onClick={() => setActiveTab("balance")}
            className={cn(
              "px-3 py-1 text-xs font-mono rounded-md transition-all",
              activeTab === "balance"
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "text-text-secondary hover:text-foreground"
            )}
          >
            Generation vs Demand
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("grid_shared")}
            className={cn(
              "px-3 py-1 text-xs font-mono rounded-md transition-all",
              activeTab === "grid_shared"
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "text-text-secondary hover:text-foreground"
            )}
          >
            Grid & Microgrid Shared
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("revenue")}
            className={cn(
              "px-3 py-1 text-xs font-mono rounded-md transition-all",
              activeTab === "revenue"
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "text-text-secondary hover:text-foreground"
            )}
          >
            Settlement & Revenue Trend
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === "balance" ? (
            <AreaChart data={settlementHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="solarFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={solarColor} stopOpacity={isDark ? 0.25 : 0.18} />
                  <stop offset="100%" stopColor={solarColor} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="demandFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={demandColor} stopOpacity={isDark ? 0.25 : 0.15} />
                  <stop offset="100%" stopColor={demandColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={gridColor} strokeOpacity={0.5} strokeDasharray="4 4" />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: textColor, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }}
                tickMargin={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: textColor, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }}
                unit=" kW"
              />
              <Tooltip
                cursor={{ stroke: solarColor, strokeWidth: 1, strokeDasharray: "4 4" }}
                contentStyle={{
                  background: isDark ? "#191e16" : "#ffffff",
                  border: `1px solid ${gridColor}`,
                  borderRadius: "8px",
                  boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.5)" : "0 4px 16px rgba(0,0,0,0.06)",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "12px",
                  fontWeight: 500,
                  padding: "8px 12px",
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 500, color: textColor, paddingTop: 10 }}
              />
              <Area
                type="monotone"
                dataKey="solar"
                name="Solar Generation (kW)"
                stroke={solarColor}
                strokeWidth={2}
                fill="url(#solarFill)"
              />
              <Area
                type="monotone"
                dataKey="demand"
                name="Hospital Demand (kW)"
                stroke={demandColor}
                strokeWidth={2}
                fill="url(#demandFill)"
              />
            </AreaChart>
          ) : activeTab === "grid_shared" ? (
            <AreaChart data={settlementHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="sharedFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={solarColor} stopOpacity={isDark ? 0.25 : 0.18} />
                  <stop offset="100%" stopColor={solarColor} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gridFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={gridLineColor} stopOpacity={isDark ? 0.2 : 0.1} />
                  <stop offset="100%" stopColor={gridLineColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={gridColor} strokeOpacity={0.5} strokeDasharray="4 4" />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: textColor, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }}
                tickMargin={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: textColor, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }}
                unit=" kW"
              />
              <Tooltip
                cursor={{ stroke: solarColor, strokeWidth: 1, strokeDasharray: "4 4" }}
                contentStyle={{
                  background: isDark ? "#191e16" : "#ffffff",
                  border: `1px solid ${gridColor}`,
                  borderRadius: "8px",
                  boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.5)" : "0 4px 16px rgba(0,0,0,0.06)",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "12px",
                  fontWeight: 500,
                  padding: "8px 12px",
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 500, color: textColor, paddingTop: 10 }}
              />
              <Area
                type="monotone"
                dataKey="shared"
                name="Microgrid Energy Shared (kWh)"
                stroke={solarColor}
                strokeWidth={2}
                fill="url(#sharedFill)"
              />
              <Area
                type="monotone"
                dataKey="grid"
                name="Grid Import Power (kW)"
                stroke={gridLineColor}
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="url(#gridFill)"
              />
            </AreaChart>
          ) : (
            <AreaChart data={settlementHistory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={revenueColor} stopOpacity={isDark ? 0.25 : 0.18} />
                  <stop offset="100%" stopColor={revenueColor} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="avoidedFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={avoidedColor} stopOpacity={isDark ? 0.25 : 0.15} />
                  <stop offset="100%" stopColor={avoidedColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={gridColor} strokeOpacity={0.5} strokeDasharray="4 4" />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: textColor, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }}
                tickMargin={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: textColor, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }}
                unit=" ₹"
              />
              <Tooltip
                cursor={{ stroke: revenueColor, strokeWidth: 1, strokeDasharray: "4 4" }}
                contentStyle={{
                  background: isDark ? "#191e16" : "#ffffff",
                  border: `1px solid ${gridColor}`,
                  borderRadius: "8px",
                  boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.5)" : "0 4px 16px rgba(0,0,0,0.06)",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "12px",
                  fontWeight: 500,
                  padding: "8px 12px",
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 500, color: textColor, paddingTop: 10 }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Settlement Realized (₹)"
                stroke={revenueColor}
                strokeWidth={2}
                fill="url(#revenueFill)"
              />
              <Area
                type="monotone"
                dataKey="avoidedCost"
                name="Avoided Utility Cost (₹)"
                stroke={avoidedColor}
                strokeWidth={2}
                fill="url(#avoidedFill)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
