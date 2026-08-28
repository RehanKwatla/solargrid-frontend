import { facility, feature1Metering } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function Feature1() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 max-w-7xl mx-auto">
      <header className="flex flex-wrap items-end justify-between gap-4 pb-3">
        <div>
          <div className="instrument-label mb-2">{facility.code} · {facility.location}</div>
          <h1 className="heading-xl text-foreground">
            Metering
          </h1>
          <p className="mt-2 max-w-2xl text-[0.84rem] text-text-secondary">
            Government metering statistics for {facility.name}. All values are mock/demo
            until research-backed reference data and approved meter integrations are available.
          </p>
        </div>
      </header>

      <section className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="p-4 font-mono text-[0.62rem] font-medium tracking-[0.08em] uppercase text-text-secondary">Metric</th>
                <th className="p-4 font-mono text-[0.62rem] font-medium tracking-[0.08em] uppercase text-text-secondary">Current value</th>
                <th className="p-4 font-mono text-[0.62rem] font-medium tracking-[0.08em] uppercase text-text-secondary">Reference value</th>
                <th className="p-4 font-mono text-[0.62rem] font-medium tracking-[0.08em] uppercase text-text-secondary">Status</th>
                <th className="p-4 font-mono text-[0.62rem] font-medium tracking-[0.08em] uppercase text-text-secondary">Source</th>
              </tr>
            </thead>
            <tbody>
              {feature1Metering.map((item, i) => (
                <tr 
                  key={item.metric} 
                  className={cn(
                    "border-b border-border transition-colors hover:bg-surface-soft/50",
                    i === feature1Metering.length - 1 && "border-b-0"
                  )}
                >
                  <td className="p-4 text-[0.84rem] font-medium text-foreground">
                    {item.metric}
                  </td>
                  <td className="p-4 text-[0.84rem] font-semibold text-foreground tabular-nums">
                    {item.current}
                  </td>
                  <td className="p-4 text-[0.81rem] text-text-secondary tabular-nums">
                    {item.reference}
                  </td>
                  <td className="p-4">
                    <span className="pill pill-healthy !text-[0.65rem] !py-0.5 !px-2">
                      <span className="status-dot healthy" style={{ width: 5, height: 5 }} />
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-[0.75rem] text-text-tertiary font-mono">
                    {item.source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-6 pt-3 text-[0.72rem] text-text-tertiary text-center font-mono">
        Demo note — no regulation or government statistic is represented as fact in this module
      </p>
    </div>
  );
}
