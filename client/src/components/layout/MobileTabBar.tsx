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
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around bg-surface/90 backdrop-blur-md border-t border-border pb-safe pt-1 lg:hidden" aria-label="Primary navigation">
      {tabs.map(({ href, label, icon: Icon }) => {
        const selected = location === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 min-w-[64px] py-2 px-1 transition-colors",
              selected ? "text-primary" : "text-text-secondary"
            )}
          >
            <div className={cn(
              "flex items-center justify-center rounded-full p-1",
              selected ? "bg-primary/10" : ""
            )}>
              <Icon size={20} strokeWidth={selected ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-semibold">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
