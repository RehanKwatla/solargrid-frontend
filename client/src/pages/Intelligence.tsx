import { ShieldCheck, SunMedium, Zap } from "lucide-react";
import {
  loadForecast,
  optimizationDecision,
  priorityDispatch,
  solarForecast,
  facility,
} from "@/data/mockData";
import { DayTimeline } from "@/components/dashboard/DayTimeline";
import { cn } from "@/lib/utils";

export default function Intelligence() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <header className="flex flex-wrap items-end justify-between gap-4 pb-4">
        <div>
          <div className="inline-flex items-center rounded-full bg-surface-soft px-3 py-1 text-xs font-semibold text-text-secondary mb-4">
            {facility.location}
          </div>
          <h1 className="heading-xl text-foreground">
            Decision Board
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Forecast, dispatch decisions, and priority-based load management for {facility.name}.
          </p>
        </div>
      </header>

      {/* Forecast → Decision → Impact flow */}
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        
        {/* Dispatch decision */}
        <div className="rounded-2xl border border-transparent bg-primary text-primary-foreground shadow-md p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold mb-4">
              Active Dispatch Decision
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-2">
              {optimizationDecision.action}
            </h2>
            <p className="mt-4 text-sm font-medium opacity-90">
              {optimizationDecision.reason}
            </p>
          </div>
          
          <div className="mt-8">
            <div className="flex flex-wrap gap-4">
              {optimizationDecision.expectedEffect.map((effect) => (
                <div key={effect.label} className="rounded-xl border border-white/20 bg-white/10 p-4 flex-1 min-w-[150px] backdrop-blur-sm">
                  <p className="text-xs font-medium opacity-80 mb-1">{effect.label}</p>
                  <p className="text-2xl font-bold">{effect.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
              Confidence: {optimizationDecision.confidence}
            </div>
          </div>
        </div>

        {/* Forecast details */}
        <div className="rounded-2xl border border-border bg-surface shadow-sm p-6 md:p-8 flex flex-col gap-6">
          <div className="mb-2">
            <h2 className="text-xl font-semibold text-foreground">
              Forecast Drivers
            </h2>
          </div>
          
          <ForecastRow
            icon={SunMedium}
            assetId="PV-01"
            title={`Solar peak expected: ${solarForecast.peakExpected} kW`}
            detail={`Next hour forecast ${solarForecast.nextHour} kW at ${solarForecast.confidence} confidence.`}
            iconColor="text-warning"
          />
          <ForecastRow
            icon={Zap}
            assetId="LOAD"
            title={`Demand peak expected: ${loadForecast.expectedPeak} kW`}
            detail={`Modeled peak at ${loadForecast.peakTime}, above current ${loadForecast.current} kW demand.`}
            iconColor="text-accent"
          />
          <ForecastRow
            icon={ShieldCheck}
            assetId="LOAD-T1"
            title="Tier 01 reliability maintained"
            detail="Critical allocation protected before any Tier 02 reduction or Tier 03 shedding."
            iconColor="text-healthy"
          />
        </div>
      </section>

      {/* Priority dispatch */}
      <section className="rounded-2xl border border-border bg-surface shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            Load Tiers
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Priority-based load management — Critical infrastructure protection policy.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {priorityDispatch.map((item) => (
            <div
              key={item.tier}
              className="rounded-xl border border-border p-5 bg-surface-soft transition-colors"
            >
              <div className="mb-3 inline-flex items-center rounded-full bg-surface px-2.5 py-0.5 text-[10px] font-semibold text-text-secondary border border-border">
                {item.assetId}
              </div>
              <h3 className="text-lg font-semibold text-foreground leading-tight">
                {item.tier} <span className="text-sm font-normal text-text-secondary ml-1">{item.label}</span>
              </h3>
              <p className="mt-3 text-sm text-text-secondary">
                {item.description}
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                    item.status === "healthy" ? "bg-healthy/10 text-healthy" : item.status === "watch" ? "bg-warning/10 text-warning" : "bg-border text-text-secondary"
                  )}
                >
                  {item.state}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {item.allocation}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            Energy timeline
          </h2>
          <p className="text-sm text-text-secondary mt-1">Day cycle</p>
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
    <div className="flex gap-4 rounded-xl border border-border p-4 bg-surface-soft hover:bg-surface transition-colors">
      <div className={cn("mt-1", iconColor)}>
        <Icon size={24} />
      </div>
      <div>
        <span className="inline-flex items-center rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold text-text-secondary border border-border mb-2">
          {assetId}
        </span>
        <p className="text-sm font-semibold text-foreground leading-tight mb-1">{title}</p>
        <p className="text-xs text-text-secondary">{detail}</p>
      </div>
    </div>
  );
}
