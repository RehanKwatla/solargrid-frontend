import { AlertTriangle, BrainCircuit, ChevronRight, LayoutDashboard, Map, Settings, Zap } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { facility, mockTelemetry } from "@/data/mockData";
import { useTelemetry } from "@/contexts/SolarTrackingContext";

const navigation = [
  { href: "/overview", label: "Control", icon: LayoutDashboard, code: "01" },
  { href: "/energy", label: "Energy", icon: Zap, code: "02" },
  { href: "/intelligence", label: "Intelligence", icon: BrainCircuit, code: "03" },
  { href: "/alerts", label: "Events", icon: AlertTriangle, code: "04", badge: "3" },
  { href: "/feature-1", label: "Metering", icon: Map, code: "05" },
];

export function AppSidebar() {
  const [location] = useLocation();
  const t = useTelemetry();

  return (
    <aside className="control-rail sticky top-0 z-30 hidden h-screen w-[260px] shrink-0 flex-col px-4 py-5 lg:flex">
      {/* Brand */}
      <Link href="/overview" className="brand-anchor">
        <span className="brand-mark-shell">
          <img
            src="/manus-storage/solargrid-mark_2db2ffdf.png"
            alt="SolarGrid"
            className="h-11 w-11 rounded-xl"
          />
        </span>
        <span>
          <span className="brand-wordmark text-[22px]">
            solar<span>grid</span>
          </span>
          <span className="mt-1 block text-[10px] tracking-wide text-[#6d7874]">
            Smart energy platform
          </span>
        </span>
      </Link>

      {/* Navigation */}
      <nav className="mt-8 space-y-0.5">
        {navigation.map((item) => {
          const selected = location === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "nav-instrument",
                selected && "nav-instrument-active"
              )}
            >
              <span className="nav-code">{item.code}</span>
              <Icon size={16} strokeWidth={selected ? 2.2 : 1.7} />
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    "ml-auto font-mono text-[10px]",
                    selected ? "text-[#0c1110]/60" : "text-[#c47060]"
                  )}
                >
                  {item.badge}
                </span>
              )}
              <ChevronRight size={12} className="ml-auto opacity-0" />
            </Link>
          );
        })}
      </nav>

      {/* Facility block */}
      <div className="facility-block mt-auto">
        <p className="text-sm font-medium text-[#e7ece9]">{facility.name}</p>
        <p className="facility-location mt-0.5">{facility.location}</p>

        <div className="mt-4 space-y-0">
          <div className="asset-status-row">
            <span className="system-online">System</span>
            <span className="text-xs text-[#8a9692]">Online</span>
          </div>
          <div className="asset-status-row">
            <span className="asset-id">{mockTelemetry.site ? "PV-01" : ""}</span>
            <span className="text-sm text-[#e7ece9]">{t.solarKw.toFixed(1)} kW</span>
          </div>
          <div className="asset-status-row">
            <span className="asset-id">BESS-01</span>
            <span className="text-sm text-[#e7ece9]">{t.batterySoc}%</span>
          </div>
          <div className="asset-status-row">
            <span className="asset-id">GRID-01</span>
            <span className="text-sm text-[#e7ece9]">
              {t.gridConnected ? "Connected" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      <button className="mt-4 flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-[#6d7874] transition hover:bg-white/[.04] hover:text-[#e7ece9]">
        <Settings size={16} />
        <span>Settings</span>
      </button>
    </aside>
  );
}
