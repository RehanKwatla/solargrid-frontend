import React, { useState } from "react";
import {
  ShieldAlert,
  Activity,
  Building2,
  Sliders,
  Sparkles,
  Zap,
  Battery,
  Sun,
  ArrowRight,
  Info,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getHospitalPrioritySummary, PRIORITY_POLICIES } from "@/data/hospitalData";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const DISPATCH_TIMELINE = [
  {
    time: "06:00",
    solarKw: 8.0,
    criticalP0: 18.0,
    essentialP1: 14.5,
    supportP2: 12.0,
    flexibleP3: 6.0,
    bessDischargeKw: 15.0,
    gridImportKw: 27.5,
  },
  {
    time: "09:00",
    solarKw: 68.0,
    criticalP0: 18.2,
    essentialP1: 15.0,
    supportP2: 13.5,
    flexibleP3: 8.5,
    bessDischargeKw: 0,
    gridImportKw: 0,
  },
  {
    time: "12:00",
    solarKw: 92.0,
    criticalP0: 18.0,
    essentialP1: 16.2,
    supportP2: 14.0,
    flexibleP3: 16.8, // Shifted flexible loads (CSSD, Autoclaves, HVAC precool)
    bessDischargeKw: -22.0, // Charging BESS with surplus
    gridImportKw: 0,
  },
  {
    time: "15:00",
    solarKw: 74.0,
    criticalP0: 18.5,
    essentialP1: 15.8,
    supportP2: 14.2,
    flexibleP3: 12.0,
    bessDischargeKw: 0,
    gridImportKw: 0,
  },
  {
    time: "18:00",
    solarKw: 18.0,
    criticalP0: 18.2,
    essentialP1: 15.0,
    supportP2: 13.0,
    flexibleP3: 4.5, // Automated shedding / reduction of flexible demand
    bessDischargeKw: 24.0,
    gridImportKw: 8.7,
  },
  {
    time: "21:00",
    solarKw: 0,
    criticalP0: 18.0,
    essentialP1: 14.2,
    supportP2: 11.5,
    flexibleP3: 2.5,
    bessDischargeKw: 20.0,
    gridImportKw: 26.2,
  },
];

