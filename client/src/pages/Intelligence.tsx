import { ShieldCheck, SunMedium, Zap } from "lucide-react";
import {
  loadForecast,
  optimizationDecision,
  priorityDispatch,
  solarForecast,
  facility,
} from "@/data/mockData";
import { DayTimeline } from "@/components/dashboard/DayTimeline";

export default function Intelligence() {
  return (
    <div className="dashboard-canvas px-5 py-6 sm:px-7 lg:px-8 lg:py-8">
      <header>
        <p className="facility-location">{facility.location}</p>
        <h1 className="facility-name mt-1">Intelligence</h1>
        <p className="mt-2 max-w-xl text-sm text-[#8a9692]">
          Forecast, dispatch decisions, and priority-based load management for {facility.name}.
        </p>
      </header>

      {/* Forecast → Decision → Impact flow */}
      <section className="mt-10">
        <div className="flex items-center gap-3 text-sm text-[#6d7874]">
          <span className="asset-id">Forecast</span>
          <span>→</span>
          <span className="asset-id asset-id-active">Dispatch decision</span>
          <span>→</span>
          <span className="asset-id">Expected impact</span>
        </div>

        <div className="mt-8 grid gap-10 xl:grid-cols-[1fr_1fr]">
          {/* Dispatch decision */}
          <div className="dispatch-card">
            <p className="asset-id asset-id-active">Dispatch decision</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#e7ece9]">
              {optimizationDecision.action}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#8a9692]">
              {optimizationDecision.reason}
            </p>
            <div className="mt-6 flex flex-wrap gap-8">
              {optimizationDecision.expectedEffect.map((effect) => (
                <div key={effect.label}>
                  <p className="asset-id">{effect.label}</p>
                  <p className="mt-1 text-xl font-semibold text-[#c8e64a]">{effect.value}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-[#6d7874]">{optimizationDecision.confidence}</p>
          </div>

          {/* Forecast details */}
          <div className="space-y-6">
            <ForecastRow
              icon={SunMedium}
              assetId="PV-01"
              title={`Solar peak expected: ${solarForecast.peakExpected} kW`}
              detail={`Next hour forecast ${solarForecast.nextHour} kW at ${solarForecast.confidence} confidence.`}
            />
            <ForecastRow
              icon={Zap}
              assetId="LOAD"
              title={`Demand peak expected: ${loadForecast.expectedPeak} kW`}
              detail={`Modeled peak at ${loadForecast.peakTime}, above current ${loadForecast.current} kW demand.`}
              variant="watch"
            />
            <ForecastRow
              icon={ShieldCheck}
              assetId="LOAD-T1"
              title="Tier 01 reliability maintained"
              detail="Critical allocation protected before any Tier 02 reduction or Tier 03 shedding."
            />
          </div>
        </div>
      </section>

      <div className="section-divider mt-10" />

      {/* Priority dispatch */}
      <section className="mt-10">
        <p className="asset-id">Priority-based load management</p>
        <h2 className="section-heading mt-1">Load tiers</h2>
        <p className="mt-2 text-sm text-[#8a9692]">
          Critical infrastructure protection policy — connected to power flow allocation.
        </p>

        <div className="mt-8 grid gap-0 lg:grid-cols-3">
          {priorityDispatch.map((item) => (
            <div
              key={item.tier}
              className="border-t border-white/[.06] py-6 lg:border-t-0 lg:border-l lg:border-white/[.06] lg:px-8 lg:first:border-l-0 lg:first:pl-0"
            >
              <span className="asset-id">{item.assetId}</span>
              <h3 className="mt-2 text-lg font-medium text-[#e7ece9]">
                {item.tier} · {item.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#8a9692]">
                {item.description}
              </p>
              <div className="mt-4 flex items-baseline justify-between">
                <span
                  className={
                    item.status === "healthy"
                      ? "text-sm text-[#c8e64a]"
                      : item.status === "watch"
                        ? "text-sm text-[#b89860]"
                        : "text-sm text-[#6d7874]"
                  }
                >
                  {item.state}
                </span>
                <span className="font-mono text-sm text-[#e7ece9]">{item.allocation}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider mt-10" />

      <section className="mt-8">
        <p className="asset-id">Day cycle</p>
        <h2 className="section-heading mt-1">Energy timeline</h2>
        <div className="mt-4">
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
  variant,
}: {
  icon: typeof SunMedium;
  assetId: string;
  title: string;
  detail: string;
  variant?: "watch";
}) {
  return (
    <div className="flex gap-4 border-t border-white/[.06] pt-5">
      <Icon size={18} className={variant === "watch" ? "text-[#b89860]" : "text-[#8a9692]"} />
      <div>
        <span className="asset-id">{assetId}</span>
        <p className="mt-1 text-sm font-medium text-[#e7ece9]">{title}</p>
        <p className="mt-1 text-sm text-[#6d7874]">{detail}</p>
      </div>
    </div>
  );
}
