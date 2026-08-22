import { useTelemetry } from "@/contexts/SolarTrackingContext";
import { assets } from "@/data/mockData";
import { cn } from "@/lib/utils";

/** Hierarchical energy metrics — hero solar + supporting telemetry, no identical cards. */
export function EnergyMetrics() {
  const t = useTelemetry();

  const supporting: Array<{
    assetId?: string;
    label: string;
    value: string;
    sub: string;
    accent?: boolean;
  }> = [
    { assetId: assets.bess01.id, label: "Battery reserve", value: `${t.batterySoc}%`, sub: t.batteryKw > 0 ? `+${t.batteryKw} kW` : `${t.batteryKw} kW` },
    { assetId: assets.grid01.id, label: "Grid inlet", value: `${t.gridKw.toFixed(1)} kW`, sub: t.gridConnected ? "Connected" : "Offline" },
    { assetId: "LOAD", label: "Facility load", value: `${t.loadKw.toFixed(1)} kW`, sub: "All tiers" },
    { assetId: assets.loadT1.id, label: "Critical load", value: `${t.criticalLoadKw.toFixed(1)} kW`, sub: "Protected" },
    { label: "Avoided cost", value: "₹1,240", sub: "Today · simulated", accent: true },
  ];

  return (
    <section className="open-section">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:gap-12">
        {/* Hero metric */}
        <div>
          <p className="asset-id asset-id-active">{assets.pv01.id}</p>
          <p className="metric-hero-value metric-hero-value-accent mt-1">
            {t.solarKw.toFixed(1)}
            <span className="ml-2 text-xl font-normal text-[#6d7874]">kW</span>
          </p>
          <p className="mt-1 text-sm text-[#8a9692]">Solar generation</p>
        </div>

        {/* Supporting metrics */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-0 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
          {supporting.map((item) => (
            <div key={item.label} className="metric-support">
              {"assetId" in item && item.assetId ? (
                <span className="asset-id">{item.assetId}</span>
              ) : null}
              <span className={cn("metric-support-value", item.accent && "text-[#c8e64a]")}>
                {item.value}
              </span>
              <span className="text-xs text-[#6d7874]">{item.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
