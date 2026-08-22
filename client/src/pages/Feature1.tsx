import { facility, feature1Metering } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function Feature1() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <header className="flex flex-wrap items-end justify-between gap-4 pb-4">
        <div>
          <div className="inline-flex items-center rounded-full bg-surface-soft px-3 py-1 text-xs font-semibold text-text-secondary mb-4">
            {facility.location}
          </div>
          <h1 className="heading-xl text-foreground">
            Metering
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-text-secondary">
            Government metering statistics for {facility.name}. All values are mock/demo
            until research-backed reference data and approved meter integrations are available.
          </p>
        </div>
      </header>

      <section className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-soft">
                <th className="p-4 text-left text-sm font-semibold text-foreground">Metric</th>
                <th className="p-4 text-left text-sm font-semibold text-foreground">Current value</th>
                <th className="p-4 text-left text-sm font-semibold text-foreground">Reference value</th>
                <th className="p-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="p-4 text-left text-sm font-semibold text-foreground">Source</th>
              </tr>
            </thead>
            <tbody>
              {feature1Metering.map((item, i) => (
                <tr 
                  key={item.metric} 
                  className={cn(
                    "border-b border-border transition-colors hover:bg-surface-soft",
                    i === feature1Metering.length - 1 && "border-b-0"
                  )}
                >
                  <td className="p-4 text-sm font-medium text-foreground">
                    {item.metric}
                  </td>
                  <td className="p-4 text-sm font-semibold text-foreground">
                    {item.current}
                  </td>
                  <td className="p-4 text-sm text-text-secondary">
                    {item.reference}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center rounded-full bg-healthy/10 px-2.5 py-0.5 text-xs font-semibold text-healthy">
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-text-secondary">
                    {item.source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-8 pt-4 text-xs text-text-secondary text-center">
        Demo note: no regulation or government statistic is represented as fact in this module.
      </p>
    </div>
  );
}
