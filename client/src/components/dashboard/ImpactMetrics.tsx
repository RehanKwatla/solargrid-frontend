import { impactMetrics } from "@/data/mockData";

export function ImpactMetrics() {
  return (
    <section className="open-section">
      <h2 className="section-heading">Measurable impact</h2>
      <p className="mt-1 text-sm text-[#6d7874]">Simulated values — demo telemetry only</p>
      <div className="mt-4 grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
        {impactMetrics.map((item) => (
          <div key={item.label} className="impact-metric sm:pr-6">
            <p className="impact-value">{item.value}</p>
            <p className="impact-label">{item.label}</p>
            <p className="mt-0.5 text-xs text-[#6d7874]">{item.sublabel}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
