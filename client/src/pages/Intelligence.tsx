import { ShieldCheck, SunMedium, Zap } from "lucide-react";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { DayTimeline } from "@/components/dashboard/DayTimeline";
import { cn } from "@/lib/utils";
import {
  DataEmpty,
  DataSourceBadge,
  LastUpdated,
} from "@/components/common/DataState";

export default function Intelligence() {
  const {
    facility,
    forecast,
    optimization,
    loadTiers,
    predictedDemand,
    facilityStatus,
    forecastStatus,
    optimizationStatus,
    loadTiersStatus,
    predictedDemandStatus,
  } = useDashboardData();

  const facilityCode = facility?.code ?? "—";
  const facilityLocation = facility?.location ?? "—";
  const facilityName = facility?.name ?? "Facility";

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 max-w-7xl mx-auto">
      <header className="flex flex-wrap items-end justify-between gap-4 pb-3">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <div className="instrument-label">
              {facilityCode} · {facilityLocation}
            </div>
            <DataSourceBadge source={facilityStatus.kind} />
          </div>
          <h1 className="heading-xl text-foreground">Decision Board</h1>
          <p className="mt-2 text-[0.84rem] text-text-secondary">
            Forecast, dispatch decisions, and priority-based load management for {facilityName}
          </p>
        </div>
      </header>

      {/* Dispatch decision + Forecast */}
      <section className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        {/* Dispatch decision */}
        <div className="border border-[var(--accent)] bg-[var(--accent)] text-primary-foreground rounded-lg p-5 sm:p-6 md:p-8 flex flex-col justify-between">
          {optimizationStatus.kind === "unavailable" ? (
            <DataEmpty
              label="No optimization data"
              detail="Optimization decisions are not yet available from the backend."
              className="bg-white/10 border-white/20"
            />
          ) : (
            <>
              <div>
                <div className="inline-flex items-center rounded-full bg-white/15 px-2.5 py-0.5 font-mono text-[9px] font-medium tracking-[0.08em] mb-4">
                  Active Dispatch Decision
                </div>
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-1">
                  {optimization?.action ?? "—"}
                </h2>
                <p className="mt-3 text-[0.84rem] font-medium opacity-80 leading-relaxed">
                  {optimization?.reason ?? "Awaiting optimization reason"}
                </p>
              </div>

              <div className="mt-6">
                {optimization?.expected_effects && optimization.expected_effects.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {optimization.expected_effects.map((effect) => (
                      <div
                        key={effect.label}
                        className="rounded-lg border border-white/15 bg-white/10 p-3.5 flex-1 min-w-[140px]"
                      >
                        <p className="font-mono text-[9px] font-medium opacity-70 tracking-wide uppercase">
                          {effect.label}
                        </p>
                        <p className="text-xl font-bold mt-1">{effect.value}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-5 inline-flex items-center rounded-full bg-white/10 px-2.5 py-0.5 text-[0.68rem] font-medium">
                  {optimization?.confidence ?? "Unknown confidence"}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Forecast details */}
        <div className="card p-5 sm:p-6 md:p-8 flex flex-col gap-5">
          <div>
            <p className="instrument-label mb-1">Forecast Drivers</p>
            <h2 className="heading-sm">System forecast</h2>
          </div>

          {forecastStatus.kind === "unavailable" ? (
            <DataEmpty
              label="No forecast data"
              detail="Forecast data is not yet available from the backend."
            />
          ) : (
            <>
              <ForecastRow
                icon={SunMedium}
                assetId="PV-01"
                title={`Solar peak expected: ${forecast?.solar?.peak_expected_kw ?? "—"} kW`}
                detail={`Next hour forecast ${forecast?.solar?.next_hour_kw ?? "—"} kW at ${forecast?.solar?.confidence_percent ?? "—"}% confidence.`}
                iconColor="text-warning"
              />
              <ForecastRow
                icon={Zap}
                assetId="LOAD"
                title={`Demand peak expected: ${forecast?.load?.expected_peak_kw ?? "—"} kW`}
                detail={`Modeled peak at ${forecast?.load?.peak_time ?? "—"}, above current ${forecast?.load?.current_kw ?? "—"} kW demand.`}
                iconColor="text-[var(--accent)]"
              />
              <ForecastRow
                icon={ShieldCheck}
                assetId="LOAD-T1"
                title="Tier 01 reliability maintained"
                detail="Critical allocation protected before any Tier 02 reduction or Tier 03 shedding."
                iconColor="text-[var(--healthy)]"
              />
            </>
          )}
        </div>
      </section>

      {/* Predicted Demand (from backend, if available) */}
      {predictedDemandStatus.kind === "live" && predictedDemand && (
        <section className="card p-5 sm:p-6">
          <div className="mb-5">
            <p className="instrument-label mb-1">ML Forecast</p>
            <h2 className="heading-sm">Predicted demand</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-surface-soft/50 p-4">
              <p className="font-mono text-[0.62rem] font-medium text-text-tertiary tracking-wide uppercase">
                Predicted kW
              </p>
              <p className="text-2xl font-bold text-foreground mt-1 tabular-nums">
                {predictedDemand.predicted_kw ?? "—"}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-surface-soft/50 p-4">
              <p className="font-mono text-[0.62rem] font-medium text-text-tertiary tracking-wide uppercase">
                Prediction time
              </p>
              <p className="text-sm font-semibold text-foreground mt-1">
                {predictedDemand.prediction_time ?? "—"}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-surface-soft/50 p-4">
              <p className="font-mono text-[0.62rem] font-medium text-text-tertiary tracking-wide uppercase">
                Confidence
              </p>
              <p className="text-sm font-semibold text-foreground mt-1">
                {predictedDemand.confidence_percent != null
                  ? `${predictedDemand.confidence_percent}%`
                  : "—"}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Priority dispatch / Load Tiers */}
      <section className="card p-5 sm:p-6">
        <div className="mb-5">
          <p className="instrument-label mb-1">Priority-based load management</p>
          <h2 className="heading-sm">Load Tiers</h2>
          <p className="mt-1 text-[0.81rem] text-text-secondary">
            Critical infrastructure protection policy
          </p>
        </div>

        {loadTiersStatus.kind === "unavailable" ? (
          <DataEmpty
            label="No load tier data"
            detail="Load tier configuration is not yet available from the backend."
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {loadTiers.map((item) => (
              <div
                key={item.tier}
                className="rounded-lg border border-border p-4 bg-surface-soft/50 hover:bg-surface-soft transition-colors"
              >
                <div className="mb-2.5">
                  <span className="pill pill-muted !text-[0.6rem]">{item.asset_id}</span>
                </div>
                <h3 className="text-[0.95rem] font-semibold text-foreground leading-tight">
                  {item.tier}{" "}
                  <span className="text-[0.78rem] font-normal text-text-secondary ml-1">
                    {item.label}
                  </span>
                </h3>
                <p className="mt-2 text-[0.81rem] text-text-secondary leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span
                    className={cn(
                      "pill !text-[0.6rem] !py-0.5 !px-2",
                      item.status === "healthy"
                        ? "pill-healthy"
                        : item.status === "watch"
                          ? "pill-warning"
                          : "pill-muted"
                    )}
                  >
                    {item.state}
                  </span>
                  <span className="text-[0.88rem] font-semibold tabular-nums text-foreground">
                    {item.allocation_kw != null ? `${item.allocation_kw} kW` : "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Timeline */}
      <section className="card p-5 sm:p-6">
        <div className="mb-5">
          <p className="instrument-label mb-1">Day cycle</p>
          <h2 className="heading-sm">Energy timeline</h2>
        </div>
        <div>
          <DayTimeline />
        </div>
      </section>
    </div>
  );
}

function ForecastRow({
  icon: Icon,
  assetId,
  title,
  detail,
  iconColor,
}: {
  icon: any;
  assetId: string;
  title: string;
  detail: string;
  iconColor: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-border p-3.5 bg-surface-soft/50 hover:bg-surface-soft transition-colors">
      <div className={cn("mt-0.5 shrink-0", iconColor)}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <span className="pill pill-muted !text-[0.6rem] !py-0 !px-1.5 mb-1.5 inline-flex">
          {assetId}
        </span>
        <p className="text-[0.84rem] font-semibold text-foreground leading-tight mt-1">{title}</p>
        <p className="text-[0.75rem] text-text-secondary mt-0.5 leading-relaxed">{detail}</p>
      </div>
    </div>
  );
}
