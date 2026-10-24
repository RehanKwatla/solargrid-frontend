import React, { useState } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Sun,
  Battery,
  TrendingDown,
  TrendingUp,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Info,
  Layers,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export interface ForecastScenario {
  id: string;
  name: string;
  label: string;
  description: string;
  dispatchAction: string;
  dispatchRationale: string;
  alternativeRejected: string;
  rejectionReason: string;
  metrics: {
    baselineGridPeak: number;
    optimizedGridPeak: number;
    solarUtilization: number;
    batteryReserveDusk: number;
    icuRiskLevel: "Zero" | "Elevated" | "Protected";
  };
  hourlyData: Array<{
    hour: string;
    solarForecast: number;
    demandForecast: number;
    batterySoc: number;
    baselineGrid: number;
    optimizedGrid: number;
  }>;
}

const FORECAST_SCENARIOS: ForecastScenario[] = [
  {
    id: "standard_solar_day",
    name: "Scenario A: Optimal Solar Day & Load Shift",
    label: "Optimal Solar & Load Shifting",
    description: "High irradiance profile expected between 10:00 and 15:00. Non-emergency sterilizer and EV fleet loads shifted into solar surplus window.",
    dispatchAction: "CHARGE_AND_PRECOOL",
    dispatchRationale: "Solar generation peaks at 182 kW, exceeding baseline hospital load (118 kW). EMS charges BESS to 92% and commands Tier 02 chillers to pre-cool thermal storage tanks, avoiding 18:00 evening peak demand charges.",
    alternativeRejected: "Alternative: Export Surplus to Discom Grid",
    rejectionReason: "Local feed-in tariff is ₹3.20/kWh while evening import tariff is ₹8.50/kWh. Self-consumption via battery storage yields a 2.6x economic advantage over immediate export while buffering ICU life support.",
    metrics: {
      baselineGridPeak: 142,
      optimizedGridPeak: 48,
      solarUtilization: 98,
      batteryReserveDusk: 88,
      icuRiskLevel: "Protected",
    },
    hourlyData: [
      { hour: "00:00", solarForecast: 0, demandForecast: 78, batterySoc: 48, baselineGrid: 78, optimizedGrid: 42 },
      { hour: "03:00", solarForecast: 0, demandForecast: 72, batterySoc: 40, baselineGrid: 72, optimizedGrid: 38 },
      { hour: "06:00", solarForecast: 15, demandForecast: 84, batterySoc: 36, baselineGrid: 72, optimizedGrid: 35 },
      { hour: "09:00", solarForecast: 95, demandForecast: 110, batterySoc: 45, baselineGrid: 65, optimizedGrid: 15 },
      { hour: "12:00", solarForecast: 182, demandForecast: 135, batterySoc: 82, baselineGrid: 45, optimizedGrid: 0 },
      { hour: "15:00", solarForecast: 140, demandForecast: 125, batterySoc: 92, baselineGrid: 60, optimizedGrid: 0 },
      { hour: "18:00", solarForecast: 12, demandForecast: 142, batterySoc: 74, baselineGrid: 142, optimizedGrid: 48 },
      { hour: "21:00", solarForecast: 0, demandForecast: 96, batterySoc: 55, baselineGrid: 96, optimizedGrid: 40 },
    ],
  },
  {
    id: "monsoon_cloud_cover",
    name: "Scenario B: Monsoon Cloud Transient",
    label: "Monsoon Cloud Transient (Solar Drop)",
    description: "Atmospheric tracking forecasts dense monsoon cloud cover passing between 11:30 and 14:00, causing a sudden 70% collapse in PV output.",
    dispatchAction: "PRESERVE_35_PCT_RESERVE_THROTTLE_T3",
    dispatchRationale: "PV collapses from 160 kW to 42 kW. Rather than cycling battery below hospital disaster threshold, EMS throttles Tier 03 non-clinical amenities and maintains battery discharge strictly capped at 45 kW.",
    alternativeRejected: "Alternative: Full Deep Battery Discharge",
    rejectionReason: "Allowing battery state-of-charge to drop below 35% would violate hospital accreditation standards (NABH/JCI) requiring a minimum 3.5 hours of dedicated ICU/OT autonomous reserve.",
    metrics: {
      baselineGridPeak: 155,
      optimizedGridPeak: 82,
      solarUtilization: 100,
      batteryReserveDusk: 58,
      icuRiskLevel: "Protected",
    },
    hourlyData: [
      { hour: "00:00", solarForecast: 0, demandForecast: 80, batterySoc: 52, baselineGrid: 80, optimizedGrid: 45 },
      { hour: "03:00", solarForecast: 0, demandForecast: 75, batterySoc: 46, baselineGrid: 75, optimizedGrid: 40 },
      { hour: "06:00", solarForecast: 10, demandForecast: 88, batterySoc: 42, baselineGrid: 80, optimizedGrid: 42 },
      { hour: "09:00", solarForecast: 75, demandForecast: 115, batterySoc: 50, baselineGrid: 75, optimizedGrid: 40 },
      { hour: "12:00", solarForecast: 42, demandForecast: 130, batterySoc: 52, baselineGrid: 110, optimizedGrid: 65 },
      { hour: "15:00", solarForecast: 68, demandForecast: 120, batterySoc: 55, baselineGrid: 90, optimizedGrid: 52 },
      { hour: "18:00", solarForecast: 5, demandForecast: 138, batterySoc: 45, baselineGrid: 138, optimizedGrid: 75 },
      { hour: "21:00", solarForecast: 0, demandForecast: 90, batterySoc: 38, baselineGrid: 90, optimizedGrid: 50 },
    ],
  },
  {
    id: "grid_blackout_islanding",
    name: "Scenario C: Sudden Grid Blackout & Islanding",
    label: "Grid Outage / Microgrid Islanding",
    description: "Simulates utility feeder trip. Hospital transitions seamlessly into islanded microgrid mode with Tier 01 life support circuits prioritized.",
    dispatchAction: "ISLAND_MICROGRID_LOCK_T1",
    dispatchRationale: "Utility feeder voltage drops to zero. High-speed static switch opens in 12ms. Solar inverter throttles to match immediate hospital demand without back-feeding, while BESS forms the 50Hz microgrid voltage reference.",
    alternativeRejected: "Alternative: Instant Diesel Generator Startup",
    rejectionReason: "Instant DG start consumes high-carbon fuel and takes 15 seconds to sync. SolarGrid's grid-forming inverter provides zero-interruption ride-through, deferring DG start unless battery drops to 20%.",
    metrics: {
      baselineGridPeak: 0,
      optimizedGridPeak: 0,
      solarUtilization: 86,
      batteryReserveDusk: 42,
      icuRiskLevel: "Protected",
    },
    hourlyData: [
      { hour: "00:00", solarForecast: 0, demandForecast: 76, batterySoc: 68, baselineGrid: 76, optimizedGrid: 0 },
      { hour: "03:00", solarForecast: 0, demandForecast: 70, batterySoc: 58, baselineGrid: 70, optimizedGrid: 0 },
      { hour: "06:00", solarForecast: 12, demandForecast: 80, batterySoc: 50, baselineGrid: 80, optimizedGrid: 0 },
      { hour: "09:00", solarForecast: 90, demandForecast: 105, batterySoc: 55, baselineGrid: 55, optimizedGrid: 0 },
      { hour: "12:00", solarForecast: 175, demandForecast: 120, batterySoc: 85, baselineGrid: 0, optimizedGrid: 0 },
      { hour: "15:00", solarForecast: 130, demandForecast: 110, batterySoc: 88, baselineGrid: 0, optimizedGrid: 0 },
      { hour: "18:00", solarForecast: 8, demandForecast: 125, batterySoc: 68, baselineGrid: 125, optimizedGrid: 0 },
      { hour: "21:00", solarForecast: 0, demandForecast: 85, batterySoc: 48, baselineGrid: 85, optimizedGrid: 0 },
    ],
  },
];

