import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BatteryCharging,
  Compass,
  HeartPulse,
  Power,
  Shield,
  ShieldAlert,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";

export type FlowScenario = "optimal" | "cloud" | "islanding" | "surplus";

interface ScenarioConfig {
  id: FlowScenario;
  name: string;
  tagline: string;
  solarKw: number;
  batteryKw: number; // positive = charging, negative = discharging
  batterySoc: number;
  hospitalKw: number;
  criticalKw: number;
  gridKw: number;
  gridState: "Connected" | "Islanded";
  statusColor: string;
  description: string;
  decisionReason: string;
}

const scenarios: Record<FlowScenario, ScenarioConfig> = {
  optimal: {
    id: "optimal",
    name: "Midday Solar Optimization",
    tagline: "High irradiance · 100% Self-Sufficient",
    solarKw: 42.8,
    batteryKw: 4.4, // charging
    batterySoc: 82,
    hospitalKw: 38.4,
    criticalKw: 14.2,
    gridKw: 0.0,
    gridState: "Connected",
    statusColor: "text-[var(--healthy)] bg-[var(--healthy-bg)]",
    description: "Tracker-01 maintains peak 98% sun alignment. Solar covers all hospital demands while replenishing critical battery reserves.",
    decisionReason: "Grid tariff at peak rate ₹9.50/kWh; routing 100% solar to facility bus eliminates avoidable utility import charges.",
  },
  cloud: {
    id: "cloud",
    name: "Cloud Cover Transient",
    tagline: "Solar drops · Fast BESS Response",
    solarKw: 14.5,
    batteryKw: -18.2, // discharging
    batterySoc: 74,
    hospitalKw: 32.7,
    criticalKw: 14.2,
    gridKw: 0.0,
    gridState: "Connected",
    statusColor: "text-[var(--warning)] bg-[var(--warning-bg)]",
    description: "Sudden cloud cover reduces PV generation. BESS inverters instantly ramp discharge to shield clinical circuits from voltage dip.",
    decisionReason: "Battery discharge latency < 12ms prevents hospital medical equipment from detecting solar ramp transient.",
  },
  islanding: {
    id: "islanding",
    name: "Grid Blackout Islanding",
    tagline: "Utility lost · ICU Life-Support Preserved",
    solarKw: 22.0,
    batteryKw: -8.0, // discharging
    batterySoc: 65,
    hospitalKw: 30.0,
    criticalKw: 14.2,
    gridKw: 0.0,
    gridState: "Islanded",
    statusColor: "text-[var(--danger)] bg-[var(--danger-bg)]",
    description: "External 11kV grid failure detected. EMS shed administrative and kitchen HVAC; locked 100% capacity onto ICU, OT, and cold storage.",
    decisionReason: "Safety policy locks 35% battery floor strictly for ICU ventilators and blood bank refrigeration; non-critical tiers curtailed.",
  },
  surplus: {
    id: "surplus",
    name: "P2P Clean Energy Export",
    tagline: "BESS Full · Microgrid Peer Trading",
    solarKw: 48.2,
    batteryKw: 0.0, // full
    batterySoc: 98,
    hospitalKw: 34.0,
    criticalKw: 14.2,
    gridKw: -14.2, // exporting to peer
    gridState: "Connected",
    statusColor: "text-[var(--healthy)] bg-[var(--healthy-bg)]",
    description: "Battery reached maximum operational threshold. Excess renewable electricity dispatched to neighboring pediatric wing under MERC tariff.",
    decisionReason: "P2P peer dispatch earns ₹7.20/kWh credit vs ₹3.50 utility feed-in buyback, generating commercial operational revenue.",
  },
};

