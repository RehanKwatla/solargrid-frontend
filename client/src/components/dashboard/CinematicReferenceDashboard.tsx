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
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

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
      recDetail: "Adjust non-critical loads (e.g., laundry, HVAC, water heating) to 10 AM – 2 PM when solar generation is highest.",
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

  // Visual color tokens
  const solarYellow = "#F2D04B";
  const demandTerracotta = "#C95D3E";
  const batteryGreen = "#84CC39";
  const gridSilver = "#9CA3AF";
  const gridLineColor = isDark ? "#1E2722" : "#E4DEC9";
  const textMuted = isDark ? "#7D8A82" : "#6E7A70";

  return (
    <div className="w-full max-w-[1600px] mx-auto p-3 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 text-[#EDE8DC] font-sans antialiased">
      {/* =========================================================================
          UPPER SECTION: Hero Visualization (Left) + 4 Prominent KPI Cards (Right)
          ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Left Column (8 cols): Hero Visual Centerpiece */}
        <div className="lg:col-span-8 relative rounded-2xl border border-[#232C28] bg-[#141A18] overflow-hidden shadow-2xl flex flex-col justify-between min-h-[380px] sm:min-h-[420px] lg:min-h-[440px]">
          {/* Background Cinematic 3D Landscape */}
          <div
            className="absolute inset-0 pointer-events-none bg-cover bg-right sm:bg-center opacity-85 transition-opacity duration-700"
            style={{
              backgroundImage: "url('/hero-reference-card.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center right",
            }}
          />
          {/* Radial Gradient overlay to ensure text contrast on left while keeping 3D landscape luminous on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E1311] via-[#0E1311]/85 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1311]/90 via-transparent to-black/30 pointer-events-none" />

          {/* Top Left: Editorial Narrative */}
          <div className="relative z-10 p-5 sm:p-7 max-w-lg">
            <div className="inline-flex items-center gap-2 mb-2.5">
              <span className="font-mono text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] uppercase text-[#8DA778]">
                SMART ENERGY | SAFER TOMORROWS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#FAF7F0] leading-[1.15]">
              Energy intelligence <br className="hidden sm:inline" />
              for <span className="text-[#84CC39] drop-shadow-[0_0_12px_rgba(132,204,57,0.35)]">critical care</span>
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-[#C4BEB2] leading-relaxed max-w-md font-normal">
              We balance solar, battery and grid power to keep hospitals running efficiently, reliably and sustainably.
            </p>

            {/* Demonstration Mode Interactive Badge */}
            <div className="mt-4 inline-flex items-center gap-2">
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
                  Sample data for presentation
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
                  Midday Peak
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
                  Monsoon Drop
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
                  Islanding
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
              {/* Solar -> Battery line */}
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
              {/* Battery -> Hospital line */}
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
              {/* Grid -> Hospital line */}
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

            {/* 4 Interactive Node Badges (Responsive placement) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 relative">
              {/* Solar Badge */}
              <div className="rounded-xl border border-[#2C382F] bg-[#121A15]/90 backdrop-blur-md p-2.5 shadow-lg flex items-center gap-2.5 hover:border-[#F2D04B]/60 transition-all">
                <div className="w-8 h-8 rounded-lg bg-[#2E280C] border border-[#524514] flex items-center justify-center shrink-0">
                  <Sun size={17} className="text-[#F2D04B]" />
                </div>
                <div className="min-w-0">
                  <span className="block font-mono text-[9px] uppercase tracking-wider text-[#A09C90]">
                    Solar
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
                    Battery
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
                    Grid
                  </span>
                  <span className="block font-mono text-xs sm:text-sm font-bold text-[#FAF7F0] tabular-nums">
                    {telemetry.gridKw} <span className="text-[10px] font-normal text-[#8A867A]">kW</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): 4 Prominent KPI Cards (2x2 Grid) */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3.5 sm:gap-4">
          {/* KPI 1: Solar Generation */}
          <div className="rounded-2xl border border-[#232C28] bg-[#141A18] p-4 sm:p-5 flex flex-col justify-between hover:border-[#F2D04B]/40 transition-all shadow-md group">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#232415] border border-[#48421A] flex items-center justify-center text-[#F2D04B] shadow-inner group-hover:scale-105 transition-transform">
                <Sun size={20} />
              </div>
              <SparklineBars heights={[30, 45, 60, 80, 100, 75]} color="#F2D04B" />
            </div>
            <div className="mt-4">
              <p className="text-xs text-[#9E9E94] font-medium">Solar Generation</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#FAF7F0] font-mono tracking-tight tabular-nums">
                  {telemetry.solarKw}
                </span>
                <span className="text-xs font-semibold text-[#8A867A]">kW</span>
              </div>
              <div className="flex items-center gap-1 mt-1.5 text-[11px] text-[#84CC39] font-medium font-mono">
                <TrendingUp size={12} />
                <span>{telemetry.solarTrend} vs. last hour</span>
              </div>
            </div>
          </div>

          {/* KPI 2: Hospital Demand */}
          <div className="rounded-2xl border border-[#232C28] bg-[#141A18] p-4 sm:p-5 flex flex-col justify-between hover:border-[#C95D3E]/40 transition-all shadow-md group">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#2A1D1A] border border-[#522F26] flex items-center justify-center text-[#C95D3E] shadow-inner group-hover:scale-105 transition-transform">
                <Building2 size={20} />
              </div>
              <SparklineBars heights={[50, 65, 60, 85, 90, 95]} color="#C95D3E" />
            </div>
            <div className="mt-4">
              <p className="text-xs text-[#9E9E94] font-medium">Hospital Demand</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#FAF7F0] font-mono tracking-tight tabular-nums">
                  {telemetry.demandKw}
                </span>
                <span className="text-xs font-semibold text-[#8A867A]">kW</span>
              </div>
              <div className="flex items-center gap-1 mt-1.5 text-[11px] text-[#C95D3E] font-medium font-mono">
                <TrendingUp size={12} />
                <span>{telemetry.demandTrend} vs. last hour</span>
              </div>
            </div>
          </div>

          {/* KPI 3: Battery */}
          <div className="rounded-2xl border border-[#232C28] bg-[#141A18] p-4 sm:p-5 flex flex-col justify-between hover:border-[#84CC39]/40 transition-all shadow-md group">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#192B15] border border-[#385929] flex items-center justify-center text-[#84CC39] shadow-inner group-hover:scale-105 transition-transform">
                <Battery size={20} />
              </div>
              <SparklineBars heights={[60, 65, 70, 75, 78, 78]} color="#84CC39" />
            </div>
            <div className="mt-4">
              <p className="text-xs text-[#9E9E94] font-medium">Battery</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#FAF7F0] font-mono tracking-tight tabular-nums">
                  {telemetry.batterySoc}
                </span>
                <span className="text-xs font-semibold text-[#8A867A]">%</span>
              </div>
              <div className="flex items-center gap-1 mt-1.5 text-[11px] text-[#84CC39] font-medium font-mono">
                <TrendingUp size={12} />
                <span>{telemetry.batteryTrend} vs. last hour</span>
              </div>
            </div>
          </div>

          {/* KPI 4: Grid Import */}
          <div className="rounded-2xl border border-[#232C28] bg-[#141A18] p-4 sm:p-5 flex flex-col justify-between hover:border-[#9CA3AF]/40 transition-all shadow-md group">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#1B231F] border border-[#3B4A42] flex items-center justify-center text-[#9CA3AF] shadow-inner group-hover:scale-105 transition-transform">
                <Zap size={20} />
              </div>
              <SparklineBars heights={[90, 80, 60, 40, 25, 15]} color="#9CA3AF" />
            </div>
            <div className="mt-4">
              <p className="text-xs text-[#9E9E94] font-medium">Grid Import</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#FAF7F0] font-mono tracking-tight tabular-nums">
                  {telemetry.gridKw}
                </span>
                <span className="text-xs font-semibold text-[#8A867A]">kW</span>
              </div>
              <div className="flex items-center gap-1 mt-1.5 text-[11px] text-[#84CC39] font-medium font-mono">
                <TrendingDown size={12} />
                <span>{telemetry.gridTrend} vs. last hour</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          LOWER SECTION: Generation vs Demand | Battery Status | Power Distribution | Optimization
          ========================================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Card 1 (4 cols): Generation vs Demand Chart */}
        <div className="lg:col-span-4 rounded-2xl border border-[#232C28] bg-[#141A18] p-4 sm:p-5 flex flex-col justify-between shadow-md">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 size={17} className="text-[#8DA778]" />
              <h2 className="text-sm font-bold text-[#FAF7F0]">Generation vs Demand</h2>
            </div>
            {/* 24H / 7D / 30D Filter Buttons */}
            <div className="flex items-center p-0.5 rounded-lg bg-[#0E1311] border border-[#232C28]">
              {(["24H", "7D", "30D"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[10px] font-mono font-medium transition-all",
                    timeRange === range
                      ? "bg-[#253229] text-[#FAF7F0] shadow-sm font-bold"
                      : "text-[#7D8A82] hover:text-[#FAF7F0]"
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
                    backgroundColor: "#111714",
                    borderColor: "#232C28",
                    borderRadius: "8px",
                    fontFamily: "monospace",
                    fontSize: "11px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
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
          <div className="flex flex-wrap items-center justify-between gap-1.5 pt-3 border-t border-[#232C28] text-[10px] text-[#A6A296]">
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
        <div className="lg:col-span-2 rounded-2xl border border-[#232C28] bg-[#141A18] p-4 sm:p-5 flex flex-col justify-between shadow-md">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Battery size={17} className="text-[#84CC39]" />
            <h2 className="text-sm font-bold text-[#FAF7F0]">Battery Status</h2>
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
                  stroke="#1C2720"
                  strokeWidth="8"
                />
                {/* Progress arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke="#84CC39"
                  strokeWidth="8"
                  strokeDasharray={`${(telemetry.batterySoc / 100) * 264} 264`}
                  strokeLinecap="round"
                  style={{
                    filter: "drop-shadow(0 0 6px rgba(132, 204, 57, 0.45))",
                    transition: "stroke-dasharray 0.8s ease-in-out",
                  }}
                />
              </svg>
              {/* Center percentage and label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold text-[#FAF7F0] font-mono tabular-nums leading-none">
                  {telemetry.batterySoc}%
                </span>
                <span className="text-[10px] text-[#8DA778] font-medium mt-1">
                  State of Charge
                </span>
              </div>
            </div>
          </div>

          {/* Details below gauge */}
          <div className="space-y-2 pt-3 border-t border-[#232C28] text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#9E9E94]">
                <Zap size={13} className="text-[#84CC39]" /> Charging
              </span>
              <span className="font-mono font-semibold text-[#FAF7F0] tabular-nums">
                {telemetry.batteryKw} kW
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#9E9E94]">
                <Clock size={13} className="text-[#8DA778]" /> Operating Range
              </span>
              <span className="font-mono text-[#FAF7F0]">
                20% – 90%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#9E9E94]">
                <Thermometer size={13} className="text-[#C95D3E]" /> Temperature
              </span>
              <span className="font-mono text-[#FAF7F0]">
                28°C
              </span>
            </div>
          </div>
        </div>

        {/* Card 3 (2.5 cols): Power Distribution Panel */}
        <div className="lg:col-span-3 rounded-2xl border border-[#232C28] bg-[#141A18] p-4 sm:p-5 flex flex-col justify-between shadow-md">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <Share2 size={17} className="text-[#8DA778]" />
            <h2 className="text-sm font-bold text-[#FAF7F0]">Power Distribution</h2>
          </div>

          {/* 4 Power Source Bars */}
          <div className="space-y-4 my-auto py-2">
            {/* Solar Bar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Sun size={14} className="text-[#F2D04B]" />
                  <span className="text-[#FAF7F0] font-medium">Solar</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-[#FAF7F0] font-semibold">{telemetry.solarKw} kW</span>
                  <span className="text-[#7D8A82]">{telemetry.solarShare}%</span>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-[#1F2922] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#F2D04B] transition-all duration-700"
                  style={{ width: `${telemetry.solarShare}%` }}
                />
              </div>
            </div>

            {/* Battery Bar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Battery size={14} className="text-[#84CC39]" />
                  <span className="text-[#FAF7F0] font-medium">Battery</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-[#FAF7F0] font-semibold">28.7 kW</span>
                  <span className="text-[#7D8A82]">{telemetry.batteryShare}%</span>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-[#1F2922] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#84CC39] transition-all duration-700"
                  style={{ width: `${telemetry.batteryShare}%` }}
                />
              </div>
            </div>

            {/* Hospital Load Bar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Building2 size={14} className="text-[#C95D3E]" />
                  <span className="text-[#FAF7F0] font-medium">Hospital Load</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-[#FAF7F0] font-semibold">{telemetry.demandKw} kW</span>
                  <span className="text-[#7D8A82]">{telemetry.loadShare}%</span>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-[#1F2922] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#C95D3E] transition-all duration-700"
                  style={{ width: `${telemetry.loadShare}%` }}
                />
              </div>
            </div>

            {/* Grid Bar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Zap size={14} className="text-[#9CA3AF]" />
                  <span className="text-[#FAF7F0] font-medium">Grid</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-[#FAF7F0] font-semibold">{telemetry.gridKw} kW</span>
                  <span className="text-[#7D8A82]">{telemetry.gridShare}%</span>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-[#1F2922] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#9CA3AF] transition-all duration-700"
                  style={{ width: `${Math.max(telemetry.gridShare, 3)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-[#7D8A82] border-t border-[#232C28] flex items-center justify-between">
            <span>Dynamic EMS Dispatch</span>
            <span className="font-mono text-[#84CC39]">Zero Curtailment</span>
          </div>
        </div>

        {/* Card 4 (3 cols): Optimization Insight (Top) + Recent Activity (Bottom) */}
        <div className="lg:col-span-3 flex flex-col gap-3.5">
          {/* Optimization Insight Subcard */}
          <div className="rounded-2xl border border-[#3E2B1E] bg-[#1C1714] p-4 flex flex-col justify-between shadow-md relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Lightbulb size={16} className="text-[#E8AA48]" />
                <span className="text-xs font-bold text-[#FAF7F0]">Optimization Insight</span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#362515] text-[#E8AA48] border border-[#5E4226]">
                DEMO DATA
              </span>
            </div>

            <div className="flex gap-2.5 items-start mt-1">
              <div className="w-8 h-8 rounded-lg bg-[#302216] border border-[#543A24] flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-sm">🍃</span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#FAF7F0] leading-snug">
                  {telemetry.recTitle}
                </h3>
                <p className="text-[11px] text-[#C4BEB2] leading-relaxed mt-1">
                  {telemetry.recDetail}
                </p>
              </div>
            </div>

            <Link
              href="/intelligence"
              className="mt-3.5 inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-[#2E2015] hover:bg-[#3E2C1E] border border-[#523A26] text-xs font-medium text-[#FAF7F0] transition-colors group-hover:border-[#E8AA48]/40"
            >
              <span>View detailed forecast</span>
              <ArrowRight size={13} className="text-[#E8AA48]" />
            </Link>
          </div>

          {/* Recent Activity Subcard */}
          <div className="rounded-2xl border border-[#232C28] bg-[#141A18] p-4 flex flex-col justify-between shadow-md flex-1">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#232C28]">
              <div className="flex items-center gap-1.5">
                <Clock size={15} className="text-[#8DA778]" />
                <span className="text-xs font-bold text-[#FAF7F0]">Recent Activity</span>
              </div>
              <Link href="/alerts" className="text-[10px] text-[#8DA778] hover:text-[#FAF7F0] transition-colors">
                View all →
              </Link>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F2D04B] shrink-0" />
                <span className="font-mono text-[10px] text-[#8DA778] tabular-nums shrink-0">10:24 AM</span>
                <span className="text-[11px] text-[#C4BEB2] truncate">
                  Solar generation increased to 84.6 kW
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#84CC39] shrink-0" />
                <span className="font-mono text-[10px] text-[#8DA778] tabular-nums shrink-0">09:17 AM</span>
                <span className="text-[11px] text-[#C4BEB2] truncate">
                  Battery charging (12.4 kW)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C95D3E] shrink-0" />
                <span className="font-mono text-[10px] text-[#8DA778] tabular-nums shrink-0">08:52 AM</span>
                <span className="text-[11px] text-[#C4BEB2] truncate">
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
      <footer className="pt-3 pb-1 border-t border-[#232C28] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7D8A82]">
        <div className="flex items-center gap-2">
          <img src="/favicon.svg" alt="SolarGrid Leaf" className="w-4 h-4 object-contain" />
          <span className="font-bold text-[#FAF7F0]">SolarGrid</span>
          <span className="text-[#4E5B53]">|</span>
          <span className="text-[#A6A296] text-[11px]">Smart Solar Grid & Energy Optimization Platform</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#8DA778]">
          <span>Reliable Energy</span>
          <span className="text-[#4E5B53]">·</span>
          <span>Healthier Communities</span>
          <span className="text-[#4E5B53]">·</span>
          <span className="flex items-center gap-1">
            A Cleaner Tomorrow <span>🍃</span>
          </span>
        </div>
      </footer>

      {/* Demonstration Mode Modal */}
      {showDemoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-[#2B3A2E] bg-[#141A18] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#232C28]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#84CC39]" />
                <h3 className="text-base font-bold text-[#FAF7F0]">
                  Indradhanu Demonstration Platform
                </h3>
              </div>
              <button
                onClick={() => setShowDemoModal(false)}
                className="w-7 h-7 rounded-lg bg-[#1E2721] text-[#A6A296] hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#C4BEB2] leading-relaxed">
              This dashboard is running in deterministic presentation mode for Indradhanu.
              All solar generation, hospital electricity demand curves, and battery dispatch constraints
              follow realistic hospital electrical engineering models (Apollo Care Campus, 35% NABH ICU floor lock).
            </p>
            <div className="rounded-xl bg-[#0E1311] border border-[#232C28] p-3 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-[#8DA778]">
                <span>Active Model:</span>
                <span className="text-[#FAF7F0] font-bold">LFP 300 kWh / 120 kW BESS</span>
              </div>
              <div className="flex justify-between text-[#8DA778]">
                <span>Life-Support Hard Floor:</span>
                <span className="text-[#C95D3E] font-bold">35% SOC (105.0 kWh Reserve)</span>
              </div>
              <div className="flex justify-between text-[#8DA778]">
                <span>Feeder Switch Transfer:</span>
                <span className="text-[#84CC39] font-bold">12ms Islanding Ride-Through</span>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowDemoModal(false)}
                className="px-4 py-2 rounded-lg bg-[#84CC39] text-[#0D1110] font-bold text-xs hover:bg-[#96E246] transition-colors"
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
