import {
  AlertTriangle,
  ArrowLeftRight,
  BrainCircuit,
  Compass,
  LayoutDashboard,
  Mail,
  Map,
  Moon,
  Phone,
  Settings,
  ShieldAlert,
  Sun,
  X,
  Zap,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { facility } from "@/data/mockData";
import { useTelemetry } from "@/contexts/SolarTrackingContext";
import { useTheme } from "@/contexts/ThemeContext";

const links = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/energy", label: "Energy Monitoring", icon: Zap },
  { href: "/critical-loads", label: "Critical Loads", icon: ShieldAlert },
  { href: "/energy-sharing", label: "Energy Sharing", icon: ArrowLeftRight },
  { href: "/intelligence", label: "Forecasting & Optimization", icon: BrainCircuit },
  { href: "/alerts", label: "Events & Alerts", icon: AlertTriangle, badge: "3" },
  { href: "/metering", label: "Metering & Reports", icon: Map },
  { href: "/settings", label: "System Settings", icon: Settings },
];

export function MobileNavigation({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [location] = useLocation();
  const t = useTelemetry();
  const { theme, toggleTheme } = useTheme();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
    >
      {/* Backdrop */}
      <button
        aria-label="Close navigation overlay"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <aside className="relative flex h-full w-[min(300px,85vw)] flex-col bg-surface border-r border-border p-4 shadow-2xl transition-transform overflow-y-auto">
        {/* Header with Clickable Logo (Requirement 17) */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-border">
          <Link
            href="/overview"
            onClick={onClose}
            className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--accent-soft)] bg-surface-soft p-1 shadow-sm">
              <img src="/favicon.svg" alt="SolarGrid Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <span className="block font-sans text-[0.95rem] font-bold tracking-tight text-foreground leading-tight">
                SolarGrid
              </span>
              <span className="block font-mono text-[9px] font-medium text-text-tertiary tracking-wide">
                Operations · {facility.code}
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-soft text-text-tertiary hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1 flex-1">
          {links.map((item) => {
            const selected = location === item.href || (item.href === "/metering" && location === "/feature-1");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 font-sans text-[0.84rem] font-medium transition-colors",
                  selected
                    ? "bg-[var(--accent-bg)] text-[var(--accent-strong)] font-semibold shadow-[inset_0_0_0_1px_var(--accent-soft)]"
                    : "text-text-secondary hover:bg-surface-soft hover:text-foreground"
                )}
                aria-current={selected ? "page" : undefined}
              >
                <Icon size={17} strokeWidth={selected ? 2.5 : 2} className="shrink-0" />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={cn(
                      "ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold tabular-nums",
                      selected ? "bg-[var(--accent)] text-primary-foreground" : "bg-[var(--danger)] text-white"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Public Landing & 3D Twin Experience */}
          <div className="pt-2 border-t border-border/60 space-y-1">
            <Link
              href="/"
              onClick={onClose}
              className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 font-sans text-[0.84rem] font-medium text-text-tertiary hover:bg-surface-soft hover:text-foreground transition-colors"
            >
              <LayoutDashboard size={17} className="shrink-0 text-[var(--accent)]" />
              <span>Public Landing Page</span>
            </Link>
            <Link
              href="/intro"
              onClick={onClose}
              className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 font-sans text-[0.84rem] font-medium text-text-tertiary hover:bg-surface-soft hover:text-foreground transition-colors"
            >
              <Compass size={17} className="shrink-0 text-primary" />
              <span>3D Digital Twin</span>
            </Link>
          </div>
        </nav>

        {/* Live Facility Telemetry Card */}
        <div className="mt-4 rounded-lg bg-surface-soft/80 p-3 border border-border/60">
          <div className="flex items-start justify-between gap-1 mb-1.5">
            <div>
              <p className="font-sans text-[0.82rem] font-bold text-foreground leading-tight">
                {facility.name}
              </p>
              <p className="font-mono text-[9px] font-medium text-text-tertiary tracking-wide">
                {facility.location}
              </p>
            </div>
            <span className="pill pill-healthy !text-[9px] !py-0.5">Online</span>
          </div>

          <div className="space-y-1.5 border-t border-border/50 pt-2">
            <div className="flex justify-between items-center text-[0.75rem]">
              <span className="text-text-tertiary font-medium">Solar Generation</span>
              <span className="text-foreground font-semibold tabular-nums">{t.solarKw.toFixed(1)} kW</span>
            </div>
            <div className="flex justify-between items-center text-[0.75rem]">
              <span className="text-text-tertiary font-medium">Battery Storage</span>
              <span className="text-foreground font-semibold tabular-nums">{t.batterySoc}%</span>
            </div>
            <div className="flex justify-between items-center text-[0.75rem]">
              <span className="text-text-tertiary font-medium">Grid Status</span>
              <span className={cn("font-medium", Math.abs(t.gridKw) > 0.1 ? "text-primary" : "text-text-secondary")}>
                {t.gridConnected ? `${t.gridKw.toFixed(1)} kW` : "Islanded"}
              </span>
            </div>
          </div>
        </div>

        {/* Emergency Hotline (Requirements 18 & 19) */}
        <div className="mt-3 p-2.5 rounded-lg border border-border bg-surface text-center space-y-1">
          <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-text-tertiary block">
            Emergency Desk
          </span>
          <div className="flex items-center justify-center gap-3">
            <a
              href="tel:+912026001234"
              className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-primary hover:underline"
            >
              <Phone size={11} />
              <span>Call Ops</span>
            </a>
            <span className="text-border">·</span>
            <a
              href="mailto:ops@solargrid.hospital"
              className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-text-secondary hover:underline"
            >
              <Mail size={11} />
              <span>Email</span>
            </a>
          </div>
        </div>

        {/* Bottom Actions: Theme Toggle & Settings */}
        <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
          {toggleTheme && (
            <button
              onClick={toggleTheme}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-soft hover:text-foreground transition-colors"
              aria-label="Toggle light or dark theme"
            >
              {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
              <span>{theme === "light" ? "Dark" : "Light"}</span>
            </button>
          )}

          <Link
            href="/settings"
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-soft hover:text-foreground transition-colors"
          >
            <Settings size={14} />
            <span>Settings</span>
          </Link>
        </div>
      </aside>
    </div>
  );
}
