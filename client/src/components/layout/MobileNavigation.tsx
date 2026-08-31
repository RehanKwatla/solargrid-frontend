import { AlertTriangle, ArrowLeftRight, BrainCircuit, LayoutDashboard, Map, Settings, X, Zap } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { facility } from "@/data/mockData";
import { useTelemetry } from "@/contexts/SolarTrackingContext";

const links = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/energy", label: "Energy", icon: Zap },
  { href: "/energy-sharing", label: "Energy Sharing", icon: ArrowLeftRight },
  { href: "/intelligence", label: "Intelligence", icon: BrainCircuit },
  { href: "/alerts", label: "Events", icon: AlertTriangle, badge: "3" },
  { href: "/feature-1", label: "Metering", icon: Map },
];

export function MobileNavigation({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [location] = useLocation();
  const t = useTelemetry();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        aria-label="Close navigation"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <aside className="relative flex h-full w-[min(280px,85vw)] flex-col bg-surface border-r border-border p-4 shadow-2xl transition-transform">
        <div className="flex items-center justify-between mb-6">
          <Link href="/overview" onClick={onClose} className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-sm">
              SG
            </div>
            <div>
              <span className="block font-sans text-[0.95rem] font-bold tracking-tight text-foreground leading-tight">
                SolarGrid
              </span>
              <span className="block font-mono text-[9px] font-medium text-text-tertiary tracking-wide">
                Energy Platform
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-soft text-text-tertiary hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="space-y-0.5 flex-1">
          {links.map((item) => {
            const selected = location === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 font-sans text-[0.84rem] font-medium transition-colors",
                  selected
                    ? "bg-[var(--accent-bg)] text-[var(--accent-strong)]"
                    : "text-text-secondary hover:bg-surface-soft hover:text-foreground"
                )}
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
        </nav>

        <div className="mt-auto rounded-lg bg-surface-soft p-3.5 border border-border/50">
          <p className="font-sans text-[0.84rem] font-semibold text-foreground">
            {facility.name}
          </p>
          <p className="font-mono text-[9px] font-medium text-text-tertiary mt-0.5 mb-3 tracking-wide">
            {facility.location}
          </p>

          <div className="space-y-1.5 border-t border-border/50 pt-2.5">
            <div className="flex justify-between items-center text-[0.75rem]">
              <span className="text-text-tertiary font-medium">System</span>
              <span className="flex items-center gap-1.5 text-[var(--healthy)] font-medium">
                <span className="status-dot healthy" style={{ width: 5, height: 5 }}></span> Online
              </span>
            </div>
            <div className="flex justify-between items-center text-[0.75rem]">
              <span className="text-text-tertiary font-medium">Solar PV</span>
              <span className="text-foreground font-semibold tabular-nums">{t.solarKw.toFixed(1)} kW</span>
            </div>
            <div className="flex justify-between items-center text-[0.75rem]">
              <span className="text-text-tertiary font-medium">Battery</span>
              <span className="text-foreground font-semibold tabular-nums">{t.batterySoc}%</span>
            </div>
          </div>
        </div>

        <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-surface border border-border px-4 py-2.5 text-[0.81rem] font-semibold text-text-tertiary transition-colors hover:bg-surface-soft hover:text-foreground">
          <Settings size={15} />
          <span>Settings</span>
        </button>
      </aside>
    </div>
  );
}