export function PriorityDispatchOptimization() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const summary = getHospitalPrioritySummary();

  const [activeTab, setActiveTab] = useState<"dispatch" | "schedule">("dispatch");

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
              Hierarchical Priority Dispatch Engine
            </span>
            <span className="pill pill-healthy !text-[9px]">
              Constraint Solver Active
            </span>
          </div>
          <h2 className="font-sans text-lg sm:text-xl font-extrabold text-foreground">
            Priority-Aware Power Allocation & Clinical Reserve
          </h2>
          <p className="font-mono text-xs text-text-secondary mt-0.5">
            Allocates solar and battery power to P0 Life-Critical and P1 Essential loads first, then shifts P3 flexible demand to high-generation windows.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg border border-border bg-surface-soft font-mono text-xs font-bold text-primary">
            Objective: Zero P0 Interruption
          </span>
        </div>
      </div>

      {/* 6-Layer Priority Allocation Waterfall Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* Layer 1: Solar Power */}
        <div className="p-3.5 rounded-xl border border-border bg-surface shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-warning font-mono text-[10px] font-bold uppercase">
            <Sun size={13} />
            <span>1. Solar Generation</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-xl font-black text-foreground tabular-nums">
              84.6
            </span>
            <span className="font-mono text-xs text-text-secondary">kW</span>
          </div>
          <span className="block text-[10px] text-text-tertiary">
            Clean primary generation
          </span>
        </div>

        {/* Layer 2: P0 Critical Loads */}
        <div className="p-3.5 rounded-xl border border-danger/40 bg-danger/5 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-danger font-mono text-[10px] font-bold uppercase">
            <ShieldAlert size={13} />
            <span>2. P0 Life-Critical</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-xl font-black text-danger tabular-nums">
              {summary.p0.demandKw}
            </span>
            <span className="font-mono text-xs text-text-secondary">kW</span>
          </div>
          <span className="block text-[10px] text-danger font-semibold">
            100% Protected First
          </span>
        </div>

        {/* Layer 3: P1 Clinical Essential */}
        <div className="p-3.5 rounded-xl border border-warning/40 bg-warning/5 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-warning font-mono text-[10px] font-bold uppercase">
            <Activity size={13} />
            <span>3. P1 Essential</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-xl font-black text-foreground tabular-nums">
              {summary.p1.demandKw}
            </span>
            <span className="font-mono text-xs text-text-secondary">kW</span>
          </div>
          <span className="block text-[10px] text-text-secondary">
            Emergency & Diagnostics
          </span>
        </div>

        {/* Layer 4: P2 Support */}
        <div className="p-3.5 rounded-xl border border-primary/40 bg-primary/5 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-primary font-mono text-[10px] font-bold uppercase">
            <Building2 size={13} />
            <span>4. P2 Support</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-xl font-black text-foreground tabular-nums">
              {summary.p2.demandKw}
            </span>
            <span className="font-mono text-xs text-text-secondary">kW</span>
          </div>
          <span className="block text-[10px] text-text-secondary">
            Inpatient Wards & Labs
          </span>
        </div>

        {/* Layer 5: P3 Flexible */}
        <div className="p-3.5 rounded-xl border border-border bg-surface shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-text-tertiary font-mono text-[10px] font-bold uppercase">
            <Sliders size={13} />
            <span>5. P3 Flexible</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-xl font-black text-foreground tabular-nums">
              {summary.p3.demandKw}
            </span>
            <span className="font-mono text-xs text-text-secondary">kW</span>
          </div>
          <span className="block text-[10px] text-healthy font-semibold">
            Solar Peak Shifted
          </span>
        </div>

        {/* Layer 6: Battery & Grid Balance */}
        <div className="p-3.5 rounded-xl border border-border bg-surface shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-healthy font-mono text-[10px] font-bold uppercase">
            <Battery size={13} />
            <span>6. BESS & Grid</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-xl font-black text-foreground tabular-nums">
              78%
            </span>
            <span className="font-mono text-xs text-text-secondary">SOC</span>
          </div>
          <span className="block text-[10px] text-text-tertiary">
            35% Floor Locked
          </span>
        </div>
      </div>

      {/* Stacked Priority Dispatch Timeline Chart */}
      <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-sans text-sm font-bold text-foreground">
              24-Hour Priority-Tiered Demand & Solar Dispatch Curve
            </h3>
            <p className="font-mono text-[11px] text-text-secondary">
              Notice how P3 flexible load (gray) expands during 12:00 PM solar peak, while P0 Life-Critical (crimson) is preserved flat 24/7.
            </p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-border bg-surface-soft text-text-tertiary">
            Model: Clinical Tier Dispatch
          </span>
        </div>

        <div className="h-64 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DISPATCH_TIMELINE} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isDark ? "#29332C" : "#D8D1C5"}
                strokeOpacity={0.6}
              />
              <XAxis
                dataKey="time"
                tick={{ fill: isDark ? "#A8ADA5" : "#68685F", fontSize: 10, fontFamily: "monospace" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: isDark ? "#A8ADA5" : "#68685F", fontSize: 10, fontFamily: "monospace" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#151C18" : "#FFFFFF",
                  borderColor: isDark ? "#29332C" : "#D8D1C5",
                  color: isDark ? "#F4F0E8" : "#252522",
                  borderRadius: "8px",
                  fontFamily: "monospace",
                  fontSize: "11px",
                }}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: 8,
                  fontSize: 11,
                  fontFamily: "monospace",
                }}
              />
              <Bar dataKey="criticalP0" name="P0 Life-Critical" stackId="demand" fill="#E36A45" />
              <Bar dataKey="essentialP1" name="P1 Essential" stackId="demand" fill="#E6D63B" />
              <Bar dataKey="supportP2" name="P2 Support" stackId="demand" fill="#8ACF3F" />
              <Bar dataKey="flexibleP3" name="P3 Flexible" stackId="demand" fill="#6B7280" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Explainable Optimization Decisions Feed */}
      <div className="space-y-3">
        <h3 className="font-mono text-xs font-bold uppercase text-text-secondary tracking-wider">
          Explainable Optimization Actions & Operational Reasons
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="p-4 rounded-xl border border-border bg-surface-soft/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-foreground">
                Shift CSSD Autoclaves to Midday Window
              </span>
              <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/30">
                RECOMMENDED ACTION
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed font-sans">
              "Solar generation is expected to peak at 92.0 kW between 11:30 AM and 2:00 PM. Two hospital autoclave sterilization cycles (13.0 kW) can be scheduled during this period, while critical-care reserve requirements remain 100% protected."
            </p>
            <div className="flex justify-between items-center text-[10px] font-mono text-text-tertiary pt-2 border-t border-border/60">
              <span>Financial Impact: Avoids ₹1,840 peak tariff</span>
              <span className="text-healthy font-semibold">Zero Patient Impact</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-surface-soft/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-foreground">
                Lock 35% BESS Floor for Apollo ICU
              </span>
              <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-danger/10 text-danger border border-danger/30">
                SAFETY CONSTRAINT
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed font-sans">
              "BESS discharge for peak-shaving is strictly capped at 65% SOC. The bottom 35% capacity (105.0 kWh) is reserved exclusively for ICU ventilators, surgical suites, and blood bank cold-chain under NABH Hospital Electrical Guidelines."
            </p>
            <div className="flex justify-between items-center text-[10px] font-mono text-text-tertiary pt-2 border-t border-border/60">
              <span>Autonomy Floor: 4.2 Hours Reserved</span>
              <span className="text-danger font-semibold">Non-Overridable Floor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
