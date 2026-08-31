import { useDashboardData } from "@/contexts/DashboardDataContext";
import { cn } from "@/lib/utils";
import { FileText, History, ShieldAlert, ShieldCheck, UserCheck } from "lucide-react";

export function LoadAuditLogTable() {
  const { loadAuditLogs } = useDashboardData();

  return (
    <div className="w-full min-w-0 border border-border bg-surface rounded-lg p-4 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface text-text-secondary">
            <History size={15} />
          </div>
          <div>
            <h3 className="font-sans text-base font-bold text-foreground leading-tight">
              Hospital Load Priority Audit Trail
            </h3>
            <p className="font-mono text-[0.65rem] tracking-[0.08em] text-text-tertiary uppercase">
              Regulatory Compliance & Clinical Action Log
            </p>
          </div>
        </div>

        <span className="font-mono text-[0.68rem] text-text-tertiary">
          {loadAuditLogs.length} Events Logged
        </span>
      </div>

      {/* Desktop / Tablet Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-[0.68rem] font-mono uppercase text-text-tertiary tracking-wider">
              <th className="py-2.5 px-3 font-semibold">Timestamp</th>
              <th className="py-2.5 px-3 font-semibold">Operator / Approver</th>
              <th className="py-2.5 px-3 font-semibold">Target Load</th>
              <th className="py-2.5 px-3 font-semibold text-center">Transition</th>
              <th className="py-2.5 px-3 font-semibold">Clinical / Operational Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-xs">
            {loadAuditLogs.map((log) => {
              const dateObj = new Date(log.timestamp);
              const formattedDate = dateObj.toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
              });
              const formattedTime = dateObj.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });

              return (
                <tr key={log.id} className="hover:bg-surface-soft/40 transition-colors">
                  {/* Timestamp */}
                  <td className="py-3 px-3 font-mono text-[0.72rem] text-text-secondary whitespace-nowrap">
                    <span className="font-semibold text-foreground">{formattedDate}</span> · {formattedTime}
                  </td>

                  {/* Operator */}
                  <td className="py-3 px-3 font-medium text-foreground whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <UserCheck size={13} className="text-text-tertiary shrink-0" />
                      <span>{log.operator}</span>
                    </div>
                  </td>

                  {/* Target Load */}
                  <td className="py-3 px-3 font-semibold text-foreground max-w-[200px] truncate">
                    {log.load_name}
                  </td>

                  {/* Transition */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 font-mono text-[0.68rem]">
                      <span className="px-1.5 py-0.5 rounded bg-surface-soft border border-border text-text-secondary">
                        {log.previous_priority}
                      </span>
                      <span className="text-text-tertiary">→</span>
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded border font-bold",
                          log.new_priority === "CRITICAL"
                            ? "bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger-ring)]/60"
                            : "bg-primary/10 text-foreground border-primary"
                        )}
                      >
                        {log.new_priority}
                      </span>
                    </div>
                  </td>

                  {/* Reason */}
                  <td className="py-3 px-3 text-text-secondary font-mono text-[0.72rem] max-w-[320px]">
                    {log.reason}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-2.5">
        {loadAuditLogs.map((log) => {
          const dateObj = new Date(log.timestamp);
          const dateStr = dateObj.toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
          });
          const timeStr = dateObj.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });

          return (
            <div
              key={log.id}
              className="p-3 rounded-lg border border-border bg-surface-soft/30 space-y-2"
            >
              <div className="flex items-center justify-between text-[0.68rem] font-mono text-text-tertiary">
                <span>{dateStr} · {timeStr}</span>
                <span>{log.operator}</span>
              </div>

              <div className="flex items-center justify-between">
                <p className="font-sans text-xs font-bold text-foreground">
                  {log.load_name}
                </p>
                <span className="font-mono text-[0.68rem] font-bold text-[var(--danger)]">
                  {log.new_priority}
                </span>
              </div>

              <p className="font-mono text-[0.7rem] text-text-secondary pt-1 border-t border-border/40">
                "{log.reason}"
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
