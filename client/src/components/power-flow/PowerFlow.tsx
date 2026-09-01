import { useDashboardData } from "@/contexts/DashboardDataContext";
import { useTelemetry } from "@/contexts/SolarTrackingContext";
import { assets } from "@/data/mockData";
import { cn } from "@/lib/utils";

export function PowerFlow() {
  const { telemetry: dbTelemetry, telemetryStatus, operatingMode } = useDashboardData();
  const simTelemetry = useTelemetry();

  // Prefer live Supabase / Backend data, fall back to simulation
  const t =
    telemetryStatus.kind === "live" && dbTelemetry
      ? {
          solarKw: dbTelemetry.solar_generation_kw ?? 0,
          gridKw: dbTelemetry.grid_import_kw ?? 0,
          batterySoc: dbTelemetry.battery_soc_percent ?? 0,
          batteryKw: dbTelemetry.battery_charge_kw
            ? dbTelemetry.battery_charge_kw
            : dbTelemetry.battery_discharge_kw
            ? -dbTelemetry.battery_discharge_kw
            : 0,
          loadKw: dbTelemetry.total_load_kw ?? 0,
          criticalLoadKw: dbTelemetry.critical_load_kw ?? 0,
          gridConnected: dbTelemetry.grid_connected ?? false,
        }
      : simTelemetry;

  const solarActive = t.solarKw > 0;
  const batteryCharging = t.batteryKw > 0;
  const gridImporting = t.gridKw > 0 && t.gridConnected;
  const modeLabel = operatingMode?.mode ?? "Self-Powered";

  return (
    <div className="w-full min-w-0">
      {/* Desktop diagram */}
      <div className="hidden lg:flex flex-col items-center w-full min-w-0 mx-auto">
        {/* Source Nodes */}
        <div className="flex w-full min-w-0 justify-between gap-4 px-4 sm:px-8 xl:px-12">
          <SourceNode
            assetId={assets.pv01.id}
            label="Solar Array"
            value={`${t.solarKw.toFixed(1)} kW`}
            active={solarActive}
          />
          <SourceNode
            assetId={assets.grid01.id}
            label="Grid Inlet"
            value={`${t.gridKw.toFixed(1)} kW`}
            active={gridImporting}
          />
        </div>

        {/* Vertical Feed Connectors */}
        <div className="flex w-full min-w-0 justify-between px-10 sm:px-20 xl:px-32 relative h-3">
          <div
            className={cn(
              "w-[2px] h-full mx-auto transition-colors duration-300",
              solarActive ? "bg-[var(--accent)]" : "bg-border"
            )}
          />
          <div
            className={cn(
              "w-[2px] h-full mx-auto transition-colors duration-300",
              gridImporting ? "bg-[var(--accent)]" : "bg-border"
            )}
          />
        </div>

        {/* Central Energy Bus */}
        <div className="w-full min-w-0 border-y border-border bg-surface-soft/80 flex justify-between items-center gap-3 px-5 py-2.5 z-10 relative">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.10em] text-foreground">
              Energy Bus
            </span>
            <span className="status-dot healthy pulse" />
          </div>
          <span className="pill pill-healthy !text-[0.65rem]">{modeLabel}</span>
        </div>

        {/* Vertical Distribution Connectors */}
        <div className="flex w-full min-w-0 justify-between px-6 sm:px-12 xl:px-20 relative h-3">
          <div
            className={cn(
              "w-[2px] h-full mx-auto transition-colors duration-300",
              solarActive ? "bg-[var(--accent)]" : "bg-border"
            )}
          />
          <div
            className={cn(
              "w-[2px] h-full mx-auto transition-colors duration-300",
              solarActive ? "bg-[var(--healthy)]" : "bg-border"
            )}
          />
          <div
            className={cn(
              "w-[2px] h-full mx-auto transition-colors duration-300",
              batteryCharging ? "bg-[var(--healthy)]" : "bg-border"
            )}
          />
        </div>

        {/* Distribution Branch Nodes */}
        <div className="flex w-full min-w-0 justify-between gap-3 sm:gap-4">
          <BranchNode
            assetId={assets.loadT1.id}
            label="Critical Load"
            value={`${t.criticalLoadKw.toFixed(1)} kW`}
            active={true}
          />
          <BranchNode
            assetId="FACILITY"
            label="Facility Load"
            value={`${(t.loadKw - t.criticalLoadKw).toFixed(1)} kW`}
            active={true}
          />
          <BranchNode
            assetId={assets.bess01.id}
            label="Battery Bank"
            value={`${t.batterySoc}%`}
            sub={
              batteryCharging
                ? `+${t.batteryKw.toFixed(1)} kW charging`
                : `${t.batteryKw.toFixed(1)} kW`
            }
            active={batteryCharging}
            accent={batteryCharging}
          />
        </div>
      </div>

      {/* Mobile diagram */}
      <div className="lg:hidden flex flex-col gap-2">
        <MobileNode
          assetId={assets.pv01.id}
          label="Solar Array"
          value={`${t.solarKw.toFixed(1)} kW`}
          active={solarActive}
        />
        <MobileNode
          assetId={assets.grid01.id}
          label="Grid Inlet"
          value={`${t.gridKw.toFixed(1)} kW`}
          active={gridImporting}
        />

        <div className="w-full border-y border-border bg-surface-soft/80 py-2 px-3 flex items-center justify-between my-0.5">
          <span className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.10em] text-foreground">
            Energy Bus
          </span>
          <span className="pill pill-healthy !text-[0.62rem]">{modeLabel}</span>
        </div>

        <MobileNode
          assetId={assets.loadT1.id}
          label="Critical Load"
          value={`${t.criticalLoadKw.toFixed(1)} kW`}
          active={true}
        />
        <MobileNode
          assetId="FACILITY"
          label="Facility Load"
          value={`${(t.loadKw - t.criticalLoadKw).toFixed(1)} kW`}
          active={true}
        />
        <MobileNode
          assetId={assets.bess01.id}
          label="Battery Bank"
          value={`${t.batterySoc}%`}
          active={batteryCharging}
          sub={batteryCharging ? `+${t.batteryKw.toFixed(1)} kW` : undefined}
        />
      </div>
    </div>
  );
}

