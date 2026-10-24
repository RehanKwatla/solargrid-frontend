import { useState } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import {
  AnimatedEnergyCenterpiece,
  type FlowScenario,
} from "@/components/home/AnimatedEnergyCenterpiece";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Activity,
  ArrowRight,
  BatteryCharging,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck,
  HeartPulse,
  Info,
  Layers,
  Mail,
  Moon,
  Phone,
  Scale,
  Shield,
  ShieldAlert,
  Sparkles,
  Sun,
  TrendingUp,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [scenario, setScenario] = useState<FlowScenario>("optimal");

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors duration-300 relative flex flex-col selection:bg-[var(--accent)] selection:text-white">
      {/* 1. Public Marketing Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/90 backdrop-blur-md px-4 sm:px-6 lg:px-12 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--accent-soft)] bg-surface p-1 shadow-sm group-hover:border-primary transition-colors">
              <img src="/favicon.svg" alt="SolarGrid Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <span className="font-sans text-base font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors block leading-tight">
                SolarGrid
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary block leading-tight">
                Energy Optimization
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-text-secondary">
            <button
              type="button"
              onClick={() => scrollToSection("architecture")}
              className="hover:text-foreground transition-colors"
            >
              Energy Flow
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("hospital-ems")}
              className="hover:text-foreground transition-colors"
            >
              Hospital EMS
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("scenarios")}
              className="hover:text-foreground transition-colors"
            >
              Scenarios
            </button>
            <Link
              href="/intro"
              className="hover:text-foreground transition-colors flex items-center gap-1 text-primary"
            >
              <Compass size={14} />
              <span>3D Digital Twin</span>
            </Link>
          </nav>

          {/* Actions & Live Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-[10px] text-text-tertiary">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--healthy)] animate-pulse" />
              <span>INDRADHANU DEMO</span>
            </div>

            {toggleTheme && (
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary hover:text-foreground transition-colors"
              >
                {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
              </button>
            )}

            <Link
              href="/overview"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 font-sans text-xs font-bold text-primary-foreground shadow-[var(--shadow-sm)] hover:opacity-95 transition-all"
            >
              <span>Explore Live Dashboard</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION — Asymmetrical Editorial Composition (Section 3) */}
      <section className="relative w-full overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 px-4 sm:px-6 lg:px-12 border-b border-border/60">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial Headline & Narrative (7 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-soft)] bg-surface px-3 py-1 font-mono text-[10px] font-semibold text-primary uppercase tracking-wider shadow-sm">
              <Sparkles size={12} className="text-primary" />
              Smart Solar Grid &amp; Energy Optimization Platform
            </div>

            <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.05]">
              Powering Critical Care. <span className="text-primary">Intelligently.</span>
            </h1>

            <p className="text-base sm:text-lg text-text-secondary font-medium leading-relaxed max-w-xl">
              An intelligent energy management platform that helps hospitals coordinate solar generation, battery storage, and grid power for a more resilient energy future.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/overview"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-sans text-sm font-bold text-primary-foreground shadow-[var(--shadow-md)] hover:opacity-95 transition-all"
              >
                <span>Explore Live Dashboard</span>
                <ArrowRight size={16} />
              </Link>

              <button
                type="button"
                onClick={() => scrollToSection("hospital-ems")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 font-sans text-sm font-semibold text-foreground hover:bg-surface-soft transition-all"
              >
                <span>Discover How It Works</span>
              </button>

              <Link
                href="/intro"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border/70 bg-surface-soft/60 px-4 py-3 font-sans text-sm font-semibold text-text-secondary hover:text-foreground transition-all"
                title="Open 3D Digital Twin Canvas"
              >
                <Compass size={16} className="text-primary" />
                <span>3D Digital Twin</span>
              </Link>
            </div>

            {/* Three Core Questions Callout (Section 1) */}
            <div className="pt-4 border-t border-border/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border border-border/60 bg-surface/80 space-y-1">
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-text-tertiary block">
                  1. Real-Time State
                </span>
                <p className="font-sans text-xs font-semibold text-foreground">
                  Where power moves now
                </p>
                <p className="text-[11px] text-text-secondary leading-snug">
                  PV yield, battery reserve, ICU load, and grid flow.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-border/60 bg-surface/80 space-y-1">
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-text-tertiary block">
                  2. System Next Step
                </span>
                <p className="font-sans text-xs font-semibold text-foreground">
                  Proactive dispatch logic
                </p>
                <p className="text-[11px] text-text-secondary leading-snug">
                  Pre-charge BESS prior to peak tariff and storm windows.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-border/60 bg-surface/80 space-y-1">
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-text-tertiary block">
                  3. Decision Proof
                </span>
                <p className="font-sans text-xs font-semibold text-foreground">
                  Transparent optimization
                </p>
                <p className="text-[11px] text-text-secondary leading-snug">
                  Saves ₹9.50/kWh peak costs while locking 35% ICU buffer.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Centerpiece — Animated Energy Flow (5 cols) */}
          <div className="lg:col-span-6 w-full" id="architecture">
            <AnimatedEnergyCenterpiece
              activeScenario={scenario}
              onScenarioChange={setScenario}
            />
          </div>
        </div>
      </section>

      {/* 3. HOSPITAL-FIRST DESIGN SECTION (Section 5) */}
      <section className="w-full py-16 lg:py-24 px-4 sm:px-6 lg:px-12 bg-surface-soft/40 border-b border-border/60" id="hospital-ems">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-surface border border-border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--healthy)]">
              <HeartPulse size={13} />
              Hospital-Grade Clinical Reliability
            </div>
            <h2 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Because Power in a Hospital is a Life-Safety Requirement.
            </h2>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              Medical equipment cannot tolerate blackouts, voltage flickers, or arbitrary power curtailment. SolarGrid introduces an automated Energy Management System (EMS) designed specifically for institutional healthcare campuses.
            </p>
          </div>

          {/* Clinical Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pillar 1: Circuit Prioritization */}
            <div className="card p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--danger-bg)] text-[var(--danger)]">
                <ShieldAlert size={20} />
              </div>
              <h3 className="font-sans text-base font-bold text-foreground">
                Critical vs. Flexible Loads
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Hospital electrical circuits are classified into Tier 01 (ICU, Operating Theatres, Life Support), Tier 02 (Emergency &amp; Diagnostic labs), Tier 03 (General Wards), and Tier 04 (Administrative HVAC). During grid anomalies, lower tiers are gracefully curtailed to guarantee continuous life support.
              </p>
            </div>

            {/* Pillar 2: Battery Reserve Policy */}
            <div className="card p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--healthy-bg)] text-[var(--healthy)]">
                <BatteryCharging size={20} />
              </div>
              <h3 className="font-sans text-base font-bold text-foreground">
                35% Dedicated Reserve Floor
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Ordinary solar systems deplete batteries for tariff arbitrage. SolarGrid enforces a strict 35% state-of-charge safety floor that is never discharged for economic reasons, maintaining minimum 4-hour autonomy for ventilators and clinical cold-chain storage.
              </p>
            </div>

            {/* Pillar 3: Dual-Axis Solar Tracking */}
            <div className="card p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-bg)] text-primary">
                <Sun size={20} />
              </div>
              <h3 className="font-sans text-base font-bold text-foreground">
                Continuous Solar Alignment
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Physical dual-axis PV tracking increases daily daylight energy capture by +28.4% compared to fixed rooftop panels. Broader generation shoulders in morning and late afternoon substantially reduce diesel generator reliance.
              </p>
            </div>

            {/* Pillar 4: Predictive Demand Forecasting */}
            <div className="card p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-soft text-text-primary">
                <TrendingUp size={20} />
              </div>
              <h3 className="font-sans text-base font-bold text-foreground">
                Predictive Load Modeling
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Neural network models forecast hospital power demand hours in advance by learning scheduled surgical theater sessions, chiller ramping cycles, and weather-driven cooling loads, orchestrating pre-charging before solar declines.
              </p>
            </div>

            {/* Pillar 5: P2P Microgrid Sharing */}
            <div className="card p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--healthy-bg)] text-[var(--healthy)]">
                <Zap size={20} />
              </div>
              <h3 className="font-sans text-base font-bold text-foreground">
                Microgrid Peer Energy Trading
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Surplus clean power is automatically dispatched over local microgrid feeders to neighboring pediatric clinics and medicine warehouses at verified MERC institutional rates, unlocking commercial credits without utility transmission losses.
              </p>
            </div>

            {/* Pillar 6: Safety Boundary & Disclaimers */}
            <div className="card p-6 space-y-3 border-[var(--healthy-ring)]/40 bg-[var(--healthy-bg)]/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface text-foreground">
                <Shield size={20} />
              </div>
              <h3 className="font-sans text-base font-bold text-foreground">
                Safety-First Architecture
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                SolarGrid acts as an intelligent supervisory layer. The platform provides automated dispatch recommendations and circuit breaker telemetry coordination without directly interfering with certified life-safety medical devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRESENTATION MODE FOR INDRADHANU (Section 11) */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-12 border-b border-border/60" id="scenarios">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                Indradhanu Presentation Console
              </span>
              <h2 className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
                Live Demonstration Scenarios
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-xl">
                Demonstrate the optimization engine under challenging grid conditions. Click any scenario to simulate real-time controller behavior.
              </p>
            </div>

            <Link
              href="/overview"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-sans text-xs font-bold text-primary-foreground shadow-sm hover:opacity-95 transition-all self-start md:self-end"
            >
              <span>Launch Full Control Center</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Scenario Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => {
                setScenario("optimal");
                scrollToSection("architecture");
              }}
              className={cn(
                "p-4 rounded-xl border text-left transition-all duration-200 group flex flex-col justify-between",
                scenario === "optimal"
                  ? "border-[var(--accent)] bg-surface shadow-[var(--shadow-sm)] ring-1 ring-primary"
                  : "border-border bg-surface hover:bg-surface-soft"
              )}
            >
              <div>
                <span className="pill pill-healthy !text-[9px] mb-2">Scenario 01</span>
                <h4 className="font-sans text-sm font-bold text-foreground">Peak Midday Solar</h4>
                <p className="text-[11px] text-text-secondary mt-1">
                  High irradiance, 100% facility self-powered, surplus charging BESS buffer.
                </p>
              </div>
              <span className="font-mono text-[10px] text-primary font-bold mt-4 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Simulate Scenario &rarr;
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setScenario("cloud");
                scrollToSection("architecture");
              }}
              className={cn(
                "p-4 rounded-xl border text-left transition-all duration-200 group flex flex-col justify-between",
                scenario === "cloud"
                  ? "border-[var(--accent)] bg-surface shadow-[var(--shadow-sm)] ring-1 ring-primary"
                  : "border-border bg-surface hover:bg-surface-soft"
              )}
            >
              <div>
                <span className="pill pill-warning !text-[9px] mb-2">Scenario 02</span>
                <h4 className="font-sans text-sm font-bold text-foreground">Cloud Transient</h4>
                <p className="text-[11px] text-text-secondary mt-1">
                  Sudden solar generation drop. BESS inverters seamlessly absorb facility deficit.
                </p>
              </div>
              <span className="font-mono text-[10px] text-primary font-bold mt-4 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Simulate Scenario &rarr;
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setScenario("islanding");
                scrollToSection("architecture");
              }}
              className={cn(
                "p-4 rounded-xl border text-left transition-all duration-200 group flex flex-col justify-between",
                scenario === "islanding"
                  ? "border-[var(--accent)] bg-surface shadow-[var(--shadow-sm)] ring-1 ring-primary"
                  : "border-border bg-surface hover:bg-surface-soft"
              )}
            >
              <div>
                <span className="pill pill-danger !text-[9px] mb-2">Scenario 03</span>
                <h4 className="font-sans text-sm font-bold text-foreground">Blackout Islanding</h4>
                <p className="text-[11px] text-text-secondary mt-1">
                  11kV utility grid cut. EMS sheds non-critical load and locks 100% to ICU.
                </p>
              </div>
              <span className="font-mono text-[10px] text-primary font-bold mt-4 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Simulate Scenario &rarr;
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setScenario("surplus");
                scrollToSection("architecture");
              }}
              className={cn(
                "p-4 rounded-xl border text-left transition-all duration-200 group flex flex-col justify-between",
                scenario === "surplus"
                  ? "border-[var(--accent)] bg-surface shadow-[var(--shadow-sm)] ring-1 ring-primary"
                  : "border-border bg-surface hover:bg-surface-soft"
              )}
            >
              <div>
                <span className="pill pill-healthy !text-[9px] mb-2">Scenario 04</span>
                <h4 className="font-sans text-sm font-bold text-foreground">P2P Microgrid Trade</h4>
                <p className="text-[11px] text-text-secondary mt-1">
                  Battery full. Excess solar dispatched to pediatric partner clinic via local bus.
                </p>
              </div>
              <span className="font-mono text-[10px] text-primary font-bold mt-4 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Simulate Scenario &rarr;
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. Direct Navigation Directory */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-12 bg-surface">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
            <div>
              <h3 className="font-sans text-lg font-bold text-foreground">
                SolarGrid Operating Console Directory
              </h3>
              <p className="text-xs text-text-secondary">
                Jump directly into any operational dashboard module
              </p>
            </div>
            <Link
              href="/overview"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Open Overview Console &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { href: "/overview", label: "Overview", desc: "Energy Control Center" },
              { href: "/energy", label: "Energy Analytics", desc: "PV & Demand Curves" },
              { href: "/critical-loads", label: "Critical Loads", desc: "Hospital EMS Priority" },
              { href: "/energy-sharing", label: "Energy Sharing", desc: "P2P Peer Trading" },
              { href: "/intelligence", label: "Decision Board", desc: "AI Forecasts & Dispatch" },
              { href: "/metering", label: "Metering & Ledger", desc: "Financial Settlement" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="p-3 rounded-lg border border-border bg-surface-soft/40 hover:bg-surface-soft hover:border-[var(--accent-soft)] transition-colors block text-left"
              >
                <span className="font-sans text-xs font-bold text-foreground block">
                  {item.label}
                </span>
                <span className="font-mono text-[10px] text-text-tertiary block mt-0.5 truncate">
                  {item.desc}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Public Landing Footer */}
      <footer className="w-full border-t border-border bg-surface-soft/60 px-4 sm:px-6 lg:px-12 py-8 mt-auto text-xs text-text-tertiary">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-sans font-bold text-foreground">SolarGrid</span>
              <span className="text-border">·</span>
              <span className="font-mono text-[11px]">Field Operating Layer</span>
              <span className="pill pill-healthy !text-[9px] !py-0">Indradhanu Edition</span>
            </div>
            <p className="text-[11px] text-text-secondary">
              Smart India Hackathon (SIH) Prototype · Apollo Care Campus, Pune · Distributed Renewable Microgrids.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
            <Link href="/overview" className="hover:text-foreground transition-colors">
              Live Console
            </Link>
            <Link href="/intro" className="hover:text-foreground transition-colors">
              3D Digital Twin
            </Link>
            <Link href="/settings" className="hover:text-foreground transition-colors">
              Settings &amp; Hotlines
            </Link>
            <a href="tel:+912026001234" className="hover:text-primary transition-colors flex items-center gap-1 font-mono">
              <Phone size={12} className="text-primary" />
              <span>+91 20 2600-1234</span>
            </a>
            <a href="mailto:ops@solargrid.hospital" className="hover:text-primary transition-colors flex items-center gap-1 font-mono">
              <Mail size={12} className="text-primary" />
              <span>ops@solargrid.hospital</span>
            </a>
          </div>

          <div className="font-mono text-[10px] text-text-tertiary">
            &copy; {new Date().getFullYear()} SolarGrid Technologies. MIT License.
          </div>
        </div>
      </footer>
    </div>
  );
}
