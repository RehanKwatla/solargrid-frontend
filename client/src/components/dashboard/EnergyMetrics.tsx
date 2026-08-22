import { useTelemetry } from "@/contexts/SolarTrackingContext";
import { assets } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Battery, Zap, AlertTriangle, ShieldCheck, Banknote } from "lucide-react";

export function EnergyMetrics() {
  const t = useTelemetry();

  const supporting: Array<{
    assetId?: string;
    label: string;
    value: string;
    sub: string;
    accent?: boolean;
    icon: any;
    colorClass: string;
  }> = [
    { assetId: assets.bess01.id, label: "Battery reserve", value: `${t.batterySoc}%`, sub: t.batteryKw > 0 ? `+${t.batteryKw} kW` : `${t.batteryKw} kW`, icon: Battery, colorClass: "text-healthy" },
    { assetId: assets.grid01.id, label: "Grid inlet", value: `${t.gridKw.toFixed(1)} kW`, sub: t.gridConnected ? "Connected" : "Offline", icon: Zap, colorClass: "text-text-secondary" },
    { assetId: "LOAD", label: "Facility load", value: `${t.loadKw.toFixed(1)} kW`, sub: "All tiers", icon: AlertTriangle, colorClass: "text-warning" },
    { assetId: assets.loadT1.id, label: "Critical load", value: `${t.criticalLoadKw.toFixed(1)} kW`, sub: "Protected", icon: ShieldCheck, colorClass: "text-accent" },
    { label: "Avoided cost", value: "₹1,240", sub: "Today · simulated", accent: true, icon: Banknote, colorClass: "text-healthy" },
  ];

  return (
    <div className="w-full">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_2fr] items-stretch">
        {/* Hero metric */}
        <div className="rounded-2xl border border-transparent bg-primary text-primary-foreground shadow-md p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold mb-6">
              {assets.pv01.id}
            </div>
            <p className="text-6xl md:text-7xl font-bold tracking-tighter leading-none">
              {t.solarKw.toFixed(1)}
              <span className="ml-2 text-3xl md:text-4xl font-semibold opacity-90">kW</span>
            </p>
          </div>
          <div className="mt-8 border-t border-white/20 pt-4">
            <p className="text-sm font-semibold opacity-90">
              Solar generation
            </p>
          </div>
        </div>

        {/* Supporting metrics */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {supporting.map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-surface-soft p-4 flex flex-col justify-between hover:bg-surface hover:shadow-sm transition-all group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  {item.assetId ? (
                    <span className="inline-flex items-center rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold text-text-secondary border border-border">
                      {item.assetId}
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-text-secondary invisible">N/A</span>
                  )}
                  <item.icon size={16} className={item.colorClass} />
                </div>
                <span className="text-xs font-semibold text-text-secondary">
                  {item.label}
                </span>
              </div>
              
              <div className="mt-3">
                <span className={cn("text-2xl font-bold block leading-none", item.accent ? "text-healthy" : "text-foreground")}>
                  {item.value}
                </span>
                <span className="text-xs text-text-secondary font-medium mt-1.5 block">
                  {item.sub}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
