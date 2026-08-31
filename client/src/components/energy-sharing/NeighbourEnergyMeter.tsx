import { useDashboardData } from "@/contexts/DashboardDataContext";
import { cn } from "@/lib/utils";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  BatteryCharging,
  Building2,
  CheckCircle2,
  Hospital,
  SunMedium,
  Zap,
} from "lucide-react";

export function NeighbourEnergyMeter() {
  const { telemetry, energySharing, energyPeers } = useDashboardData();

  const solarGenerationKw = telemetry?.solar_generation_kw ?? 42.5;
  const hospitalDemandKw = telemetry?.total_load_kw ?? 51.2;
  const criticalLoadKw = telemetry?.critical_load_kw ?? 30.4;
  const availableSurplusKwh = energySharing?.available_energy_kwh ?? 142.8;
  const netSurplusKw = Math.max(0, solarGenerationKw - criticalLoadKw);

  return (
    <div className="w-full min-w-0 border border-border bg-surface rounded-lg p-4 sm:p-6 space-y-6">
      {/* Title & Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[0.68rem] font-semibold tracking-[0.12em] uppercase text-text-tertiary">
              Visual Power Dispatch Flow
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--healthy-bg)] px-2 py-0.5 font-mono text-[9px] font-medium text-[var(--healthy)] border border-[var(--healthy-ring)]/30">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--healthy)] animate-pulse" />
              Live Microgrid Bus
            </span>
          </div>
          <h3 className="font-sans text-lg font-bold tracking-tight text-foreground mt-0.5">
            Neighbour & Microgrid Energy Meter
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="font-mono text-[0.62rem] text-text-tertiary uppercase block">
              Surplus for Sharing
            </span>
            <span className="font-sans text-lg font-bold text-[var(--healthy)] tabular-nums">
              {availableSurplusKwh.toFixed(1)} kWh
            </span>
          </div>
        </div>
      </div>

      {/* 4-Stage Vertical/Horizontal Cascade Meter Flow */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
        {/* Stage 1: Solar Generation */}
        <div className="border border-[var(--accent-soft)] bg-surface-soft/40 p-4 rounded-lg flex flex-col justify-between relative group hover:border-[var(--accent)] transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--accent-bg)] text-[var(--accent-strong)]">
                <SunMedium size={16} />
              </div>
              <span className="font-mono text-[0.68rem] font-bold text-foreground">
                STAGE 01
              </span>
            </div>
            <span className="pill pill-healthy !text-[9px] !py-0.5">PV Active</span>
          </div>
          <div>
            <p className="font-mono text-[0.65rem] text-text-secondary uppercase">
              Solar Generation
            </p>
            <p className="font-sans text-2xl font-bold tracking-tight text-foreground tabular-nums mt-0.5">
              {solarGenerationKw.toFixed(1)} <span className="text-xs font-mono font-medium text-text-tertiary">kW</span>
            </p>
            <p className="text-[0.72rem] text-text-tertiary mt-1">
              Field Array 01 output
            </p>
          </div>
        </div>

        {/* Stage 2: Hospital Demand */}
        <div className="border border-border bg-surface-soft/40 p-4 rounded-lg flex flex-col justify-between relative group hover:border-border transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-surface text-text-secondary border border-border">
                <Hospital size={16} />
              </div>
              <span className="font-mono text-[0.68rem] font-bold text-foreground">
                STAGE 02
              </span>
            </div>
            <span className="pill pill-muted !text-[9px] !py-0.5">Protected</span>
          </div>
          <div>
            <p className="font-mono text-[0.65rem] text-text-secondary uppercase">
              Hospital Demand
            </p>
            <p className="font-sans text-2xl font-bold tracking-tight text-foreground tabular-nums mt-0.5">
              {hospitalDemandKw.toFixed(1)} <span className="text-xs font-mono font-medium text-text-tertiary">kW</span>
            </p>
            <p className="text-[0.72rem] text-text-tertiary mt-1">
              ICU & campus load
            </p>
          </div>
        </div>

        {/* Stage 3: Surplus Energy */}
        <div className="border border-[var(--healthy-ring)]/40 bg-[var(--healthy-bg)]/20 p-4 rounded-lg flex flex-col justify-between relative group hover:border-[var(--healthy)] transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--healthy-bg)] text-[var(--healthy)] border border-[var(--healthy-ring)]/40">
                <BatteryCharging size={16} />
              </div>
              <span className="font-mono text-[0.68rem] font-bold text-[var(--healthy)]">
                STAGE 03
              </span>
            </div>
            <span className="pill pill-healthy !text-[9px] !py-0.5">Absorbing</span>
          </div>
          <div>
            <p className="font-mono text-[0.65rem] text-[var(--healthy)] uppercase font-semibold">
              Surplus Energy
            </p>
            <p className="font-sans text-2xl font-bold tracking-tight text-foreground tabular-nums mt-0.5">
              +{netSurplusKw.toFixed(1)} <span className="text-xs font-mono font-medium text-text-tertiary">kW</span>
            </p>
            <p className="text-[0.72rem] text-text-tertiary mt-1">
              BESS fully buffered
            </p>
          </div>
        </div>

        {/* Stage 4: Available for Sharing */}
        <div className="border border-[var(--accent)] bg-primary text-primary-foreground p-4 rounded-lg flex flex-col justify-between relative shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/20 text-white">
                <Zap size={16} />
              </div>
              <span className="font-mono text-[0.68rem] font-bold text-white/90">
                STAGE 04
              </span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 font-mono text-[9px] font-semibold text-white">
              Ready
            </span>
          </div>
          <div>
            <p className="font-mono text-[0.65rem] text-white/80 uppercase font-medium">
              Available for Sharing
            </p>
            <p className="font-sans text-3xl font-bold tracking-tight text-white tabular-nums mt-0.5">
              {availableSurplusKwh.toFixed(1)} <span className="text-sm font-mono font-semibold text-white/80">kWh</span>
            </p>
            <p className="text-[0.72rem] text-white/70 mt-1">
              Market-clearing reserve
            </p>
          </div>
        </div>
      </div>

      {/* Connected Microgrid Peers Feeders */}
      <div className="pt-2 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-text-tertiary">
            Active Microgrid Interconnects & Demand Feeds
          </span>
          <span className="font-mono text-[0.65rem] text-text-tertiary">
            {energyPeers.length} Nodes Online
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {energyPeers.map((peer) => (
            <div
              key={peer.id}
              className="flex items-center justify-between p-2.5 rounded-md border border-border bg-surface-soft/30 hover:bg-surface-soft/60 transition-colors"
            >
              <div className="min-w-0 pr-2">
                <p className="font-sans text-[0.8rem] font-semibold text-foreground truncate">
                  {peer.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-[0.62rem] text-text-tertiary">
                    {peer.distance_km} km away
                  </span>
                  <span className="text-text-tertiary">·</span>
                  <span className="font-mono text-[0.62rem] font-medium text-[var(--accent-strong)]">
                    ₹{peer.current_rate_inr.toFixed(2)}/kWh
                  </span>
                </div>
              </div>

              <span
                className={cn(
                  "pill shrink-0 !text-[9px] !py-0.5 !px-1.5",
                  peer.demand_status === "Critical"
                    ? "pill-danger"
                    : peer.demand_status === "High Demand"
                    ? "pill-warning"
                    : "pill-healthy"
                )}
              >
                {peer.demand_status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
