import { useState } from "react";
import { EventStream } from "@/components/alerts/EventStream";
import { alerts, facility } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function Alerts() {
  const [acknowledgedIds, setAcknowledgedIds] = useState<number[]>([]);
  const acknowledge = (id: number) =>
    setAcknowledgedIds((ids) => (ids.includes(id) ? ids : [...ids, id]));

  const critical = alerts.filter((a) => a.state === "critical").length;
  const warnings = alerts.filter((a) => a.state === "watch").length;
  const info = alerts.filter((a) => a.state === "healthy").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <header className="flex flex-wrap items-end justify-between gap-4 pb-4">
        <div>
          <div className="inline-flex items-center rounded-full bg-surface-soft px-3 py-1 text-xs font-semibold text-text-secondary mb-4">
            {facility.location}
          </div>
          <h1 className="heading-xl text-foreground">
            System events
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Operational event log for {facility.name}.
          </p>
        </div>
      </header>

      {/* Severity summary */}
      <section className="flex flex-wrap gap-4 pb-6">
        <SeverityCount label="Critical" count={critical} colorClass="text-danger bg-danger/10" />
        <SeverityCount label="Warning" count={warnings} colorClass="text-warning bg-warning/10" />
        <SeverityCount label="Info" count={info} colorClass="text-healthy bg-healthy/10" />
      </section>

      {/* Event stream */}
      <section className="rounded-2xl border border-border bg-surface shadow-sm p-6">
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
  colorClass,
}: {
  label: string;
  count: number;
  colorClass: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface shadow-sm p-5 min-w-[140px] flex-1 sm:flex-none flex items-center justify-between sm:flex-col sm:items-start">
      <p className="text-sm font-semibold text-text-secondary">{label}</p>
      <div className={cn("mt-2 inline-flex items-center justify-center rounded-lg px-3 py-1 text-2xl font-bold", colorClass)}>
        {count}
      </div>
    </div>
  );
}
