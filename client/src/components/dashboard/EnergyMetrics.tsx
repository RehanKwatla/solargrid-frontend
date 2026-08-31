import { useDashboardData } from "@/contexts/DashboardDataContext";
import { useTelemetry } from "@/contexts/SolarTrackingContext";
import { assets } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Battery, Zap, AlertTriangle, ShieldCheck, Banknote } from "lucide-react";
import { ValueNA } from "@/components/common/DataState";

export function EnergyMetrics() {
  const { telemetry: dbTelemetry, telemetryStatus } = useDashboardData();
  const simTelemetry = useTelemetry();

  // Prefer live Supabase data, fall back to simulation telemetry
  const t = telemetryStatus.kind === "live" && dbTelemetry
    ? {
        solarKw: dbTelemetry.solar_generation_kw ?? 0,
        gridKw: dbTelemetry.grid_import_kw ?? 0,
        batterySoc: dbTelemetry.battery_soc_percent ?? 0,
        batteryKw: dbTelemetry.battery_charge_kw ?? dbTelemetry.battery_discharge_kw ?? 0,
        loadKw: dbTelemetry.total_load_kw ?? 0,
        criticalLoadKw: dbTelemetry.critical_load_kw ?? 0,
        estimatedSavingsInr: dbTelemetry.estimated_savings_inr ?? 0,
        gridConnected: dbTelemetry.grid_connected ?? false,
      }
    : simTelemetry;

  const na = telemetryStatus.kind === "unavailable";

  const supporting: Array<{
    assetId?: string;
    label: string;
    value: string;
    sub: string;
    accent?: boolean;
    icon: any;
    colorClass: string;
  }> = [
    {
      assetId: assets.bess01.id,
      label: "Battery reserve",
      value: na ? "—" : `${t.batterySoc}%`,
      sub: na ? "N/A" : t.batteryKw > 0 ? `+${t.batteryKw} kW` : `${t.batteryKw} kW`,
      icon: Battery,
      colorClass: "text-[var(--healthy)]",
    },
    {
      assetId: assets.grid01.id,
      label: "Grid inlet",
      value: na ? "—" : `${t.gridKw.toFixed(1)} kW`,
      sub: na ? "N/A" : t.gridConnected ? "Connected" : "Offline",
      icon: Zap,
      colorClass: "text-text-tertiary",
    },
    {
      assetId: "LOAD",
      label: "Facility load",
      value: na ? "—" : `${t.loadKw.toFixed(1)} kW`,
      sub: "All tiers",
      icon: AlertTriangle,
      colorClass: "text-[var(--warning)]",
    },
    {
      assetId: assets.loadT1.id,
      label: "Critical load",
      value: na ? "—" : `${t.criticalLoadKw.toFixed(1)} kW`,
      sub: "Protected",
      icon: ShieldCheck,
      colorClass: "text-[var(--accent)]",
    },
    {
      label: "Avoided cost",
      value: na ? "—" : `₹${t.estimatedSavingsInr.toLocaleString()}`,
      sub: telemetryStatus.kind === "live" ? "Today" : "Today · simulated",
      accent: true,
      icon: Banknote,
      colorClass: "text-[var(--healthy)]",
    },
  ];

  return (
    <div className="w-full min-w-0">
      <div className="grid gap-0 w-full min-w-0 border border-border rounded-lg overflow-hidden lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)] items-stretch">
        {/* Hero metric */}
        <div className="bg-primary text-primary-foreground p-5 sm:p-6 lg:p-7 flex flex-col justify-between min-w-0 w-full">
          <div className="min-w-0 w-full">
            <div className="inline-flex items-center border border-white/25 bg-white/10 px-2 py-0.5 font-mono text-[9px] font-medium tracking-[.08em] mb-5 shrink-0 whitespace-nowrap">
              {assets.pv01.id}
            </div>
            <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-none whitespace-nowrap tabular-nums">
              {na ? (
                <ValueNA className="!text-primary-foreground !opacity-50" />
              ) : (
                <>
                  {t.solarKw.toFixed(1)}
                  <span className="ml-1 sm:ml-1.5 text-xl sm:text-2xl md:text-3xl font-semibold opacity-80">
                    kW
                  </span>
                </>
              )}
            </p>
          </div>
          <div className="mt-5 sm:mt-7 border-t border-white/15 pt-3">
            <p className="text-[0.81rem] font-medium opacity-80">Solar generation</p>
          </div>
        </div>

        {/* Supporting metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 w-full min-w-0">
          {supporting.map((item) => (
            <div
              key={item.label}
              className="border-b border-r border-border bg-surface-soft/40 p-3 sm:p-3.5 flex flex-col justify-between transition-colors hover:bg-surface-soft group min-w-0 w-full last:border-r-0"
            >
              <div className="min-w-0 w-full">
                <div className="flex items-center justify-between mb-2.5 gap-2 w-full min-w-0">
                  {item.assetId ? (
                    <span className="inline-flex items-center border border-border bg-surface px-1.5 py-0.5 font-mono text-[8px] font-medium text-text-tertiary shrink-0 whitespace-nowrap truncate">
                      {item.assetId}
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-text-tertiary invisible shrink-0">
                      N/A
                    </span>
                  )}
                  <item.icon size={14} className={cn(item.colorClass, "shrink-0")} />
                </div>
                <span className="text-[0.68rem] font-medium text-text-secondary truncate block">
                  {item.label}
                </span>
              </div>

              <div className="mt-2 min-w-0">
                <span
                  className={cn(
                    "text-lg sm:text-xl font-bold block leading-none whitespace-nowrap tabular-nums",
                    item.accent ? "text-[var(--healthy)]" : "text-foreground"
                  )}
                >
                  {item.value}
                </span>
                <span className="text-[0.68rem] text-text-tertiary font-medium mt-1 block truncate">
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
