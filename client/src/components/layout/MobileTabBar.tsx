import { AlertTriangle, BrainCircuit, LayoutDashboard, Map, Zap } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/energy", label: "Energy", icon: Zap },
  { href: "/intelligence", label: "Intel", icon: BrainCircuit },
  { href: "/alerts", label: "Events", icon: AlertTriangle },
  { href: "/feature-1", label: "Metering", icon: Map },
];

export function MobileTabBar() {
  const [location] = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around bg-surface/95 backdrop-blur-md border-t border-border pb-safe lg:hidden" aria-label="Primary navigation">
      {tabs.map(({ href, label, icon: Icon }) => {
        const selected = location === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 min-w-[60px] py-1.5 px-1 transition-colors",
              selected ? "text-[var(--accent)]" : "text-text-tertiary"
            )}
          >
            <div className={cn(
              "flex items-center justify-center rounded-lg p-1 transition-colors",
              selected ? "bg-[var(--accent-bg)]" : ""
            )}>
              <Icon size={18} strokeWidth={selected ? 2.5 : 2} />
            </div>
            <span className="text-[9px] font-semibold leading-tight">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
