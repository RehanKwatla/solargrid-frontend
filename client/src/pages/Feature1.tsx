import { facility, feature1Metering } from "@/data/mockData";

export default function Feature1() {
  return (
    <div className="dashboard-canvas px-5 py-6 sm:px-7 lg:px-8 lg:py-8">
      <header>
        <p className="facility-location">{facility.location}</p>
        <h1 className="facility-name mt-1">Metering</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#8a9692]">
          Government metering statistics for {facility.name}. All values are mock/demo
          until research-backed reference data and approved meter integrations are available.
        </p>
      </header>

      <section className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[680px] text-left">
          <thead>
            <tr className="border-b border-white/[.08]">
              <th className="pb-3 pr-4 text-left text-sm font-medium text-[#8a9692]">Metric</th>
              <th className="pb-3 pr-4 text-left text-sm font-medium text-[#8a9692]">Current value</th>
              <th className="pb-3 pr-4 text-left text-sm font-medium text-[#8a9692]">Reference value</th>
              <th className="pb-3 pr-4 text-left text-sm font-medium text-[#8a9692]">Status</th>
              <th className="pb-3 text-left text-sm font-medium text-[#8a9692]">Source</th>
            </tr>
          </thead>
          <tbody>
            {feature1Metering.map((item) => (
              <tr key={item.metric} className="border-b border-white/[.05]">
                <td className="py-4 pr-4 text-sm font-medium text-[#e7ece9]">{item.metric}</td>
                <td className="py-4 pr-4 font-mono text-sm text-[#e7ece9]">{item.current}</td>
                <td className="py-4 pr-4 font-mono text-sm text-[#8a9692]">{item.reference}</td>
                <td className="py-4 pr-4 text-sm text-[#c8e64a]">{item.status}</td>
                <td className="py-4 font-mono text-xs text-[#6d7874]">{item.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <p className="mt-8 border-t border-white/[.06] pt-6 text-sm text-[#6d7874]">
        Demo note: no regulation or government statistic is represented as fact in this module.
      </p>
    </div>
  );
}
