import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Compass,
  FileQuestion,
  Home,
  LayoutDashboard,
  Zap,
} from "lucide-react";
import { Link, useLocation } from "wouter";

/** Branded SolarGrid 404 page consistent with the operational console aesthetic. */
export default function NotFound() {
  const [location, setLocation] = useLocation();

  const quickLinks = [
    { href: "/overview", label: "Overview", desc: "Live generation & bus diagram" },
    { href: "/energy", label: "Energy Analytics", desc: "Production & demand curves" },
    { href: "/critical-loads", label: "Critical Loads", desc: "Hospital EMS circuit control" },
    { href: "/energy-sharing", label: "Energy Sharing", desc: "P2P microgrid trading" },
    { href: "/intelligence", label: "Decision Board", desc: "AI forecasts & dispatch rules" },
    { href: "/alerts", label: "Events Log", desc: "Attention logs & alerts" },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-140px)] flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-2xl">
        <div className="rounded-xl border border-border bg-surface p-6 sm:p-10 shadow-[var(--shadow-md)] relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[var(--danger)]/5 blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left mb-6">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-[var(--danger)]/15 rounded-xl animate-ping" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-xl border border-[var(--danger-ring)]/40 bg-[var(--danger-bg)] text-[var(--danger)] shadow-sm">
                <AlertTriangle size={32} />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-surface-soft px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary mb-2 border border-border">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--danger)]" />
                Error Code 404 · Unresolved Feeder
              </div>
              <h1 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Page Not Found
              </h1>
              <p className="mt-1.5 text-sm text-text-secondary">
                The requested path{" "}
                <code className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-surface-soft border border-border text-foreground">
                  {location}
                </code>{" "}
                does not exist or has been relocated within the SolarGrid operating layer.
              </p>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 pb-6 border-b border-border">
            <button
              type="button"
              onClick={() => setLocation("/overview")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-sans text-xs font-semibold text-primary-foreground shadow-[var(--shadow-sm)] hover:opacity-95 transition-all"
            >
              <LayoutDashboard size={15} />
              <span>Return to Dashboard Overview</span>
            </button>

            <button
              type="button"
              onClick={() => setLocation("/")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 font-sans text-xs font-semibold text-foreground hover:bg-surface-soft transition-all"
            >
              <Compass size={15} />
              <span>Launch 3D Digital Twin</span>
            </button>
          </div>

          {/* Quick Route Directory */}
          <div className="mt-6">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-text-tertiary mb-3">
              Direct System Navigation:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {quickLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center justify-between p-2.5 rounded-lg border border-border bg-surface-soft/40 hover:bg-surface-soft hover:border-[var(--accent-soft)] transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-sans text-xs font-semibold text-foreground group-hover:text-primary transition-colors block">
                      {item.label}
                    </span>
                    <span className="font-mono text-[10px] text-text-tertiary truncate block">
                      {item.desc}
                    </span>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-text-tertiary group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Assistance */}
          <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-2 text-[11px] text-text-tertiary">
            <span>SolarGrid Operations · Node SG-ACC-01</span>
            <a
              href="mailto:ops@solargrid.hospital"
              className="text-primary hover:underline font-mono text-[11px]"
            >
              Contact Operations Desk
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
