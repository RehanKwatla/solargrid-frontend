import { operatingState, assets } from "@/data/mockData";
import { useTelemetry } from "@/contexts/SolarTrackingContext";
import { cn } from "@/lib/utils";

/** Live power flow — energy bus topology with animated flow paths. */
export function PowerFlow() {
  const t = useTelemetry();
  const solarActive = t.solarKw > 0;
  const batteryCharging = t.batteryKw > 0;
  const gridImporting = t.gridKw > 0 && t.gridConnected;

  return (
    <section className="open-section">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="asset-id asset-id-active">Live power flow</p>
          <h2 className="section-heading mt-1">Energy allocation</h2>
        </div>
        <span className="system-online">Live</span>
      </div>

      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#8a9692]">
        {operatingState.modeDetail}
      </p>

      {/* Desktop: bus topology */}
      <div className="mt-8 hidden lg:block">
        <div className="relative">
          {/* Sources row */}
          <div className="flex items-start justify-center gap-16">
            <SourceNode
              assetId={assets.pv01.id}
              label="Solar array"
              value={`${t.solarKw.toFixed(1)} kW`}
              active={solarActive}
            />
            <SourceNode
              assetId={assets.grid01.id}
              label="Grid inlet"
              value={`${t.gridKw.toFixed(1)} kW`}
              active={gridImporting}
              variant="grid"
            />
          </div>

          {/* SVG connectors: sources → bus */}
          <svg className="pf-flow-svg mx-auto mt-2 block" width="480" height="80" viewBox="0 0 480 80">
            <path
              d="M 120 0 L 120 40 L 240 40 L 240 60"
              className={cn("pf-flow-path", solarActive ? "pf-flow-path-active" : "pf-flow-path-idle")}
            />
            <path
              d="M 360 0 L 360 40 L 240 40"
              className={cn("pf-flow-path", gridImporting ? "pf-flow-path-active" : "pf-flow-path-idle")}
            />
            {solarActive && (
              <circle r="3" className="pf-particle">
                <animateMotion dur="2s" repeatCount="indefinite" path="M 120 0 L 120 40 L 240 40 L 240 60" />
              </circle>
            )}
          </svg>

          {/* Energy bus */}
          <div className="mx-auto max-w-xs">
            <div className="pf-bus-node">
              <span className="asset-id">Energy bus</span>
              <span className="text-sm font-medium text-[#e7ece9]">{operatingState.mode}</span>
            </div>
          </div>

          {/* SVG connectors: bus → branches */}
          <svg className="pf-flow-svg mx-auto block" width="560" height="60" viewBox="0 0 560 60">
            <path d="M 280 0 L 280 20 L 100 20 L 100 50" className={cn("pf-flow-path", solarActive ? "pf-flow-path-active" : "pf-flow-path-idle")} />
            <path d="M 280 0 L 280 20 L 280 20 L 280 50" className={cn("pf-flow-path", solarActive ? "pf-flow-path-active" : "pf-flow-path-idle")} />
            <path d="M 280 0 L 280 20 L 460 20 L 460 50" className={cn("pf-flow-path", batteryCharging ? "pf-flow-path-active" : "pf-flow-path-idle")} />
            {solarActive && (
              <>
                <circle r="3" className="pf-particle">
                  <animateMotion dur="2.2s" repeatCount="indefinite" path="M 280 0 L 280 20 L 100 20 L 100 50" />
                </circle>
                <circle r="3" className="pf-particle">
                  <animateMotion dur="2.4s" repeatCount="indefinite" path="M 280 0 L 280 20 L 280 50" />
                </circle>
              </>
            )}
          </svg>

          {/* Branch loads */}
          <div className="mx-auto grid max-w-2xl grid-cols-3 gap-4">
            <BranchNode
              assetId={assets.loadT1.id}
              label="Critical load · Tier 01"
              value={`${t.criticalLoadKw.toFixed(1)} kW`}
              critical
            />
            <BranchNode
              assetId="FACILITY"
              label="Facility load"
              value={`${(t.loadKw - t.criticalLoadKw).toFixed(1)} kW`}
            />
            <BranchNode
              assetId={assets.bess01.id}
              label="Battery bank"
              value={`${t.batterySoc}%`}
              sub={batteryCharging ? `+${t.batteryKw} kW` : `${t.batteryKw} kW`}
            />
          </div>
        </div>
      </div>

      {/* Mobile: stacked flow */}
      <div className="mt-6 space-y-0 lg:hidden">
        <MobileFlowRow assetId={assets.pv01.id} label="Solar array" value={`${t.solarKw.toFixed(1)} kW`} active={solarActive} />
        <MobileFlowRow assetId={assets.grid01.id} label="Grid inlet" value={`${t.gridKw.toFixed(1)} kW`} active={gridImporting} />
        <div className="py-3 text-center">
          <span className="asset-id">↓ Energy bus ↓</span>
        </div>
        <MobileFlowRow assetId={assets.loadT1.id} label="Critical · Tier 01" value={`${t.criticalLoadKw.toFixed(1)} kW`} critical />
        <MobileFlowRow assetId="FACILITY" label="Facility load" value={`${t.loadKw.toFixed(1)} kW`} />
        <MobileFlowRow assetId={assets.bess01.id} label="Battery bank" value={`${t.batterySoc}%`} />
      </div>

      {/* Tier breakdown — inline, no cards */}
      <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-t border-white/[.06] pt-5">
        <TierInline tier="Tier 02" assetId={assets.loadT2.id} value={`${t.tier2LoadKw} kW`} note="Reduce if required" />
        <TierInline tier="Tier 03" assetId={assets.loadT3.id} value={`${t.tier3LoadKw} kW`} note="Shed if required" />
        <TierInline tier="Total" assetId="LOAD" value={`${t.loadKw} kW`} note="All tiers" />
      </div>
    </section>
  );
}

