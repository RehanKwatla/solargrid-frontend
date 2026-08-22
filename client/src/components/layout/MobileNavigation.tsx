import { AlertTriangle, BrainCircuit, LayoutDashboard, Map, Settings, X, Zap } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { facility } from "@/data/mockData";
import { useTelemetry } from "@/contexts/SolarTrackingContext";

const links = [
  { href: "/overview", label: "Control", code: "01", icon: LayoutDashboard },
  { href: "/energy", label: "Energy", code: "02", icon: Zap },
  { href: "/intelligence", label: "Intelligence", code: "03", icon: BrainCircuit },
  { href: "/alerts", label: "Events", code: "04", icon: AlertTriangle },
  { href: "/feature-1", label: "Metering", code: "05", icon: Map },
];

export function MobileNavigation({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [location] = useLocation();
  const t = useTelemetry();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        aria-label="Close navigation"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="control-rail relative flex h-full w-[min(300px,88vw)] flex-col p-5 shadow-2xl">
        <div className="flex items-start justify-between">
          <Link href="/overview" onClick={onClose} className="flex items-center gap-3">
            <img
              src="/manus-storage/solargrid-mark_2db2ffdf.png"
              alt="SolarGrid"
              className="h-10 w-10 rounded-xl"
            />
            <span>
              <span className="brand-wordmark text-lg">
                solar<span>grid</span>
              </span>
              <span className="mt-0.5 block text-[10px] text-[#6d7874]">Smart energy platform</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/[.08] p-2 text-[#8a9692]"
          >
            <X size={17} />
          </button>
        </div>

        <nav className="mt-8 space-y-0.5">
          {links.map(({ href, label, code, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn("nav-instrument", location === href && "nav-instrument-active")}
            >
              <span className="nav-code">{code}</span>
              <Icon size={16} />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="facility-block mt-auto">
          <p className="text-sm font-medium text-[#e7ece9]">{facility.name}</p>
          <p className="facility-location mt-0.5">{facility.location}</p>
          <div className="mt-4 space-y-0">
            <div className="asset-status-row">
              <span className="system-online">System</span>
              <span className="text-xs text-[#8a9692]">Online</span>
            </div>
            <div className="asset-status-row">
              <span className="asset-id">PV-01</span>
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

        <button className="mt-4 flex items-center gap-3 px-2 py-2 text-sm text-[#6d7874]">
          <Settings size={16} />
          <span>Settings</span>
        </button>
      </aside>
    </div>
  );
}
