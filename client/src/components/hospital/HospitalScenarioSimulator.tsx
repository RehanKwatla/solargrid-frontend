import React, { useState } from "react";
import {
  Sliders,
  Shield,
  ShieldAlert,
  Battery,
  Zap,
  Sun,
  AlertTriangle,
  ArrowRight,
  Info,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Lock,
  Activity,
} from "lucide-react";
import {
  SIMULATION_SCENARIOS,
  type SimulationScenarioId,
  HOSPITAL_ROOMS,
} from "@/data/hospitalData";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export function HospitalScenarioSimulator() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeScenarioId, setActiveScenarioId] = useState<SimulationScenarioId>("baseline");
  const scenario = SIMULATION_SCENARIOS[activeScenarioId];

  // Base values
  const baseSolarKw = 84.6;
  const baseDemandKw = 62.3;
  const baseGridKw = 12.4;

  // Simulated values
  const simSolarKw = Number((baseSolarKw * scenario.solarKwModifier).toFixed(1));
  const simDemandKw = Number((baseDemandKw * scenario.demandKwModifier).toFixed(1));
  const simBessSoc = scenario.bessSocPercent;
  const simGridKw = scenario.gridAvailable
    ? Math.max(0, Number((simDemandKw - simSolarKw).toFixed(1)))
    : 0;

  // Life-support preservation
  const p0DemandKw = 18.0;
  const p0ProtectedPercent = scenario.p0ProtectedPercent; // Always 100%

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-md space-y-6">
      {/* Simulator Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
              Healthcare Resilience & Contingency Engine
            </span>
            <span className="px-2 py-0.5 rounded-full font-mono text-[9px] font-bold bg-warning/10 text-warning border border-warning/30">
              Interactive What-If Simulator
            </span>
          </div>
          <h2 className="font-sans text-lg sm:text-xl font-extrabold text-foreground">
            Hospital Grid Contingency & Surge Simulator
          </h2>
          <p className="font-mono text-xs text-text-secondary mt-0.5">
            Test how SolarGrid prioritizes medical life-support circuits across 6 clinical stress scenarios.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-text-tertiary hidden sm:inline">
            Active Mode:
          </span>
          <span className="px-2.5 py-1 rounded-lg border border-border bg-surface-soft font-mono text-xs font-bold text-primary">
            {scenario.badge}
          </span>
        </div>
      </div>

      {/* Scenario Selector Chips */}
      <div className="space-y-2">
        <label className="block font-mono text-xs font-bold text-text-secondary uppercase tracking-wider">
          Select Clinical Operating Scenario
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2">
          {(Object.keys(SIMULATION_SCENARIOS) as SimulationScenarioId[]).map((key) => {
            const sc = SIMULATION_SCENARIOS[key];
            const isSelected = activeScenarioId === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveScenarioId(key)}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all flex flex-col justify-between",
                  isSelected
                    ? "border-primary bg-primary/10 ring-1 ring-primary shadow-xs"
                    : "border-border bg-surface hover:bg-surface-soft"
                )}
              >
                <span className="font-mono text-[11px] font-bold text-foreground leading-tight line-clamp-2">
                  {sc.name}
                </span>
                <span
                  className={cn(
                    "mt-2 block font-mono text-[9px] uppercase font-semibold",
                    isSelected ? "text-primary" : "text-text-tertiary"
                  )}
                >
                  {sc.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scenario Description Banner */}
      <div className="p-3.5 rounded-xl border border-border bg-surface-soft/60 space-y-1">
        <span className="font-mono text-[10px] uppercase text-text-tertiary block">
          Scenario Environmental & Clinical Context
        </span>
        <p className="text-xs text-foreground leading-relaxed font-sans">
          {scenario.description}
        </p>
      </div>

      {/* Simulated Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl border border-border bg-surface shadow-xs">
          <div className="flex items-center gap-1.5 text-warning mb-1">
            <Sun size={15} />
            <span className="font-mono text-[10px] uppercase font-semibold text-text-tertiary">
              Simulated Solar
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-black text-foreground tabular-nums">
              {simSolarKw}
            </span>
            <span className="font-mono text-xs text-text-secondary">kW</span>
          </div>
          <span className="block font-mono text-[10px] text-text-tertiary mt-1">
            Baseline: 84.6 kW ({Math.round(scenario.solarKwModifier * 100)}%)
          </span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface shadow-xs">
          <div className="flex items-center gap-1.5 text-danger mb-1">
            <Activity size={15} />
            <span className="font-mono text-[10px] uppercase font-semibold text-text-tertiary">
              Hospital Demand
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-black text-foreground tabular-nums">
              {simDemandKw}
            </span>
            <span className="font-mono text-xs text-text-secondary">kW</span>
          </div>
          <span className="block font-mono text-[10px] text-text-tertiary mt-1">
            Baseline: 62.3 kW ({Math.round(scenario.demandKwModifier * 100)}%)
          </span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface shadow-xs">
          <div className="flex items-center gap-1.5 text-healthy mb-1">
            <Battery size={15} />
            <span className="font-mono text-[10px] uppercase font-semibold text-text-tertiary">
              Battery Reserve
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-black text-foreground tabular-nums">
              {simBessSoc}
            </span>
            <span className="font-mono text-xs text-text-secondary">%</span>
          </div>
          <span className="block font-mono text-[10px] text-healthy font-semibold mt-1">
            Floor: 35% Hard Locked
          </span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface shadow-xs">
          <div className="flex items-center gap-1.5 text-text-secondary mb-1">
            <Zap size={15} />
            <span className="font-mono text-[10px] uppercase font-semibold text-text-tertiary">
              Grid Import
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-black text-foreground tabular-nums">
              {simGridKw}
            </span>
            <span className="font-mono text-xs text-text-secondary">kW</span>
          </div>
          <span className="block font-mono text-[10px] text-text-tertiary mt-1">
            {scenario.gridAvailable ? "Feeder Online" : "Feeder Outage (0 kW)"}
          </span>
        </div>
      </div>

      {/* Safety Guarantee Banner */}
      <div className="p-4 rounded-2xl border border-healthy/40 bg-healthy/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-healthy text-primary-foreground flex items-center justify-center shrink-0 shadow-sm font-bold">
            <Lock size={18} />
          </div>
          <div>
            <h4 className="font-sans text-xs sm:text-sm font-bold text-foreground">
              NABH Life-Critical P0 Safety Lock: 100% Guaranteed Coverage
            </h4>
            <p className="font-mono text-[11px] text-text-secondary mt-0.5">
              {scenario.clinicalSafetyNotice}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-xs font-bold text-healthy">
            P0 Shedding Prohibited
          </span>
        </div>
      </div>

      {/* Optimization Dispatch & Operator Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Automated Dispatch Logic */}
        <div className="p-4 rounded-xl border border-border bg-surface space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            <h4 className="font-sans text-xs font-bold text-foreground">
              Automated EMS Dispatch Response
            </h4>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {scenario.dispatchDecision}
          </p>

          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-mono">
            <span className="text-text-tertiary">P3 Flexible Load Status:</span>
            <span className="text-foreground font-semibold">{scenario.p3LoadStatus}</span>
          </div>
        </div>

        {/* Recommended Actions for Biomedical & Engineering Staff */}
        <div className="p-4 rounded-xl border border-border bg-surface space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-primary" />
            <h4 className="font-sans text-xs font-bold text-foreground">
              Authorized Operator Action Checklist
            </h4>
          </div>
          <ul className="space-y-1.5 text-xs text-text-secondary">
            {scenario.recommendedActions.map((act, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-mono text-primary font-bold">0{i + 1}.</span>
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-text-tertiary border-t border-border">
        <span>SolarGrid Clinical Resilience Engine · Deterministic Evaluation Model</span>
        <span>Simulated outputs labeled clearly · Not connected to physical breakers</span>
      </div>
    </div>
  );
}
