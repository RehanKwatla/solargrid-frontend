import { useState } from "react";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { cn } from "@/lib/utils";
import type { HospitalLoad, PriorityLevel } from "@/data/types";
import {
  Edit3,
  Filter,
  Layers,
  Power,
  Shield,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Zap,
} from "lucide-react";

export function LoadControlTable({
  onSelectLoad,
}: {
  onSelectLoad: (load: HospitalLoad) => void;
}) {
  const { hospitalLoads } = useDashboardData();
  const [priorityFilter, setPriorityFilter] = useState<string>("All");

  const filteredLoads = hospitalLoads.filter((load) => {
    if (priorityFilter === "All") return true;
    return load.priority === priorityFilter;
  });

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger-ring)]/60 font-black";
      case "HIGH":
        return "bg-[var(--warning)]/15 text-[var(--warning)] border-[var(--warning)]/40 font-bold";
      case "NORMAL":
        return "bg-[var(--healthy-bg)] text-[var(--healthy)] border-[var(--healthy-ring)]/30 font-semibold";
      case "NON-CRITICAL":
        return "bg-surface-soft text-text-tertiary border-border";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Protected":
        return "pill-healthy";
      case "Active":
        return "pill-healthy";
      case "Curtailable":
        return "pill-warning";
      case "Shed":
        return "pill-danger";
      default:
        return "pill-muted";
    }
  };

  return (
    <div className="w-full min-w-0 border border-border bg-surface rounded-lg p-4 sm:p-6 space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface text-text-secondary">
            <SlidersHorizontal size={15} />
          </div>
          <div>
            <h3 className="font-sans text-base font-bold text-foreground leading-tight">
              Hospital Load Control & Priority Dispatch Matrix
            </h3>
            <p className="font-mono text-[0.65rem] tracking-[0.08em] text-text-tertiary uppercase">
              Circuit-Level Classification Ledger
            </p>
          </div>
        </div>

        {/* Priority Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {["All", "CRITICAL", "HIGH", "NORMAL", "NON-CRITICAL"].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriorityFilter(p)}
              className={cn(
                "px-2.5 py-1 rounded-md font-mono text-[0.72rem] transition-colors",
                priorityFilter === p
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-surface-soft/60 text-text-secondary hover:text-foreground hover:bg-surface-soft border border-border/60"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop / Tablet Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-[0.68rem] font-mono uppercase text-text-tertiary tracking-wider">
              <th className="py-2.5 px-3 font-semibold">Equipment / Room</th>
              <th className="py-2.5 px-3 font-semibold">Department</th>
              <th className="py-2.5 px-3 font-semibold text-right">Load (kW)</th>
              <th className="py-2.5 px-3 font-semibold text-center">Priority</th>
              <th className="py-2.5 px-3 font-semibold">Source Feeder</th>
              <th className="py-2.5 px-3 font-semibold text-center">Protection</th>
              <th className="py-2.5 px-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-xs">
            {filteredLoads.map((load) => (
              <tr
                key={load.id}
                className={cn(
                  "hover:bg-surface-soft/40 transition-colors",
                  load.priority === "CRITICAL" ? "bg-[var(--danger-bg)]/5" : ""
                )}
              >
                {/* Equipment & Room */}
                <td className="py-3 px-3">
                  <div className="font-sans font-semibold text-foreground">
                    {load.equipment_name}
                  </div>
                  <div className="font-mono text-[0.68rem] text-text-tertiary">
                    {load.room} · {load.floor}
                  </div>
                </td>

                {/* Department */}
                <td className="py-3 px-3 font-medium text-text-secondary">
                  {load.department}
                </td>

                {/* Consumption */}
                <td className="py-3 px-3 text-right font-mono font-bold text-foreground tabular-nums whitespace-nowrap">
                  {load.current_kw.toFixed(1)} kW
                </td>

                {/* Priority */}
                <td className="py-3 px-3 text-center whitespace-nowrap">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[0.68rem] border uppercase tracking-wider",
                      getPriorityBadge(load.priority)
                    )}
                  >
                    {load.priority === "CRITICAL" && <ShieldAlert size={12} />}
                    {load.priority === "HIGH" && <Shield size={12} />}
                    {load.priority === "NORMAL" && <ShieldCheck size={12} />}
                    {load.priority}
                  </span>
                </td>

                {/* Source Feeder */}
                <td className="py-3 px-3 font-mono text-[0.72rem] text-text-secondary whitespace-nowrap">
                  {load.source}
                </td>

                {/* Protection */}
                <td className="py-3 px-3 text-center whitespace-nowrap">
                  <span className={cn("pill !text-[9px] !py-0.5", getStatusBadge(load.status))}>
                    {load.protection_status}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3 px-3 text-center whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onSelectLoad(load)}
                    className="inline-flex items-center gap-1 rounded border border-border px-2.5 py-1 text-[0.7rem] font-mono font-semibold text-text-secondary hover:text-foreground hover:bg-surface-soft transition-colors"
                  >
                    <Edit3 size={11} />
                    <span>Set Priority</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-2.5">
        {filteredLoads.map((load) => (
          <div
            key={load.id}
            className="p-3 rounded-lg border border-border bg-surface-soft/30 space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[0.68rem] border uppercase tracking-wider",
                  getPriorityBadge(load.priority)
                )}
              >
                {load.priority}
              </span>
              <span className={cn("pill !text-[9px] !py-0.5", getStatusBadge(load.status))}>
                {load.protection_status}
              </span>
            </div>

            <div>
              <p className="font-sans text-xs font-bold text-foreground">
                {load.equipment_name}
              </p>
              <p className="font-mono text-[0.68rem] text-text-tertiary mt-0.5">
                {load.room} · {load.department}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
              <span className="font-mono text-foreground font-bold">
                {load.current_kw.toFixed(1)} kW
              </span>
              <button
                type="button"
                onClick={() => onSelectLoad(load)}
                className="inline-flex items-center gap-1 rounded border border-border px-2.5 py-1 text-[0.7rem] font-mono font-semibold text-text-secondary hover:text-foreground hover:bg-surface-soft transition-colors"
              >
                <Edit3 size={11} />
                <span>Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