export function AnimatedEnergyCenterpiece({
  activeScenario = "optimal",
  onScenarioChange,
}: {
  activeScenario?: FlowScenario;
  onScenarioChange?: (s: FlowScenario) => void;
}) {
  const [internalScenario, setInternalScenario] = useState<FlowScenario>("optimal");
  const currentKey = onScenarioChange ? activeScenario : internalScenario;
  const current = scenarios[currentKey];

  const handleSelect = (s: FlowScenario) => {
    if (onScenarioChange) onScenarioChange(s);
    else setInternalScenario(s);
  };

  const isDischarging = current.batteryKw < 0;
  const isCharging = current.batteryKw > 0;
  const isIslanded = current.gridState === "Islanded";
  const isExporting = current.gridKw < 0;

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Interactive Scenario Buttons for Judges & Evaluators */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl border border-border bg-surface/90 shadow-[var(--shadow-sm)] backdrop-blur">
        <div className="flex items-center gap-1.5 px-2">
          <Activity size={14} className="text-primary animate-pulse" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-secondary">
            Live Scenario Simulation:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {(Object.keys(scenarios) as FlowScenario[]).map((key) => {
            const sc = scenarios[key];
            const active = currentKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelect(key)}
                className={cn(
                  "px-2.5 py-1 rounded-lg font-sans text-xs font-semibold transition-all duration-200",
                  active
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-xs)] scale-[1.02]"
                    : "bg-surface-soft/60 text-text-secondary hover:text-foreground hover:bg-surface-soft border border-border/50"
                )}
              >
                {sc.name.split(" ")[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main SVG Energy Architectural Diagram */}
      <div className="relative w-full rounded-2xl border border-border bg-gradient-to-b from-surface via-surface to-surface-soft/40 p-4 sm:p-6 lg:p-7 shadow-[var(--shadow-md)] overflow-hidden">
        {/* Subtle schematic background coordinates */}
        <div className="absolute top-3 left-4 font-mono text-[9px] text-text-tertiary tracking-widest uppercase">
          BUS-415V · LOCAL SCHEMATIC · {current.tagline}
        </div>
        <div className="absolute top-3 right-4 flex items-center gap-1.5">
          <span className={cn("px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase", current.statusColor)}>
            {current.gridState === "Islanded" ? "ISLANDED (AUTONOMOUS)" : "SYNCHRONIZED"}
          </span>
        </div>

        {/* Dynamic SVG Flow Canvas */}
        <div className="mt-6 mb-2 relative min-h-[300px] sm:min-h-[340px] flex items-center justify-center">
          <svg
            viewBox="0 0 680 340"
            className="w-full h-auto max-h-[360px] select-none"
            aria-label="Animated energy flow diagram: Solar, Battery, Hospital Load, Grid"
          >
            <defs>
              {/* Gradients */}
              <linearGradient id="solarFlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B5543A" />
                <stop offset="100%" stopColor="#E08736" />
              </linearGradient>
              <linearGradient id="batteryFlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6F7F5F" />
                <stop offset="100%" stopColor="#9AB385" />
              </linearGradient>
              <linearGradient id="loadFlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B5543A" />
                <stop offset="100%" stopColor="#6F7F5F" />
              </linearGradient>

              {/* Glowing Particle Filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Connecting Bus Lines */}
            {/* Horizontal Central Distribution Bus */}
            <line
              x1="130"
              y1="170"
              x2="550"
              y2="170"
              stroke="var(--border-color)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Vertical Feeder lines */}
            <line x1="130" y1="90" x2="130" y2="170" stroke="var(--border-color)" strokeWidth="3" />
            <line x1="550" y1="90" x2="550" y2="170" stroke="var(--border-color)" strokeWidth="3" />
            <line x1="260" y1="170" x2="260" y2="250" stroke="var(--border-color)" strokeWidth="3" />
            <line x1="420" y1="170" x2="420" y2="250" stroke="var(--border-color)" strokeWidth="3" />

            {/* Active Flow Animated Paths */}
            {/* Solar -> Bus */}
            <path
              d="M 130 90 L 130 170 L 420 170 L 420 250"
              fill="none"
              stroke="#B5543A"
              strokeWidth="3.5"
              strokeDasharray="6 8"
              className="animate-flow-forward"
              opacity={current.solarKw > 0 ? "0.9" : "0.2"}
            />

            {/* Solar -> Battery (Charging) */}
            {isCharging && (
              <path
                d="M 130 170 L 260 170 L 260 250"
                fill="none"
                stroke="#E08736"
                strokeWidth="3"
                strokeDasharray="5 7"
                className="animate-flow-forward"
              />
            )}

            {/* Battery -> Hospital (Discharging) */}
            {isDischarging && (
              <path
                d="M 260 250 L 260 170 L 420 170 L 420 250"
                fill="none"
                stroke="#6F7F5F"
                strokeWidth="3.5"
                strokeDasharray="6 8"
                className="animate-flow-reverse"
              />
            )}

            {/* Grid -> Hospital or Hospital -> Grid */}
            {!isIslanded && isExporting ? (
              <path
                d="M 420 170 L 550 170 L 550 90"
                fill="none"
                stroke="#6F7F5F"
                strokeWidth="3"
                strokeDasharray="5 7"
                className="animate-flow-reverse"
              />
            ) : !isIslanded && current.gridKw > 0 ? (
              <path
                d="M 550 90 L 550 170 L 420 170 L 420 250"
                fill="none"
                stroke="#B5543A"
                strokeWidth="3"
                strokeDasharray="5 7"
                className="animate-flow-forward"
              />
            ) : null}

            {/* ================= NODES ================= */}

            {/* Node 1: SOLAR PV-01 (Top-Left: 130, 90) */}
            <g transform="translate(130, 90)" className="cursor-pointer">
              <circle r="46" fill="var(--surface)" stroke="#B5543A" strokeWidth="3" filter="url(#glow)" />
              <circle r="38" fill="var(--accent-bg)" />
              <foreignObject x="-30" y="-30" width="60" height="60">
                <div className="w-full h-full flex flex-col items-center justify-center text-[#B5543A]">
                  <Sun size={24} className="animate-spin-slow" />
                </div>
              </foreignObject>
              {/* Badges */}
              <text y="62" textAnchor="middle" className="font-sans font-bold text-xs" fill="var(--text-primary)">
                Solar PV-01
              </text>
              <text y="78" textAnchor="middle" className="font-mono text-[11px] font-extrabold" fill="#B5543A">
                {current.solarKw.toFixed(1)} kW
              </text>
            </g>

            {/* Node 2: GRID INLET (Top-Right: 550, 90) */}
            <g transform="translate(550, 90)" className="cursor-pointer">
              <circle
                r="46"
                fill="var(--surface)"
                stroke={isIslanded ? "var(--border-color)" : "#6F7F5F"}
                strokeWidth="3"
                opacity={isIslanded ? "0.6" : "1"}
              />
              <circle r="38" fill="var(--surface-soft)" />
              <foreignObject x="-30" y="-30" width="60" height="60">
                <div className="w-full h-full flex flex-col items-center justify-center text-text-secondary">
                  <Zap size={24} className={isIslanded ? "text-text-tertiary" : "text-[#6F7F5F]"} />
                </div>
              </foreignObject>
              <text y="62" textAnchor="middle" className="font-sans font-bold text-xs" fill="var(--text-primary)">
                11kV Grid Feeder
              </text>
              <text y="78" textAnchor="middle" className="font-mono text-[11px] font-extrabold" fill="var(--text-secondary)">
                {isIslanded ? "ISLANDED (0.0 kW)" : isExporting ? `Export ${Math.abs(current.gridKw).toFixed(1)} kW` : `${current.gridKw.toFixed(1)} kW`}
              </text>
            </g>

            {/* Node 3: BATTERY BESS-01 (Bottom-Left: 260, 250) */}
            <g transform="translate(260, 250)" className="cursor-pointer">
              <rect
                x="-45"
                y="-45"
                width="90"
                height="90"
                rx="18"
                fill="var(--surface)"
                stroke="#6F7F5F"
                strokeWidth="3"
              />
              <foreignObject x="-35" y="-35" width="70" height="70">
                <div className="w-full h-full flex flex-col items-center justify-center text-[#6F7F5F]">
                  <BatteryCharging size={24} className={isCharging ? "animate-pulse" : ""} />
                  <span className="font-mono text-xs font-black text-foreground mt-0.5">{current.batterySoc}%</span>
                </div>
              </foreignObject>
              <text y="62" textAnchor="middle" className="font-sans font-bold text-xs" fill="var(--text-primary)">
                BESS-01 (LFP)
              </text>
              <text y="78" textAnchor="middle" className="font-mono text-[11px] font-bold" fill="#6F7F5F">
                {isCharging ? `Charging +${current.batteryKw.toFixed(1)} kW` : isDischarging ? `Discharge ${current.batteryKw.toFixed(1)} kW` : "Reserve Idle"}
              </text>
            </g>

            {/* Node 4: HOSPITAL CRITICAL LOAD (Bottom-Right: 420, 250) */}
            <g transform="translate(420, 250)" className="cursor-pointer">
              <rect
                x="-48"
                y="-45"
                width="96"
                height="90"
                rx="18"
                fill="var(--surface)"
                stroke="#B5543A"
                strokeWidth="3"
                filter="url(#glow)"
              />
              <foreignObject x="-35" y="-35" width="70" height="70">
                <div className="w-full h-full flex flex-col items-center justify-center text-[#B5543A]">
                  <HeartPulse size={24} className="animate-pulse" />
                  <span className="font-mono text-[10px] font-bold text-foreground">ICU: {current.criticalKw} kW</span>
                </div>
              </foreignObject>
              <text y="62" textAnchor="middle" className="font-sans font-bold text-xs" fill="var(--text-primary)">
                Apollo Care Hospital
              </text>
              <text y="78" textAnchor="middle" className="font-mono text-[11px] font-extrabold" fill="#B5543A">
                Demand: {current.hospitalKw.toFixed(1)} kW
              </text>
            </g>

            {/* Central Energy Bus Hub Indicator */}
            <g transform="translate(340, 170)">
              <circle r="14" fill="var(--surface)" stroke="var(--border-color)" strokeWidth="2.5" />
              <circle r="6" fill="#B5543A" />
              <text y="-20" textAnchor="middle" className="font-mono text-[9px] uppercase tracking-wider font-bold" fill="var(--text-tertiary)">
                Energy Bus
              </text>
            </g>
          </svg>
        </div>

        {/* Narrative & Decision Explainability (Addresses Section 1 Core Questions) */}
        <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-tertiary flex items-center gap-1.5">
              <Activity size={12} className="text-primary" />
              1. What is happening?
            </span>
            <p className="text-text-secondary leading-relaxed">
              {current.description}
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-tertiary flex items-center gap-1.5">
              <Sparkles size={12} className="text-primary" />
              2. Why this decision was chosen?
            </span>
            <p className="text-text-secondary leading-relaxed">
              {current.decisionReason}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