function SourceNode({
  assetId,
  label,
  value,
  active,
}: {
  assetId: string;
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div
      className={cn(
        "border bg-surface p-3.5 w-full max-w-[180px] xl:max-w-[200px] min-w-0 flex-1 text-center transition-colors rounded-lg",
        active
          ? "border-[var(--accent-soft)] shadow-[var(--shadow-sm)]"
          : "border-border opacity-60"
      )}
    >
      <div className="pill pill-muted mb-2 truncate max-w-full !py-0 !px-1.5 !text-[0.6rem]">
        {assetId}
      </div>
      <div className="text-[0.68rem] font-medium text-text-secondary mb-1 truncate">{label}</div>
      <div className="text-xl sm:text-2xl font-bold tabular-nums tracking-tight text-foreground">
        {value}
      </div>
    </div>
  );
}

function BranchNode({
  assetId,
  label,
  value,
  sub,
  active,
  accent,
}: {
  assetId: string;
  label: string;
  value: string;
  sub?: string;
  active: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "border bg-surface p-3.5 w-full max-w-[170px] xl:max-w-[195px] min-w-0 flex-1 text-center transition-colors rounded-lg",
        active && accent
          ? "border-[var(--healthy-ring)] shadow-[var(--shadow-sm)]"
          : active
            ? "border-border shadow-[var(--shadow-xs)]"
            : "border-border opacity-60"
      )}
    >
      <div className="pill pill-muted mb-2 truncate max-w-full !py-0 !px-1.5 !text-[0.6rem]">
        {assetId}
      </div>
      <div className="text-[0.68rem] font-medium text-text-secondary mb-1 truncate">{label}</div>
      <div className="text-xl sm:text-2xl font-bold tabular-nums tracking-tight text-foreground">
        {value}
      </div>
      {sub && (
        <div className="text-[10px] font-mono text-text-tertiary mt-1 leading-tight truncate">
          {sub}
        </div>
      )}
    </div>
  );
}

function MobileNode({
  assetId,
  label,
  value,
  active,
  sub,
}: {
  assetId: string;
  label: string;
  value: string;
  active: boolean;
  sub?: string;
}) {
  return (
    <div
      className={cn(
        "flex justify-between items-center border bg-surface p-3 w-full rounded-lg transition-colors",
        active ? "border-border shadow-[var(--shadow-xs)]" : "border-border/60 opacity-60"
      )}
    >
      <div className="min-w-0">
        <div className="pill pill-muted mb-1 !py-0 !px-1.5 !text-[0.6rem]">{assetId}</div>
        <div className="text-xs font-semibold text-foreground truncate">{label}</div>
      </div>
      <div className="text-right shrink-0 ml-2">
        <div className="text-lg font-bold tabular-nums tracking-tight text-foreground">{value}</div>
        {sub && <div className="text-[10px] font-mono text-text-tertiary">{sub}</div>}
      </div>
    </div>
  );
}
