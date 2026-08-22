import { AlertTriangle, BrainCircuit, LayoutDashboard, Map, Zap } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/overview", label: "Control", icon: LayoutDashboard },
  { href: "/energy", label: "Energy", icon: Zap },
  { href: "/intelligence", label: "Intel", icon: BrainCircuit },
  { href: "/alerts", label: "Events", icon: AlertTriangle },
  { href: "/feature-1", label: "Metering", icon: Map },
];

export function MobileTabBar() {
  const [location] = useLocation();

  return (
    <nav className="mobile-tab-bar fixed inset-x-0 bottom-0 z-40 lg:hidden" aria-label="Primary navigation">
      {tabs.map(({ href, label, icon: Icon }) => {
        const selected = location === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn("mobile-tab", selected && "mobile-tab-active")}
          >
            <Icon size={18} strokeWidth={selected ? 2.2 : 1.6} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