export function ForecastingOptimizationEngine() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("standard_solar_day");
  const [activeTab, setActiveTab] = useState<"forecast" | "comparison" | "constraints">("forecast");

  const scenario =
    FORECAST_SCENARIOS.find((s) => s.id === selectedScenarioId) || FORECAST_SCENARIOS[0];

  // Palette constants
  const colorSolar = isDark ? "#829770" : "#58694B";
  const colorDemand = isDark ? "#B5543A" : "#9C4229";
  const colorBattery = isDark ? "#C87D55" : "#A64D32";
  const colorBaseline = isDark ? "#6B7280" : "#9CA3AF";
  const colorOptimized = isDark ? "#22C55E" : "#16A34A";
  const gridColor = isDark ? "#2A2A26" : "#E5DEC9";
  const textColor = isDark ? "#95A38C" : "#5A6554";

  return (
    <div className="space-y-6">
      {/* Simulation Scenario Switcher Header */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="pill pill-warning !text-[9px] !py-0.5 uppercase tracking-wider font-mono">
                Indradhanu Demonstration Engine
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-text-tertiary">
                <CheckCircle2 className="w-3 h-3 text-[var(--healthy)]" /> Deterministic Physics Engine
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              Predictive Dispatch & Constraint Solver
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Evaluate real-time dispatch decisions against hospital constraints (NABH Tier 01 reserve lock & peak tariff avoidance).
            </p>
          </div>

          {/* Scenario Buttons */}
          <div className="flex flex-wrap gap-1.5 bg-surface-soft p-1 rounded-lg border border-border">
            {FORECAST_SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedScenarioId(s.id)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-all text-left",
                  selectedScenarioId === s.id
                    ? "bg-card text-foreground shadow-sm font-semibold border border-border"
                    : "text-text-secondary hover:text-foreground"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Explainability Banner: What is happening & Why decision is better */}
        <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/25 p-3.5">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0" />
              <span className="font-mono text-[10px] font-bold text-[var(--accent)] uppercase tracking-wide">
                Optimal Decision: {scenario.dispatchAction}
              </span>
            </div>
            <p className="text-xs text-foreground leading-relaxed mt-1">
              {scenario.dispatchRationale}
            </p>
          </div>

          <div className="rounded-lg bg-surface-soft/80 border border-border p-3.5">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-warning shrink-0" />
              <span className="font-mono text-[10px] font-bold text-text-secondary uppercase tracking-wide">
                {scenario.alternativeRejected}
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed mt-1">
              {scenario.rejectionReason}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs: Multi-curve Forecast vs Baseline Comparison vs Constraints */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("forecast")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5",
              activeTab === "forecast"
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-text-secondary hover:text-foreground hover:bg-surface-soft"
            )}
          >
            <Sun className="w-3.5 h-3.5" /> 24h Solar & Demand Forecast
          </button>
          <button
            onClick={() => setActiveTab("comparison")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5",
              activeTab === "comparison"
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-text-secondary hover:text-foreground hover:bg-surface-soft"
            )}
          >
            <TrendingDown className="w-3.5 h-3.5" /> Baseline vs SolarGrid Dispatch
          </button>
          <button
            onClick={() => setActiveTab("constraints")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5",
              activeTab === "constraints"
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-text-secondary hover:text-foreground hover:bg-surface-soft"
            )}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Hospital Constraints Ledger
          </button>
        </div>

        <span className="hidden sm:inline-flex font-mono text-[11px] text-text-tertiary">
          Sample Horizon: 24h · 3h Intervals
        </span>
      </div>

      {/* Tab 1: 24h Solar & Demand Forecast Curve */}
      {activeTab === "forecast" && (
        <div className="card p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Solar Generation vs Hospital Demand Projection
              </h3>
              <p className="text-xs text-text-secondary">
                Forecasted generation (kW) alongside expected hospital electricity demand and simulated battery state of charge (%).
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-text-secondary">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorSolar }} /> Solar (kW)
              </span>
              <span className="flex items-center gap-1 text-text-secondary">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorDemand }} /> Demand (kW)
              </span>
              <span className="flex items-center gap-1 text-text-secondary">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorBattery }} /> Battery SOC (%)
              </span>
            </div>
          </div>

          <div className="h-72 w-full min-w-0 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scenario.hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colorSolar} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={colorSolar} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colorDemand} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={colorDemand} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="hour" tick={{ fill: textColor, fontSize: 11, fontFamily: "monospace" }} />
                <YAxis tick={{ fill: textColor, fontSize: 11, fontFamily: "monospace" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#1C1C19" : "#FAF7F0",
                    borderColor: gridColor,
                    borderRadius: "8px",
                    fontFamily: "monospace",
                    fontSize: "11px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="solarForecast"
                  name="Solar Forecast (kW)"
                  stroke={colorSolar}
                  strokeWidth={2}
                  fill="url(#solarGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="demandForecast"
                  name="Hospital Demand (kW)"
                  stroke={colorDemand}
                  strokeWidth={2}
                  fill="url(#demandGrad)"
                />
                <Line
                  type="monotone"
                  dataKey="batterySoc"
                  name="Battery SOC (%)"
                  stroke={colorBattery}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: colorBattery }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border">
            <div className="p-3 rounded-lg bg-surface-soft border border-border">
              <span className="font-mono text-[10px] text-text-tertiary uppercase">Solar Utilization</span>
              <p className="text-lg font-bold text-foreground mt-0.5">{scenario.metrics.solarUtilization}%</p>
            </div>
            <div className="p-3 rounded-lg bg-surface-soft border border-border">
              <span className="font-mono text-[10px] text-text-tertiary uppercase">Optimized Peak Grid</span>
              <p className="text-lg font-bold text-[var(--accent)] mt-0.5">{scenario.metrics.optimizedGridPeak} kW</p>
            </div>
            <div className="p-3 rounded-lg bg-surface-soft border border-border">
              <span className="font-mono text-[10px] text-text-tertiary uppercase">Battery Reserve at Dusk</span>
              <p className="text-lg font-bold text-[var(--healthy)] mt-0.5">{scenario.metrics.batteryReserveDusk}%</p>
            </div>
            <div className="p-3 rounded-lg bg-surface-soft border border-border">
              <span className="font-mono text-[10px] text-text-tertiary uppercase">Life Support Risk</span>
              <p className="text-lg font-bold text-[var(--healthy)] mt-0.5">{scenario.metrics.icuRiskLevel}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Baseline vs SolarGrid Dispatch Comparison */}
      {activeTab === "comparison" && (
        <div className="card p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Unmanaged Baseline vs SolarGrid Optimized Grid Import
              </h3>
              <p className="text-xs text-text-secondary">
                Demonstrates how predictive peak-shaving and battery dispatch prevents high tariff grid draws.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-text-secondary">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorBaseline }} /> Unmanaged Baseline (kW)
              </span>
              <span className="flex items-center gap-1 text-text-secondary">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorOptimized }} /> SolarGrid EMS (kW)
              </span>
            </div>
          </div>

          <div className="h-72 w-full min-w-0 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scenario.hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="optGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colorOptimized} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={colorOptimized} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="hour" tick={{ fill: textColor, fontSize: 11, fontFamily: "monospace" }} />
                <YAxis tick={{ fill: textColor, fontSize: 11, fontFamily: "monospace" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#1C1C19" : "#FAF7F0",
                    borderColor: gridColor,
                    borderRadius: "8px",
                    fontFamily: "monospace",
                    fontSize: "11px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="baselineGrid"
                  name="Unmanaged Baseline Grid (kW)"
                  stroke={colorBaseline}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fill="transparent"
                />
                <Area
                  type="monotone"
                  dataKey="optimizedGrid"
                  name="SolarGrid Optimized Grid (kW)"
                  stroke={colorOptimized}
                  strokeWidth={2.5}
                  fill="url(#optGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Comparison Ledger */}
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-soft border-b border-border font-mono text-[10px] text-text-tertiary uppercase">
                <tr>
                  <th className="p-2.5">Metric Dimension</th>
                  <th className="p-2.5">Standard Unmanaged Setup</th>
                  <th className="p-2.5 font-bold text-[var(--accent)]">SolarGrid EMS Optimization</th>
                  <th className="p-2.5">Impact Benefit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-2.5 font-semibold text-foreground">Peak Grid Draw (kW)</td>
                  <td className="p-2.5 text-text-secondary">{scenario.metrics.baselineGridPeak} kW (18:00 Peak)</td>
                  <td className="p-2.5 font-bold text-[var(--accent)]">{scenario.metrics.optimizedGridPeak} kW (Smoothed)</td>
                  <td className="p-2.5 text-[var(--healthy)] font-medium">-{scenario.metrics.baselineGridPeak - scenario.metrics.optimizedGridPeak} kW Peak Shaved</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-foreground">ICU Life-Support Buffer</td>
                  <td className="p-2.5 text-text-secondary">Depleted by 19:30 (No floor)</td>
                  <td className="p-2.5 font-bold text-[var(--healthy)]">35% Minimum Floor Locked</td>
                  <td className="p-2.5 text-[var(--healthy)] font-medium">3.5 hrs guaranteed autonomy</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-foreground">Solar Self-Consumption</td>
                  <td className="p-2.5 text-text-secondary">72% (Spillover curtailment)</td>
                  <td className="p-2.5 font-bold text-[var(--healthy)]">{scenario.metrics.solarUtilization}% (Thermal Pre-cool)</td>
                  <td className="p-2.5 text-[var(--healthy)] font-medium">Zero curtailment loss</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-foreground">Battery Cycle Degradation</td>
                  <td className="p-2.5 text-text-secondary">2.2 cycles/day (Full swing)</td>
                  <td className="p-2.5 font-bold text-foreground">0.85 cycles/day (Managed DoD)</td>
                  <td className="p-2.5 text-text-secondary">Extended cell warranty life</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Hospital Constraints Ledger */}
      {activeTab === "constraints" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[var(--accent)]" />
              <h3 className="text-sm font-bold text-foreground">
                Tier 01 Life-Support Constraints
              </h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Medical accreditation mandates that emergency, ICU, and surgical suite power circuits must NEVER be shed or throttled by optimization algorithms under any commercial scenario.
            </p>
            <div className="space-y-2 pt-2 border-t border-border font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-text-secondary">Emergency Floor SOC:</span>
                <span className="font-bold text-[var(--accent)]">35% (105.0 kWh)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-text-secondary">Static Switch Transfer Time:</span>
                <span className="font-bold text-foreground">12 milliseconds</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-text-secondary">DG Sync Handshake Delay:</span>
                <span className="font-bold text-foreground">15 seconds buffer</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-secondary">Circuit Priority Lock:</span>
                <span className="font-bold text-[var(--healthy)]">Hardware Interlock Enabled</span>
              </div>
            </div>
          </div>

          <div className="card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-warning" />
              <h3 className="text-sm font-bold text-foreground">
                Flexible & Shiftable Loads (Tiers 02 & 03)
              </h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Non-critical equipment can be rescheduled to coincide with solar generation surpluses or curtailed when grid electricity reaches peak tariff bands.
            </p>
            <div className="space-y-2 pt-2 border-t border-border font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-text-secondary">Autoclaves & Sterilizers:</span>
                <span className="font-bold text-foreground">Shift to 11:00 - 14:00</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-text-secondary">HVAC Chiller Pre-Cooling:</span>
                <span className="font-bold text-foreground">12:30 Thermal Buffer</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-text-secondary">Laundry & Dishwashing:</span>
                <span className="font-bold text-foreground">Curtailed if Grid &gt; 80 kW</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-secondary">EV Fleet Chargers:</span>
                <span className="font-bold text-[var(--healthy)]">Solar Surplus Throttled</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
