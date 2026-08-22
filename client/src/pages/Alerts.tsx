import { useState } from "react";
import { EventStream } from "@/components/alerts/EventStream";
import { alerts, facility } from "@/data/mockData";

export default function Alerts() {
  const [acknowledgedIds, setAcknowledgedIds] = useState<number[]>([]);
  const acknowledge = (id: number) =>
    setAcknowledgedIds((ids) => (ids.includes(id) ? ids : [...ids, id]));

  const critical = alerts.filter((a) => a.state === "critical").length;
  const warnings = alerts.filter((a) => a.state === "watch").length;
  const info = alerts.filter((a) => a.state === "healthy").length;

  return (
    <div className="dashboard-canvas px-5 py-6 sm:px-7 lg:px-8 lg:py-8">
      <header>
        <p className="facility-location">{facility.location}</p>
        <h1 className="facility-name mt-1">System events</h1>
        <p className="mt-2 text-sm text-[#8a9692]">
          Operational event log for {facility.name}.
        </p>
      </header>

      {/* Severity summary — inline, not cards */}
      <section className="mt-8 flex flex-wrap gap-8 border-b border-white/[.06] pb-6">
        <SeverityCount label="Critical" count={critical} color="text-[#c47060]" />
        <SeverityCount label="Warning" count={warnings} color="text-[#b89860]" />
        <SeverityCount label="Info" count={info} color="text-[#6d7874]" />
      </section>

      {/* Event stream */}
      <section className="mt-6">
        <EventStream
          items={alerts}
          acknowledgedIds={acknowledgedIds}
          onAcknowledge={acknowledge}
        />
      </section>
    </div>
  );
}

function SeverityCount({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div>
      <p className={`text-3xl font-semibold tracking-tight ${color}`}>{count}</p>
      <p className="mt-1 text-sm text-[#8a9692]">{label}</p>
    </div>
  );
}