function SourceNode({
  assetId,
  label,
  value,
  active,
  variant,
}: {
  assetId: string;
  label: string;
  value: string;
  active: boolean;
  variant?: "grid";
}) {
  return (
    <div className={cn("pf-source-node text-center", active && "border-[#a8c44a]/25")}>
      <span className="asset-id">{assetId}</span>
      <span className="text-xs text-[#8a9692]">{label}</span>
      <span className={cn("text-lg font-semibold tracking-tight", active ? "text-[#e7ece9]" : "text-[#6d7874]")}>
        {value}
      </span>
      {variant === "grid" && (
        <span className="text-[10px] text-[#6d7874]">{active ? "Importing" : "Standby"}</span>
      )}
    </div>
  );
}

function BranchNode({
  assetId,
  label,
  value,
  sub,
  critical,
}: {
  assetId: string;
  label: string;
  value: string;
  sub?: string;
  critical?: boolean;
}) {
  return (
    <div className={cn("pf-branch-node", critical && "pf-branch-node-critical")}>
      <div>
        <span className="asset-id">{assetId}</span>
        <p className="text-xs text-[#8a9692]">{label}</p>
      </div>
      <div className="text-right">
        <p className="text-base font-semibold text-[#e7ece9]">{value}</p>
        {sub && <p className="text-[10px] text-[#6d7874]">{sub}</p>}
      </div>
    </div>
  );
}

function MobileFlowRow({
  assetId,
  label,
  value,
  active,
  critical,
}: {
  assetId: string;
  label: string;
  value: string;
  active?: boolean;
  critical?: boolean;
}) {
  return (
    <div className={cn("pf-branch-node", critical && "pf-branch-node-critical", active && "border-l-[#a8c44a]/30")}>
      <div>
        <span className="asset-id">{assetId}</span>
        <p className="text-xs text-[#8a9692]">{label}</p>
      </div>
      <p className="text-base font-semibold text-[#e7ece9]">{value}</p>
    </div>
  );
}

function TierInline({ tier, assetId, value, note }: { tier: string; assetId: string; value: string; note: string }) {
  return (
    <div className="flex items-baseline gap-3 text-sm">
      <span className="asset-id">{assetId}</span>
      <span className="text-[#8a9692]">{tier}</span>
      <span className="font-medium text-[#e7ece9]">{value}</span>
      <span className="text-xs text-[#6d7874]">{note}</span>
    </div>
  );
}
