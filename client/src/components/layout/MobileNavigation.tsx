import { AlertTriangle, BrainCircuit, LayoutDashboard, Map, Settings, X, Zap } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { facility } from "@/data/mockData";
import { useTelemetry } from "@/contexts/SolarTrackingContext";

const links = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/energy", label: "Energy", icon: Zap },
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
      <aside className="relative flex h-full w-[min(300px,85vw)] flex-col bg-surface border-r border-border p-5 shadow-2xl transition-transform">
        <div className="flex items-center justify-between mb-8">
          <Link href="/overview" onClick={onClose} className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-sm">
              SG
            </div>
            <div>
              <span className="block font-sans text-lg font-bold tracking-tight text-foreground leading-tight">
                SolarGrid
              </span>
              <span className="block font-sans text-[11px] font-medium text-text-secondary">
                Energy Platform
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-soft text-text-secondary hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="space-y-1 flex-1">
          {links.map((item) => {
            const selected = location === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-3 font-sans text-sm font-medium transition-colors",
                  selected
                    ? "bg-primary/10 text-primary"
                    : "text-text-secondary hover:bg-surface-soft hover:text-foreground"
                )}
              >
                <Icon size={18} strokeWidth={selected ? 2.5 : 2} className="shrink-0" />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={cn(
                      "ml-auto flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                      selected ? "bg-primary text-primary-foreground" : "bg-danger text-white"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl bg-surface-soft p-4">
          <p className="font-sans text-sm font-semibold text-foreground">
            {facility.name}
          </p>
          <p className="font-sans text-xs font-medium text-text-secondary mt-0.5 mb-4">
            {facility.location}
          </p>

          <div className="space-y-2 border-t border-border/50 pt-3">
            <div className="flex justify-between items-center font-sans text-xs">
              <span className="text-text-secondary font-medium">System</span>
              <span className="flex items-center gap-1.5 text-success font-medium">
                <span className="status-dot healthy"></span> Online
              </span>
            </div>
            <div className="flex justify-between items-center font-sans text-xs">
              <span className="text-text-secondary font-medium">Solar PV</span>
              <span className="text-foreground font-semibold">{t.solarKw.toFixed(1)} kW</span>
            </div>
            <div className="flex justify-between items-center font-sans text-xs">
              <span className="text-text-secondary font-medium">Battery</span>
              <span className="text-foreground font-semibold">{t.batterySoc}%</span>
            </div>
          </div>
        </div>

        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-surface border border-border px-4 py-3 text-sm font-semibold text-text-secondary transition-colors hover:bg-surface-soft hover:text-foreground">
          <Settings size={16} />
          <span>Settings</span>
        </button>
      </aside>
    </div>
  );
}
