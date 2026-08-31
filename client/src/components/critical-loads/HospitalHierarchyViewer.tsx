import { useState } from "react";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { cn } from "@/lib/utils";
import type { HospitalLoad, PriorityLevel } from "@/data/types";
import {
  Building2,
  ChevronDown,
  ChevronRight,
  FolderTree,
  HeartPulse,
  Hospital,
  Layers,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from "lucide-react";

export function HospitalHierarchyViewer({
  onSelectLoad,
}: {
  onSelectLoad: (load: HospitalLoad) => void;
}) {
  const { hospitalLoads, facility } = useDashboardData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>("All");
  const [collapsedDepts, setCollapsedDepts] = useState<Record<string, boolean>>({});

  const hospitalName = facility?.name ?? "Apollo Care Campus";

  // Group loads by Department
  const departments = Array.from(
    new Set(hospitalLoads.map((l) => l.department))
  );

  const filteredLoads = hospitalLoads.filter((l) => {
    const matchesSearch =
      l.equipment_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.building.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept =
      selectedDeptFilter === "All" || l.department === selectedDeptFilter;

    return matchesSearch && matchesDept;
  });

  const toggleDept = (dept: string) => {
    setCollapsedDepts((prev) => ({ ...prev, [dept]: !prev[dept] }));
  };

  const getPriorityBadgeClass = (priority: PriorityLevel) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger-ring)]/60 font-black";
      case "HIGH":
        return "bg-[var(--warning)]/15 text-[var(--warning)] border-[var(--warning)]/40 font-bold";
      case "NORMAL":
        return "bg-[var(--healthy-bg)] text-[var(--healthy)] border-[var(--healthy-ring)]/30";
      case "NON-CRITICAL":
        return "bg-surface-soft text-text-tertiary border-border";
    }
  };

  return (
    <div className="w-full min-w-0 border border-border bg-surface rounded-lg p-4 sm:p-6 space-y-4">
      {/* Title and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface text-text-secondary">
            <FolderTree size={15} />
          </div>
          <div>
            <h3 className="font-sans text-base font-bold text-foreground leading-tight">
              Hospital Hierarchy & Equipment Tree
            </h3>
            <p className="font-mono text-[0.65rem] tracking-[0.08em] text-text-tertiary uppercase">
              {hospitalName} · Multi-Tier Infrastructure Map
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search equipment, room, or bed…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 sm:w-64 rounded-md border border-border bg-surface-soft/60 pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>
        </div>
      </div>

      {/* Department Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setSelectedDeptFilter("All")}
          className={cn(
            "px-2.5 py-1 rounded-md font-mono text-[0.72rem] transition-colors",
            selectedDeptFilter === "All"
              ? "bg-primary text-primary-foreground font-semibold"
              : "bg-surface-soft/60 text-text-secondary hover:text-foreground hover:bg-surface-soft border border-border/60"
          )}
        >
          All Departments ({hospitalLoads.length})
        </button>
        {departments.map((dept) => {
          const count = hospitalLoads.filter((l) => l.department === dept).length;
          const hasCritical = hospitalLoads.some((l) => l.department === dept && l.priority === "CRITICAL");
          return (
            <button
              key={dept}
              type="button"
              onClick={() => setSelectedDeptFilter(dept)}
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[0.72rem] transition-colors border",
                selectedDeptFilter === dept
                  ? "bg-primary text-primary-foreground font-semibold border-transparent"
                  : "bg-surface-soft/60 text-text-secondary hover:text-foreground hover:bg-surface-soft border-border/60"
              )}
            >
              {hasCritical && <span className="h-1.5 w-1.5 rounded-full bg-[var(--danger)] shrink-0" />}
              <span>{dept}</span>
              <span className="opacity-60 text-[0.65rem]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Tree Structure Layout */}
      <div className="space-y-3 pt-2">
        {departments
          .filter((dept) => selectedDeptFilter === "All" || selectedDeptFilter === dept)
          .map((dept) => {
            const deptLoads = filteredLoads.filter((l) => l.department === dept);
            if (deptLoads.length === 0) return null;

            const isCollapsed = collapsedDepts[dept];
            const deptKw = deptLoads.reduce((acc, l) => acc + l.current_kw, 0);
            const criticalCount = deptLoads.filter((l) => l.priority === "CRITICAL").length;
            const buildingName = deptLoads[0]?.building ?? "Main Block";
            const floorName = deptLoads[0]?.floor ?? "Floor 1";

            return (
              <div
                key={dept}
                className="border border-border rounded-lg bg-surface-soft/20 overflow-hidden"
              >
                {/* Department Header */}
                <button
                  type="button"
                  onClick={() => toggleDept(dept)}
                  className="w-full flex items-center justify-between p-3 sm:p-3.5 bg-surface-soft/50 hover:bg-surface-soft transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    {isCollapsed ? (
                      <ChevronRight size={16} className="text-text-tertiary shrink-0" />
                    ) : (
                      <ChevronDown size={16} className="text-text-tertiary shrink-0" />
                    )}
                    <Building2 size={16} className="text-text-secondary shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-sans font-bold text-xs sm:text-sm text-foreground">
                          {dept}
                        </span>
                        <span className="font-mono text-[0.68rem] text-text-tertiary">
                          {buildingName} · {floorName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    {criticalCount > 0 && (
                      <span className="pill pill-danger !text-[9px] !py-0.5 !px-1.5">
                        {criticalCount} Critical
                      </span>
                    )}
                    <span className="font-mono text-xs font-bold text-foreground tabular-nums">
                      {deptKw.toFixed(1)} kW
                    </span>
                  </div>
                </button>

                {/* Subordinate Load Nodes */}
                {!isCollapsed && (
                  <div className="p-2 sm:p-3 space-y-2 border-t border-border/60">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {deptLoads.map((load) => (
                        <div
                          key={load.id}
                          onClick={() => onSelectLoad(load)}
                          className={cn(
                            "flex items-center justify-between p-2.5 rounded-md border bg-surface hover:border-[var(--accent)] cursor-pointer transition-all",
                            load.priority === "CRITICAL"
                              ? "border-[var(--danger-ring)]/40 hover:border-[var(--danger)]"
                              : "border-border"
                          )}
                        >
                          <div className="min-w-0 pr-2 space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[0.68rem] font-bold text-text-secondary">
                                {load.room}
                              </span>
                              <span className="text-text-tertiary">·</span>
                              <p className="font-sans text-xs font-semibold text-foreground truncate">
                                {load.equipment_name}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 text-[0.68rem] text-text-tertiary font-mono">
                              <span>Source: {load.source}</span>
                              <span>·</span>
                              <span className="text-[var(--healthy)] font-medium">
                                {load.protection_status}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-mono text-xs font-bold text-foreground tabular-nums">
                              {load.current_kw.toFixed(1)} kW
                            </span>
                            <span
                              className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono border uppercase tracking-wider",
                                getPriorityBadgeClass(load.priority)
                              )}
                            >
                              {load.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
