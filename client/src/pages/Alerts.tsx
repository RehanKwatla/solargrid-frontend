import { useState } from "react";
import { EventStream } from "@/components/alerts/EventStream";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { cn } from "@/lib/utils";
import {
  DataEmpty,
  DataSourceBadge,
  LastUpdated,
} from "@/components/common/DataState";

export default function Alerts() {
  const [acknowledgedIds, setAcknowledgedIds] = useState<number[]>([]);
  const acknowledge = (id: number) =>
    setAcknowledgedIds((ids) => (ids.includes(id) ? ids : [...ids, id]));

  const {
    facility,
    alerts,
    alertsStatus,
    facilityStatus,
  } = useDashboardData();

  const facilityCode = facility?.code ?? "—";
  const facilityLocation = facility?.location ?? "—";
  const facilityName = facility?.name ?? "Facility";

  // Convert string IDs to numbers for acknowledgement tracking
  const numericId = (id: string) => {
    const n = parseInt(id, 10);
    return isNaN(n) ? id.charCodeAt(0) : n;
  };

  const critical = alerts.filter((a) => a.state === "critical").length;
  const warnings = alerts.filter((a) => a.state === "watch").length;
  const info = alerts.filter((a) => a.state === "healthy").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 max-w-5xl mx-auto">
      <header className="flex flex-wrap items-end justify-between gap-4 pb-3">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <div className="instrument-label">
              {facilityCode} · {facilityLocation}
            </div>
            <DataSourceBadge source={facilityStatus.kind} />
          </div>
          <h1 className="heading-xl text-foreground">System events</h1>
          <p className="mt-2 text-[0.84rem] text-text-secondary">
            Operational event log for {facilityName}
            {alertsStatus.lastUpdated && (
              <>
                {" · "}
                <LastUpdated
                  timestamp={alertsStatus.lastUpdated}
                  source={alertsStatus.kind}
                />
              </>
            )}
          </p>
        </div>
      </header>

      {/* Severity summary */}
      <section className="grid grid-cols-3 gap-3 sm:gap-4 pb-3">
        <SeverityCount
          label="Critical"
          count={critical}
          colorClass="text-[var(--danger)] bg-[var(--danger-bg)]"
          dotClass="bg-[var(--danger)]"
        />
        <SeverityCount
          label="Warning"
          count={warnings}
          colorClass="text-[var(--warning)] bg-[var(--warning-bg)]"
          dotClass="bg-[var(--warning)]"
        />
        <SeverityCount
          label="Info"
          count={info}
          colorClass="text-[var(--healthy)] bg-[var(--healthy-bg)]"
          dotClass="bg-[var(--healthy)]"
        />
      </section>

      {/* Event stream */}
      <section className="card p-5 sm:p-6">
        {alertsStatus.kind === "unavailable" ? (
          <DataEmpty
            label="No events loaded"
            detail="Alert data is not yet available from the backend."
          />
        ) : (
          <EventStream
            items={alerts.map((a) => ({
              ...a,
              id: numericId(a.id),
              assetId: a.asset_id,
            }))}
            acknowledgedIds={acknowledgedIds}
            onAcknowledge={acknowledge}
          />
        )}
      </section>
    </div>
  );
}

function SeverityCount({
  label,
  count,
  colorClass,
  dotClass,
}: {
  label: string;
  count: number;
  colorClass: string;
  dotClass: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface p-3.5 sm:p-4 flex items-center gap-3 min-w-0"
      )}
    >
      <span className={cn("h-2 w-2 rounded-full shrink-0", dotClass)} />
      <div className="min-w-0 flex-1">
        <p className="text-[0.72rem] font-medium text-text-secondary truncate">{label}</p>
        <p
          className={cn(
            "text-xl sm:text-2xl font-bold tabular-nums leading-tight mt-0.5",
            colorClass
          )}
        >
          {count}
        </p>
      </div>
    </div>
  );
}
