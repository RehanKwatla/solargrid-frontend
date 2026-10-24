import React, { useState } from "react";
import { Link } from "wouter";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Sun,
  Building2,
  Battery,
  Zap,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Clock,
  Lightbulb,
  ArrowRight,
  Info,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Share2,
  HeartPulse,
  ShieldAlert,
  Activity,
  ChevronDown,
  Bed,
  Server,
  AlertTriangle,
  Layers,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import {
  HOSPITAL_CAMPUSES,
  HOSPITAL_DEPARTMENTS,
  HOSPITAL_ROOMS,
  getHospitalPrioritySummary,
} from "@/data/hospitalData";

// Time series datasets for Generation vs Demand
const TIME_SERIES_24H = [
  { time: "12 AM", solar: 0, demand: 42, battery: -10, grid: 42 },
  { time: "3 AM", solar: 0, demand: 45, battery: -12, grid: 45 },
  { time: "6 AM", solar: 8, demand: 52, battery: 0, grid: 44 },
  { time: "9 AM", solar: 68, demand: 72, battery: 18, grid: 22 },
  { time: "12 PM", solar: 92, demand: 78, battery: 28, grid: 14 },
  { time: "3 PM", solar: 74, demand: 70, battery: 14, grid: 10 },
  { time: "6 PM", solar: 18, demand: 58, battery: -18, grid: 40 },
  { time: "9 PM", solar: 0, demand: 52, battery: -22, grid: 52 },
  { time: "12 AM", solar: 0, demand: 46, battery: -12, grid: 46 },
];

const TIME_SERIES_7D = [
  { time: "Mon", solar: 82, demand: 64, battery: 24, grid: 16 },
  { time: "Tue", solar: 88, demand: 68, battery: 26, grid: 12 },
  { time: "Wed", solar: 76, demand: 62, battery: 18, grid: 18 },
  { time: "Thu", solar: 94, demand: 70, battery: 29, grid: 10 },
  { time: "Fri", solar: 85, demand: 66, battery: 22, grid: 14 },
  { time: "Sat", solar: 70, demand: 55, battery: 16, grid: 12 },
  { time: "Sun", solar: 84.6, demand: 62.3, battery: 28.7, grid: 12.4 },
];

const TIME_SERIES_30D = [
  { time: "Wk 1", solar: 79, demand: 65, battery: 20, grid: 18 },
  { time: "Wk 2", solar: 86, demand: 67, battery: 25, grid: 14 },
  { time: "Wk 3", solar: 91, demand: 69, battery: 27, grid: 11 },
  { time: "Wk 4", solar: 84.6, demand: 62.3, battery: 28.7, grid: 12.4 },
];

interface SparklineBarProps {
  heights: number[];
  color: string;
}

function SparklineBars({ heights, color }: SparklineBarProps) {
  return (
    <div className="flex items-end gap-1 h-5">
      {heights.map((h, i) => (
        <span
          key={i}
          className="w-1 rounded-sm transition-all duration-300"
          style={{
            height: `${h}%`,
            backgroundColor: color,
            opacity: 0.4 + (i / heights.length) * 0.6,
          }}
        />
      ))}
    </div>
  );
}

export function CinematicReferenceDashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Hospital campus selector state (Section 3 Requirement)
  const [selectedCampusId, setSelectedCampusId] = useState<string>("apollo-pune");
  const selectedCampus =
    HOSPITAL_CAMPUSES.find((c) => c.id === selectedCampusId) ?? HOSPITAL_CAMPUSES[0];
  const prioritySummary = getHospitalPrioritySummary();

  // Time range filter for Generation vs Demand chart
  const [timeRange, setTimeRange] = useState<"24H" | "7D" | "30D">("24H");
  // Interactive live demonstration scenario
  const [activeScenario, setActiveScenario] = useState<"standard" | "cloud" | "island">("standard");
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Dynamic telemetry based on scenario
  const telemetry = {
    standard: {
      solarKw: 84.6,
      demandKw: 62.3,
      batterySoc: 78,
      batteryKw: 12.4,
      batteryFlow: "Charging",
      gridKw: 12.4,
      solarTrend: "+12%",
      demandTrend: "+6%",
      batteryTrend: "+4%",
      gridTrend: "-18%",
      solarShare: 38,
      batteryShare: 13,
      loadShare: 28,
      gridShare: 6,
      recTitle: "Shift flexible loads toward peak solar generation",
      recDetail: "Adjust non-critical loads (e.g., laundry, CSSD autoclave batch 2) to 11 AM – 2 PM when solar generation is highest.",
    },
    cloud: {
      solarKw: 38.2,
      demandKw: 64.1,
      batterySoc: 68,
      batteryKw: 22.5,
      batteryFlow: "Discharging",
      gridKw: 28.4,
      solarTrend: "-45%",
      demandTrend: "+2%",
      batteryTrend: "-8%",
      gridTrend: "+35%",
      solarShare: 22,
      batteryShare: 26,
      loadShare: 35,
      gridShare: 17,
      recTitle: "Conserve BESS reserve & curtail Tier 03 amenities",
      recDetail: "Monsoon cloud cover detected. Pre-cool HVAC cancelled to lock 35% life-support reserve for ICU and surgical wings.",
    },
    island: {
      solarKw: 68.0,
      demandKw: 58.5,
      batterySoc: 72,
      batteryKw: 9.5,
      batteryFlow: "Stabilizing",
      gridKw: 0.0,
      solarTrend: "Active",
      demandTrend: "Stable",
      batteryTrend: "Forming",
      gridTrend: "Islanded",
      solarShare: 45,
      batteryShare: 18,
      loadShare: 37,
      gridShare: 0,
      recTitle: "Zero-interruption microgrid island active",
      recDetail: "Feeder breaker isolated in 12ms. SolarGrid grid-forming inverters maintaining 50Hz hospital bus voltage with zero grid dependency.",
    },
  }[activeScenario];

  const currentChartData =
    timeRange === "24H"
      ? TIME_SERIES_24H
      : timeRange === "7D"
      ? TIME_SERIES_7D
      : TIME_SERIES_30D;

  // Visual color tokens adhering strictly to requested palette
  const solarYellow = isDark ? "#E6D63B" : "#B89B19";
  const demandTerracotta = isDark ? "#E36A45" : "#B5543A";
  const batteryGreen = isDark ? "#8ACF3F" : "#6F7F5F";
  const gridSilver = isDark ? "#9CA3AF" : "#68685F";
  const gridLineColor = isDark ? "#29332C" : "#D8D1C5";
  const textMuted = isDark ? "#A8ADA5" : "#68685F";

  // Prominent P0 rooms for quick clinical glance
  const prominentP0Rooms = HOSPITAL_ROOMS.filter((r) => r.priority === "P0").slice(0, 4);

  return (
    <div className="w-full max-w-[1600px] mx-auto p-3 sm:p-5 lg:p-6 space-y-5 text-foreground font-sans antialiased">
      {/* =========================================================================
          LEVEL 1 — HOSPITAL PROFILE SELECTOR BAR (Section 3 Requirement)
          ========================================================================= */}
      <section className="rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-sm transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Hospital Profile Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-soft border border-border flex items-center justify-center shrink-0 text-primary shadow-xs">
              <Building2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <label htmlFor="hospital-campus-select" className="sr-only">
                  Select Hospital Campus
                </label>
                <div className="relative">
                  <select
                    id="hospital-campus-select"
                    value={selectedCampusId}
                    onChange={(e) => setSelectedCampusId(e.target.value)}
                    className="font-sans text-sm sm:text-base font-extrabold text-foreground bg-transparent pr-7 py-0.5 border-b border-border/70 hover:border-primary focus:outline-none focus:border-primary cursor-pointer transition-colors"
                  >
                    {HOSPITAL_CAMPUSES.map((campus) => (
                      <option
                        key={campus.id}
                        value={campus.id}
                        className={isDark ? "bg-[#151C18] text-[#F4F0E8]" : "bg-white text-[#252522]"}
                      >
                        {campus.name} ({campus.campusCode})
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
                  />
                </div>
                <span className="pill pill-healthy !text-[9px] !py-0.5">
                  <span className="status-dot healthy" />
                  {selectedCampus.currentMode}
                </span>
              </div>
              <p className="text-[11px] text-text-secondary mt-0.5">
                {selectedCampus.location} · Campus Code: <span className="font-mono text-foreground">{selectedCampus.campusCode}</span>
              </p>
            </div>
          </div>

          {/* Hospital Technical Specifications Band */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-soft border border-border">
              <Bed size={13} className="text-text-tertiary" />
              <span className="text-text-secondary">Beds:</span>
              <span className="font-bold text-foreground">{selectedCampus.totalBeds} Total</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--danger-bg)] border border-[var(--danger)]/30 text-[var(--danger)]">
              <HeartPulse size={13} />
              <span>Critical Care:</span>
              <span className="font-bold">{selectedCampus.criticalCareBeds} Beds (ICU/OT)</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-soft border border-border">
              <Sun size={13} style={{ color: solarYellow }} />
              <span className="text-text-secondary">Solar PV:</span>
              <span className="font-bold text-foreground">{selectedCampus.solarCapacityKwp} kWp</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-soft border border-border">
              <Battery size={13} style={{ color: batteryGreen }} />
              <span className="text-text-secondary">BESS:</span>
              <span className="font-bold text-foreground">{selectedCampus.batteryCapacityKwh} kWh / {selectedCampus.batteryPowerKw} kW</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          UPPER SECTION: Hero Visualization (Left) + 6 Top-Level KPI Metrics (Right)
          ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Left Column (7 cols): Hero Visual Centerpiece */}
        <div className="lg:col-span-7 relative rounded-2xl border border-border bg-[#111713] overflow-hidden shadow-xl flex flex-col justify-between min-h-[380px] sm:min-h-[420px] lg:min-h-[440px]">
          {/* Background Cinematic 3D Landscape */}
          <div
            className="absolute inset-0 pointer-events-none bg-cover bg-right sm:bg-center opacity-85 transition-opacity duration-700"
            style={{
              backgroundImage: "url('/hero-reference-card.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center right",
            }}
          />
          {/* Radial Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C100E] via-[#0C100E]/85 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C100E]/90 via-transparent to-black/30 pointer-events-none" />

          {/* Top Left: Editorial Narrative */}
          <div className="relative z-10 p-5 sm:p-7 max-w-lg">
            <div className="inline-flex items-center gap-2 mb-2.5">
              <span className="font-mono text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] uppercase text-[#8DA778]">
                HOSPITAL ENERGY INTELLIGENCE & ROOM PRIORITY ENGINE
              </span>
            </div>
            {/* Required Hero Heading: "Every Watt. Every Room. Every Life." */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#FAF7F0] leading-[1.15]">
              Every Watt. Every Room. <br className="hidden sm:inline" />
              <span className="text-[#84CC39] drop-shadow-[0_0_12px_rgba(132,204,57,0.35)]">
                Every Life.
              </span>
            </h1>
            {/* Required Supporting Text */}
            <p className="mt-3 text-xs sm:text-sm text-[#C4BEB2] leading-relaxed max-w-md font-normal">
              Intelligent energy coordination for critical hospital infrastructure, clinical departments, and patient-care environments.
            </p>

            {/* Demonstration Mode Interactive Badge */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowDemoModal(true)}
                className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A261D]/90 border border-[#2B3A2E] text-xs text-[#8DA778] hover:text-[#FAF7F0] hover:border-[#84CC39]/50 transition-all shadow-md backdrop-blur-sm"
              >
                <span className="w-2 h-2 rounded-full bg-[#84CC39] animate-pulse" />
                <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-[#94D843]">
                  DEMONSTRATION MODE
                </span>
                <span className="text-[11px] text-[#A6A296] hidden sm:inline">
                  Hospital Telemetry Engine
                </span>
                <Info size={12} className="text-[#8DA778] group-hover:text-[#FAF7F0]" />
              </button>

              {/* Scenario Quick Selector (Presentation Control) */}
              <div className="hidden xl:flex items-center gap-1 bg-[#101713]/85 border border-[#232F26] p-1 rounded-full backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setActiveScenario("standard")}
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-mono transition-all",
                    activeScenario === "standard"
                      ? "bg-[#84CC39] text-[#0D1110] font-bold shadow-sm"
                      : "text-[#8E9B8F] hover:text-[#FAF7F0]"
                  )}
                >
                  Midday Optimal
                </button>
                <button
                  type="button"
                  onClick={() => setActiveScenario("cloud")}
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-mono transition-all",
                    activeScenario === "cloud"
                      ? "bg-[#C95D3E] text-white font-bold shadow-sm"
                      : "text-[#8E9B8F] hover:text-[#FAF7F0]"
                  )}
                >
                  Monsoon Storm
                </button>
                <button
                  type="button"
                  onClick={() => setActiveScenario("island")}
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-mono transition-all",
                    activeScenario === "island"
                      ? "bg-[#F2D04B] text-[#0D1110] font-bold shadow-sm"
                      : "text-[#8E9B8F] hover:text-[#FAF7F0]"
                  )}
                >
                  12ms Islanding
                </button>
              </div>
            </div>
          </div>

          {/* Floating Telemetry Badges with SVG Animated Glow Lines over Landscape */}
          <div className="relative z-10 w-full p-4 sm:p-6 mt-auto">
            {/* SVG Connecting Flow Lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ filter: "drop-shadow(0 0 4px rgba(132, 204, 57, 0.4))" }}
            >
              <defs>
                <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F2D04B" />
                  <stop offset="50%" stopColor="#84CC39" />
                  <stop offset="100%" stopColor="#C95D3E" />
                </linearGradient>
              </defs>
              <line
                x1="35%"
                y1="35%"
                x2="52%"
                y2="75%"
                stroke="url(#flowGrad)"
                strokeWidth="2"
                strokeDasharray="6 4"
                className="animate-[flowForward_1.5s_linear_infinite]"
              />
              <line
                x1="52%"
                y1="75%"
                x2="68%"
                y2="35%"
                stroke="#84CC39"
                strokeWidth="2"
                strokeDasharray="6 4"
                className="animate-[flowForward_1.5s_linear_infinite]"
              />
              <line
                x1="85%"
                y1="75%"
                x2="68%"
                y2="35%"
                stroke="#9CA3AF"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                strokeOpacity={activeScenario === "island" ? 0.2 : 0.7}
              />
            </svg>

            {/* 4 Interactive Node Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 relative">
              {/* Solar Badge */}
              <div className="rounded-xl border border-[#2C382F] bg-[#121A15]/90 backdrop-blur-md p-2.5 shadow-lg flex items-center gap-2.5 hover:border-[#F2D04B]/60 transition-all">
                <div className="w-8 h-8 rounded-lg bg-[#2E280C] border border-[#524514] flex items-center justify-center shrink-0">
                  <Sun size={17} className="text-[#F2D04B]" />
                </div>
                <div className="min-w-0">
                  <span className="block font-mono text-[9px] uppercase tracking-wider text-[#A09C90]">
                    Solar PV
                  </span>
                  <span className="block font-mono text-xs sm:text-sm font-bold text-[#FAF7F0] tabular-nums">
                    {telemetry.solarKw} <span className="text-[10px] font-normal text-[#8A867A]">kW</span>
                  </span>
                </div>
              </div>

              {/* Hospital Load Badge */}
              <div className="rounded-xl border border-[#2C382F] bg-[#121A15]/90 backdrop-blur-md p-2.5 shadow-lg flex items-center gap-2.5 hover:border-[#C95D3E]/60 transition-all">
                <div className="w-8 h-8 rounded-lg bg-[#2B1B15] border border-[#542F24] flex items-center justify-center shrink-0">
                  <Building2 size={17} className="text-[#C95D3E]" />
                </div>
                <div className="min-w-0">
                  <span className="block font-mono text-[9px] uppercase tracking-wider text-[#A09C90]">
                    Hospital Load
                  </span>
                  <span className="block font-mono text-xs sm:text-sm font-bold text-[#FAF7F0] tabular-nums">
                    {telemetry.demandKw} <span className="text-[10px] font-normal text-[#8A867A]">kW</span>
                  </span>
                </div>
              </div>

              {/* Battery Badge */}
              <div className="rounded-xl border border-[#2C382F] bg-[#121A15]/90 backdrop-blur-md p-2.5 shadow-lg flex items-center gap-2.5 hover:border-[#84CC39]/60 transition-all">
                <div className="w-8 h-8 rounded-lg bg-[#192B15] border border-[#355227] flex items-center justify-center shrink-0">
                  <Battery size={17} className="text-[#84CC39]" />
                </div>
                <div className="min-w-0">
                  <span className="block font-mono text-[9px] uppercase tracking-wider text-[#A09C90]">
                    Battery BESS
                  </span>
                  <span className="block font-mono text-xs sm:text-sm font-bold text-[#84CC39] tabular-nums">
                    {telemetry.batterySoc}%
                  </span>
                </div>
              </div>

              {/* Grid Badge */}
              <div className="rounded-xl border border-[#2C382F] bg-[#121A15]/90 backdrop-blur-md p-2.5 shadow-lg flex items-center gap-2.5 hover:border-[#9CA3AF]/60 transition-all">
                <div className="w-8 h-8 rounded-lg bg-[#1E2521] border border-[#3A453F] flex items-center justify-center shrink-0">
                  <Zap size={17} className="text-[#9CA3AF]" />
                </div>
                <div className="min-w-0">
                  <span className="block font-mono text-[9px] uppercase tracking-wider text-[#A09C90]">
                    Grid Feeder
                  </span>
                  <span className="block font-mono text-xs sm:text-sm font-bold text-[#FAF7F0] tabular-nums">
                    {telemetry.gridKw} <span className="text-[10px] font-normal text-[#8A867A]">kW</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): 6 Prominent Top-Level Hospital Metrics (Section 3 Requirement) */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
          {/* Metric 1: Total Hospital Demand */}
          <div className="rounded-2xl border border-border bg-card p-3.5 sm:p-4 flex flex-col justify-between hover:border-border transition-all shadow-sm group">
            <div className="flex items-start justify-between">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform"
                style={{
                  backgroundColor: isDark ? "#2A1D1A" : "#FBECE8",
                  border: `1px solid ${isDark ? "#522F26" : "#ECC4B8"}`,
                  color: demandTerracotta,
                }}
              >
                <Building2 size={18} />
              </div>
              <span className="font-mono text-[9px] text-text-tertiary uppercase tracking-wider bg-surface-soft px-1.5 py-0.5 rounded border border-border">
                10 Depts
              </span>
            </div>
            <div className="mt-2.5">
              <p className="text-[11px] text-text-secondary font-medium">Total Hospital Demand</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl sm:text-2xl font-extrabold text-foreground font-mono tracking-tight tabular-nums">
                  {telemetry.demandKw}
                </span>
                <span className="text-xs font-semibold text-text-tertiary">kW</span>
              </div>
              <div className="flex items-center justify-between mt-1 text-[10px] font-medium font-mono">
                <span style={{ color: demandTerracotta }}>{telemetry.demandTrend} vs last hr</span>
                <span className="text-text-tertiary">Metered</span>
              </div>
            </div>
          </div>

          {/* Metric 2: Solar Generation */}
          <div className="rounded-2xl border border-border bg-card p-3.5 sm:p-4 flex flex-col justify-between hover:border-border transition-all shadow-sm group">
            <div className="flex items-start justify-between">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform"
                style={{
                  backgroundColor: isDark ? "#232415" : "#FAF5DC",
                  border: `1px solid ${isDark ? "#48421A" : "#E8DD9E"}`,
                  color: solarYellow,
                }}
              >
                <Sun size={18} />
              </div>
              <SparklineBars heights={[30, 45, 60, 80, 100, 75]} color={solarYellow} />
            </div>
            <div className="mt-2.5">
              <p className="text-[11px] text-text-secondary font-medium">Solar Generation</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl sm:text-2xl font-extrabold text-foreground font-mono tracking-tight tabular-nums">
                  {telemetry.solarKw}
                </span>
                <span className="text-xs font-semibold text-text-tertiary">kW</span>
              </div>
              <div className="flex items-center justify-between mt-1 text-[10px] font-medium font-mono">
                <span style={{ color: batteryGreen }}>{telemetry.solarTrend} vs last hr</span>
                <span className="text-text-tertiary">Dual-Axis PV</span>
              </div>
            </div>
          </div>

          {/* Metric 3: Battery State of Charge */}
          <div className="rounded-2xl border border-border bg-card p-3.5 sm:p-4 flex flex-col justify-between hover:border-border transition-all shadow-sm group">
            <div className="flex items-start justify-between">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform"
                style={{
                  backgroundColor: isDark ? "#192B15" : "#EEF3EA",
                  border: `1px solid ${isDark ? "#385929" : "#D0DEC4"}`,
                  color: batteryGreen,
                }}
              >
                <Battery size={18} />
              </div>
              <span className="font-mono text-[9px] text-text-tertiary uppercase tracking-wider bg-surface-soft px-1.5 py-0.5 rounded border border-border">
                {telemetry.batteryFlow}
              </span>
            </div>
            <div className="mt-2.5">
              <p className="text-[11px] text-text-secondary font-medium">Battery SOC</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl sm:text-2xl font-extrabold text-foreground font-mono tracking-tight tabular-nums">
                  {telemetry.batterySoc}
                </span>
                <span className="text-xs font-semibold text-text-tertiary">%</span>
              </div>
              <div className="flex items-center justify-between mt-1 text-[10px] font-medium font-mono">
                <span style={{ color: batteryGreen }}>{telemetry.batteryKw} kW flow</span>
                <span className="text-text-tertiary">35% Floor Lock</span>
              </div>
            </div>
          </div>

          {/* Metric 4: Grid Import */}
          <div className="rounded-2xl border border-border bg-card p-3.5 sm:p-4 flex flex-col justify-between hover:border-border transition-all shadow-sm group">
            <div className="flex items-start justify-between">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform"
                style={{
                  backgroundColor: isDark ? "#1B231F" : "#F0EBE1",
                  border: `1px solid ${isDark ? "#3B4A42" : "#DDD5C5"}`,
                  color: gridSilver,
                }}
              >
                <Zap size={18} />
              </div>
              <span className="font-mono text-[9px] text-text-tertiary uppercase tracking-wider bg-surface-soft px-1.5 py-0.5 rounded border border-border">
                Feeder A
              </span>
            </div>
            <div className="mt-2.5">
              <p className="text-[11px] text-text-secondary font-medium">Grid Import</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl sm:text-2xl font-extrabold text-foreground font-mono tracking-tight tabular-nums">
                  {telemetry.gridKw}
                </span>
                <span className="text-xs font-semibold text-text-tertiary">kW</span>
              </div>
              <div className="flex items-center justify-between mt-1 text-[10px] font-medium font-mono">
                <span style={{ color: batteryGreen }}>{telemetry.gridTrend} vs last hr</span>
                <span className="text-text-tertiary">11 kV Substation</span>
              </div>
            </div>
          </div>

          {/* Metric 5: Critical-Load Coverage (Section 3 Requirement) */}
          <div className="rounded-2xl border border-border bg-card p-3.5 sm:p-4 flex flex-col justify-between hover:border-border transition-all shadow-sm group">
            <div className="flex items-start justify-between">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform"
                style={{
                  backgroundColor: isDark ? "#192B15" : "#EEF3EA",
                  border: `1px solid ${isDark ? "#385929" : "#D0DEC4"}`,
                  color: batteryGreen,
                }}
              >
                <ShieldCheck size={18} />
              </div>
              <span className="pill pill-healthy !text-[9px] !py-0">100% P0 Protected</span>
            </div>
            <div className="mt-2.5">
              <p className="text-[11px] text-text-secondary font-medium">Critical-Load Coverage</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight tabular-nums" style={{ color: batteryGreen }}>
                  100%
                </span>
                <span className="text-xs font-semibold text-text-tertiary">Autonomy</span>
              </div>
              <div className="flex items-center justify-between mt-1 text-[10px] font-medium font-mono">
                <span className="text-foreground">4.8h BESS reserve</span>
                <span className="text-text-tertiary">Zero Shedding</span>
              </div>
            </div>
          </div>

          {/* Metric 6: Number of Active Alerts (Section 3 Requirement) */}
          <div className="rounded-2xl border border-border bg-card p-3.5 sm:p-4 flex flex-col justify-between hover:border-border transition-all shadow-sm group">
            <div className="flex items-start justify-between">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform bg-[var(--warning-bg)] border border-[var(--warning)]/30 text-[var(--warning)]"
              >
                <AlertTriangle size={18} />
              </div>
              <Link
                href="/alerts"
                className="text-[10px] font-mono text-primary hover:underline transition-colors"
              >
                View Log →
              </Link>
            </div>
            <div className="mt-2.5">
              <p className="text-[11px] text-text-secondary font-medium">Active Clinical Alarms</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight tabular-nums text-foreground">
                  3
                </span>
                <span className="text-xs font-semibold text-text-tertiary">Active</span>
              </div>
              <div className="flex items-center justify-between mt-1 text-[10px] font-medium font-mono">
                <span className="text-[var(--danger)]">0 P0 · 1 P1 · 2 P2</span>
                <span className="text-text-tertiary">Controlled</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          LEVEL 2 & 3 — HOSPITAL ENERGY DISTRIBUTION & PROMINENT P0 ROOMS (Section 3 Requirement)
          ========================================================================= */}
      <section className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <Layers size={17} style={{ color: batteryGreen }} />
              <h2 className="text-sm sm:text-base font-bold text-foreground">
                Hospital Energy Allocation & Priority Distribution
              </h2>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Live power dispatch across P0 Life-Critical, P1 Clinically Essential, P2 Clinical Support, and P3 Flexible tiers.
            </p>
          </div>
          <Link
            href="/departments"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold transition-all shrink-0"
          >
            <span>Explore All 10 Departments & 22 Rooms</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Priority Allocation Distribution Bar */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between text-xs font-mono">
            <span className="text-text-secondary">Hospital Priority Allocation ({telemetry.demandKw} kW total):</span>
            <span className="text-[10px] text-text-tertiary">NABH Safety Compliance Verified</span>
          </div>
          <div className="h-3 w-full rounded-full bg-surface-soft overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${prioritySummary.p0.percentage}%` }}
              className="h-full bg-[var(--danger)] transition-all duration-500"
              title={`P0 Life-Critical: ${prioritySummary.p0.demandKw} kW (${prioritySummary.p0.percentage}%)`}
            />
            <div
              style={{ width: `${prioritySummary.p1.percentage}%` }}
              className="h-full bg-[#E36A45] transition-all duration-500"
              title={`P1 Clinically Essential: ${prioritySummary.p1.demandKw} kW (${prioritySummary.p1.percentage}%)`}
            />
            <div
              style={{ width: `${prioritySummary.p2.percentage}%` }}
              className="h-full bg-[var(--warning)] transition-all duration-500"
              title={`P2 Clinical Support: ${prioritySummary.p2.demandKw} kW (${prioritySummary.p2.percentage}%)`}
            />
            <div
              style={{ width: `${prioritySummary.p3.percentage}%` }}
              className="h-full bg-text-tertiary/40 transition-all duration-500"
              title={`P3 Flexible / Non-Critical: ${prioritySummary.p3.demandKw} kW (${prioritySummary.p3.percentage}%)`}
            />
          </div>

          {/* Priority Legend Pill Chips */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 text-xs">
            <div className="p-2 rounded-lg bg-[var(--danger-bg)] border border-[var(--danger)]/30 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--danger)]" />
                <span className="font-bold text-[var(--danger)]">P0 Life-Critical</span>
              </div>
              <span className="font-mono font-bold text-foreground tabular-nums">
                {prioritySummary.p0.demandKw} kW
              </span>
            </div>
            <div className="p-2 rounded-lg bg-[#E36A45]/10 border border-[#E36A45]/30 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E36A45]" />
                <span className="font-bold text-[#E36A45]">P1 Essential</span>
              </div>
              <span className="font-mono font-bold text-foreground tabular-nums">
                {prioritySummary.p1.demandKw} kW
              </span>
            </div>
            <div className="p-2 rounded-lg bg-[var(--warning-bg)] border border-[var(--warning)]/30 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--warning)]" />
                <span className="font-bold text-[var(--warning)]">P2 Support</span>
              </div>
              <span className="font-mono font-bold text-foreground tabular-nums">
                {prioritySummary.p2.demandKw} kW
              </span>
            </div>
            <div className="p-2 rounded-lg bg-surface-soft border border-border flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-text-tertiary" />
                <span className="font-medium text-text-secondary">P3 Flexible</span>
              </div>
              <span className="font-mono font-bold text-foreground tabular-nums">
                {prioritySummary.p3.demandKw} kW
              </span>
            </div>
          </div>
        </div>

        {/* Prominent P0 Life-Critical Rooms Spotlight (Prominent without alarming wall of red) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} className="text-[var(--danger)]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Protected Life-Critical Rooms (P0 Active Telemetry)
              </h3>
            </div>
            <span className="font-mono text-[10px] text-text-tertiary">
              Continuous 100% Power Guarantee
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {prominentP0Rooms.map((room) => (
              <div
                key={room.id}
                className="rounded-xl border border-[var(--danger)]/35 bg-card p-3.5 flex flex-col justify-between hover:border-[var(--danger)] transition-all shadow-xs group"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="font-mono text-[10px] font-bold text-text-tertiary">
                      {room.code}
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[var(--danger-bg)] text-[var(--danger)] border border-[var(--danger)]/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--danger)] animate-pulse" />
                      P0 LIFE-CRITICAL
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                    {room.name}
                  </h4>
                  <p className="text-[10px] text-text-secondary mt-0.5 truncate">
                    {room.departmentName}
                  </p>

                  <div className="mt-2.5 p-2 rounded-lg bg-surface-soft border border-border/70 space-y-1 font-mono text-[11px]">
                    <div className="flex justify-between items-center">
                      <span className="text-text-tertiary">Current Demand:</span>
                      <span className="font-bold text-foreground">{room.currentKw} kW</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-text-tertiary">Safety Floor:</span>
                      <span className="text-[var(--danger)] font-bold">{room.minRequiredKw ?? 2.5} kW Min</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-[10px]">
                  <span className="text-text-secondary truncate max-w-[140px]" title={room.backupStatus}>
                    ⚡ {room.backupStatus.split(" ")[0]} Ready
                  </span>
                  <Link
                    href={`/departments`}
                    className="font-mono font-semibold text-primary hover:underline"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          LOWER SECTION: Generation vs Demand | Battery Status | Power Distribution | Optimization
          ========================================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Card 1 (4 cols): Generation vs Demand Chart */}
        <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-4 sm:p-5 flex flex-col justify-between shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 size={17} style={{ color: batteryGreen }} />
              <h2 className="text-sm font-bold text-foreground">Generation vs Demand</h2>
            </div>
            {/* 24H / 7D / 30D Filter Buttons */}
            <div className="flex items-center p-0.5 rounded-lg bg-surface-soft border border-border">
              {(["24H", "7D", "30D"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[10px] font-mono font-medium transition-all",
                    timeRange === range
                      ? "bg-card text-foreground shadow-xs font-bold"
                      : "text-text-secondary hover:text-foreground"
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Multi-series Area Chart */}
          <div className="h-56 w-full min-w-0 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="refSolarFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={solarYellow} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={solarYellow} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridLineColor} strokeOpacity={0.6} />
                <XAxis
                  dataKey="time"
                  tick={{ fill: textMuted, fontSize: 10, fontFamily: "monospace" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 120]}
                  ticks={[0, 30, 60, 90, 120]}
                  tick={{ fill: textMuted, fontSize: 10, fontFamily: "monospace" }}
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
                    boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.5)" : "0 8px 24px rgba(37,37,34,0.12)",
                  }}
                />
                {/* Solar Area */}
                <Area
                  type="monotone"
                  dataKey="solar"
                  name="Solar Generation"
                  stroke={solarYellow}
                  strokeWidth={2}
                  fill="url(#refSolarFill)"
                />
                {/* Demand Line */}
                <Line
                  type="monotone"
                  dataKey="demand"
                  name="Hospital Demand"
                  stroke={demandTerracotta}
                  strokeWidth={2}
                  dot={{ r: 2, fill: demandTerracotta }}
                />
                {/* Battery Line */}
                <Line
                  type="monotone"
                  dataKey="battery"
                  name="Battery"
                  stroke={batteryGreen}
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  dot={false}
                />
                {/* Grid Line */}
                <Line
                  type="monotone"
                  dataKey="grid"
                  name="Grid Import"
                  stroke={gridSilver}
                  strokeWidth={1.2}
                  strokeDasharray="2 2"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 pt-3 border-t border-border text-[10px] text-text-secondary">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: solarYellow }} /> Solar Generation
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: demandTerracotta }} /> Hospital Demand
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: batteryGreen }} /> Battery
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: gridSilver }} /> Grid Import
            </span>
          </div>
        </div>

        {/* Card 2 (2.5 cols): Battery Status Circular Gauge Ring */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-4 sm:p-5 flex flex-col justify-between shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Battery size={17} style={{ color: batteryGreen }} />
            <h2 className="text-sm font-bold text-foreground">Battery Status</h2>
          </div>

          {/* Circular Gauge Ring */}
          <div className="my-auto py-3 flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Track circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke={isDark ? "#1D2621" : "#EAE3D6"}
                  strokeWidth="8"
                />
                {/* Progress arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke={batteryGreen}
                  strokeWidth="8"
                  strokeDasharray={`${(telemetry.batterySoc / 100) * 264} 264`}
                  strokeLinecap="round"
                  style={{
                    filter: `drop-shadow(0 0 6px ${isDark ? "rgba(138, 207, 63, 0.45)" : "rgba(111, 127, 95, 0.35)"})`,
                    transition: "stroke-dasharray 0.8s ease-in-out",
                  }}
                />
              </svg>
              {/* Center percentage and label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold text-foreground font-mono tabular-nums leading-none">
                  {telemetry.batterySoc}%
                </span>
                <span className="text-[10px] text-text-secondary font-medium mt-1">
                  State of Charge
                </span>
              </div>
            </div>
          </div>

          {/* Details below gauge */}
          <div className="space-y-2 pt-3 border-t border-border text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-text-secondary">
                <Zap size={13} style={{ color: batteryGreen }} /> Charging
              </span>
              <span className="font-mono font-semibold text-foreground tabular-nums">
                {telemetry.batteryKw} kW
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-text-secondary">
                <Clock size={13} style={{ color: batteryGreen }} /> Operating Range
              </span>
              <span className="font-mono text-foreground">
                20% – 90%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-text-secondary">
                <Thermometer size={13} style={{ color: demandTerracotta }} /> Temperature
              </span>
              <span className="font-mono text-foreground">
                28°C
              </span>
            </div>
          </div>
        </div>

        {/* Card 3 (2.5 cols): Power Distribution Panel */}
        <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-4 sm:p-5 flex flex-col justify-between shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <Share2 size={17} style={{ color: batteryGreen }} />
            <h2 className="text-sm font-bold text-foreground">Power Distribution</h2>
          </div>

          {/* 4 Power Source Bars */}
          <div className="space-y-4 my-auto py-2">
            {/* Solar Bar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Sun size={14} style={{ color: solarYellow }} />
                  <span className="text-foreground font-medium">Solar</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-foreground font-semibold">{telemetry.solarKw} kW</span>
                  <span className="text-text-secondary">{telemetry.solarShare}%</span>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-surface-soft overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${telemetry.solarShare}%`, backgroundColor: solarYellow }}
                />
              </div>
            </div>

            {/* Battery Bar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Battery size={14} style={{ color: batteryGreen }} />
                  <span className="text-foreground font-medium">Battery</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-foreground font-semibold">28.7 kW</span>
                  <span className="text-text-secondary">{telemetry.batteryShare}%</span>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-surface-soft overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${telemetry.batteryShare}%`, backgroundColor: batteryGreen }}
                />
              </div>
            </div>

            {/* Hospital Load Bar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Building2 size={14} style={{ color: demandTerracotta }} />
                  <span className="text-foreground font-medium">Hospital Load</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-foreground font-semibold">{telemetry.demandKw} kW</span>
                  <span className="text-text-secondary">{telemetry.loadShare}%</span>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-surface-soft overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${telemetry.loadShare}%`, backgroundColor: demandTerracotta }}
                />
              </div>
            </div>

            {/* Grid Bar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Zap size={14} style={{ color: gridSilver }} />
                  <span className="text-foreground font-medium">Grid</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-foreground font-semibold">{telemetry.gridKw} kW</span>
                  <span className="text-text-secondary">{telemetry.gridShare}%</span>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-surface-soft overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(telemetry.gridShare, 3)}%`, backgroundColor: gridSilver }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-text-secondary border-t border-border flex items-center justify-between">
            <span>Dynamic EMS Dispatch</span>
            <span className="font-mono" style={{ color: batteryGreen }}>Zero Curtailment</span>
          </div>
        </div>

        {/* Card 4 (3 cols): Optimization Insight (Top) + Recent Activity (Bottom) */}
        <div className="lg:col-span-3 flex flex-col gap-3.5">
          {/* Optimization Insight Subcard */}
          <div
            className="rounded-2xl border p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group"
            style={{
              backgroundColor: isDark ? "#1C1714" : "#FAF5DC",
              borderColor: isDark ? "#3E2B1E" : "#D8D1C5",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Lightbulb size={16} style={{ color: isDark ? "#E6D63B" : "#B89B19" }} />
                <span className="text-xs font-bold text-foreground">Optimization Insight</span>
              </div>
              <span
                className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border"
                style={{
                  backgroundColor: isDark ? "#362515" : "#FFF8D6",
                  color: isDark ? "#E6D63B" : "#8A720C",
                  borderColor: isDark ? "#5E4226" : "#E2D38A",
                }}
              >
                DEMO DATA
              </span>
            </div>

            <div className="flex gap-2.5 items-start mt-1">
              <div
                className="w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  backgroundColor: isDark ? "#302216" : "#FFFFFF",
                  borderColor: isDark ? "#543A24" : "#D8D1C5",
                }}
              >
                <span className="text-sm">🍃</span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-foreground leading-snug">
                  {telemetry.recTitle}
                </h3>
                <p className="text-[11px] text-text-secondary leading-relaxed mt-1">
                  {telemetry.recDetail}
                </p>
              </div>
            </div>

            <Link
              href="/intelligence"
              className="mt-3.5 inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg border text-xs font-medium transition-colors"
              style={{
                backgroundColor: isDark ? "#2E2015" : "#FFFFFF",
                borderColor: isDark ? "#523A26" : "#D8D1C5",
                color: isDark ? "#F4F0E8" : "#252522",
              }}
            >
              <span>View detailed forecast</span>
              <ArrowRight size={13} style={{ color: isDark ? "#E6D63B" : "#B89B19" }} />
            </Link>
          </div>

          {/* Recent Activity Subcard */}
          <div className="rounded-2xl border border-border bg-card p-4 flex flex-col justify-between shadow-sm flex-1">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-border">
              <div className="flex items-center gap-1.5">
                <Clock size={15} style={{ color: batteryGreen }} />
                <span className="text-xs font-bold text-foreground">Recent Activity</span>
              </div>
              <Link href="/alerts" className="text-[10px] text-primary hover:underline transition-colors">
                View all →
              </Link>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: solarYellow }} />
                <span className="font-mono text-[10px] text-text-tertiary tabular-nums shrink-0">10:24 AM</span>
                <span className="text-[11px] text-text-secondary truncate">
                  Solar generation increased to 84.6 kW
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: batteryGreen }} />
                <span className="font-mono text-[10px] text-text-tertiary tabular-nums shrink-0">09:17 AM</span>
                <span className="text-[11px] text-text-secondary truncate">
                  Battery charging (12.4 kW)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: demandTerracotta }} />
                <span className="font-mono text-[10px] text-text-tertiary tabular-nums shrink-0">08:52 AM</span>
                <span className="text-[11px] text-text-secondary truncate">
                  Grid import reduced to 12.4 kW
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER BAR
          ========================================================================= */}
      <footer className="pt-3 pb-1 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-secondary">
        <div className="flex items-center gap-2">
          <img src="/favicon.svg" alt="SolarGrid Leaf" className="w-4 h-4 object-contain" />
          <span className="font-bold text-foreground">SolarGrid</span>
          <span className="text-text-tertiary">|</span>
          <span className="text-text-tertiary text-[11px]">Smart Solar Grid & Energy Optimization Platform</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-primary">
          <span>Reliable Energy</span>
          <span className="text-text-tertiary">·</span>
          <span>Healthier Communities</span>
          <span className="text-text-tertiary">·</span>
          <span className="flex items-center gap-1">
            A Cleaner Tomorrow <span>🍃</span>
          </span>
        </div>
      </footer>

      {/* Demonstration Mode Modal */}
      {showDemoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" style={{ color: batteryGreen }} />
                <h3 className="text-base font-bold text-foreground">
                  Indradhanu Demonstration Platform
                </h3>
              </div>
              <button
                onClick={() => setShowDemoModal(false)}
                className="w-7 h-7 rounded-lg bg-surface-soft text-text-secondary hover:text-foreground flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              This dashboard is running in deterministic presentation mode for Indradhanu.
              All solar generation, hospital electricity demand curves, and battery dispatch constraints
              follow realistic hospital electrical engineering models (Apollo Care Campus, 35% NABH ICU floor lock).
            </p>
            <div className="rounded-xl bg-surface-soft border border-border p-3 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-text-secondary">
                <span>Active Model:</span>
                <span className="text-foreground font-bold">LFP 300 kWh / 120 kW BESS</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Life-Support Hard Floor:</span>
                <span className="font-bold" style={{ color: demandTerracotta }}>35% SOC (105.0 kWh Reserve)</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Feeder Switch Transfer:</span>
                <span className="font-bold" style={{ color: batteryGreen }}>12ms Islanding Ride-Through</span>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowDemoModal(false)}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-opacity"
              >
                Close & Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
