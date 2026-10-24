import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Shield,
  ShieldAlert,
  Activity,
  Building2,
  Sliders,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Info,
  ChevronDown,
  CheckCircle2,
  Lock,
  ArrowUpDown,
  Zap,
} from "lucide-react";
import {
  HOSPITAL_ROOMS,
  HOSPITAL_DEPARTMENTS,
  PRIORITY_POLICIES,
  getHospitalPrioritySummary,
} from "@/data/hospitalData";
import type { HospitalRoom, RoomPriority, EnergyAvailabilityStatus } from "@/data/types";
import { RoomDetailModal } from "@/components/hospital/RoomDetailModal";
import { DepartmentMapView } from "@/components/hospital/DepartmentMapView";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export default function DepartmentsRooms() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // State
  const [activeTab, setActiveTab] = useState<"rooms" | "departments">("rooms");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("ALL");
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"priority" | "demand" | "name" | "alerts">("priority");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Selected room for detailed modal
  const [selectedRoom, setSelectedRoom] = useState<HospitalRoom | null>(null);
  const [roomModalOpen, setRoomModalOpen] = useState(false);

  // Local rooms copy to allow live priority reclassifications
  const [rooms, setRooms] = useState<HospitalRoom[]>(HOSPITAL_ROOMS);

  const prioritySummary = useMemo(() => getHospitalPrioritySummary(rooms), [rooms]);

  // Filtering & Sorting
  const filteredRooms = useMemo(() => {
    let result = [...rooms];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.code.toLowerCase().includes(q) ||
          r.departmentName.toLowerCase().includes(q) ||
          r.clinicalFunction.toLowerCase().includes(q) ||
          r.equipmentList.some((eq) => eq.name.toLowerCase().includes(q))
      );
    }

    // Department filter
    if (selectedDept !== "ALL") {
      result = result.filter((r) => r.departmentId === selectedDept);
    }

    // Priority filter
    if (selectedPriority !== "ALL") {
      result = result.filter((r) => r.priority === selectedPriority);
    }

    // Energy Status filter
    if (selectedStatus !== "ALL") {
      result = result.filter((r) => r.energyStatus === selectedStatus);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "priority") {
        const order: Record<RoomPriority, number> = { P0: 0, P1: 1, P2: 2, P3: 3 };
        return order[a.priority] - order[b.priority];
      }
      if (sortBy === "demand") {
        return b.currentKw - a.currentKw;
      }
      if (sortBy === "alerts") {
        return b.recentAlerts.length - a.recentAlerts.length;
      }
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [rooms, searchQuery, selectedDept, selectedPriority, selectedStatus, sortBy]);

  const handlePriorityChange = (roomId: string, newPriority: RoomPriority) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, priority: newPriority } : r))
    );
  };

  const openRoomModal = (room: HospitalRoom) => {
    setSelectedRoom(room);
    setRoomModalOpen(true);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto p-3 sm:p-5 lg:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">
              CLINICAL ENERGY ARCHITECTURE · LEVEL 2 & 3
            </span>
            <span className="pill pill-healthy !text-[9px] !py-0.5">NABH Protected</span>
          </div>
          <h1 className="heading-xl text-foreground">Departments, Rooms & Critical Loads</h1>
          <p className="font-sans text-xs sm:text-sm text-text-secondary mt-1 max-w-3xl">
            Granular room-by-room clinical power management. View real-time device draw, life-support safety floors, and configurable P0–P3 protection policies.
          </p>
        </div>

        {/* View Switcher: Rooms List vs. Department Schematic Map */}
        <div className="flex items-center p-1 rounded-xl border border-border bg-surface-soft shrink-0">
          <button
            onClick={() => setActiveTab("rooms")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all",
              activeTab === "rooms"
                ? "bg-card text-foreground font-bold shadow-xs"
                : "text-text-secondary hover:text-foreground"
            )}
          >
            Room Explorer ({rooms.length})
          </button>
          <button
            onClick={() => setActiveTab("departments")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all",
              activeTab === "departments"
                ? "bg-card text-foreground font-bold shadow-xs"
                : "text-text-secondary hover:text-foreground"
            )}
          >
            Department Map (10)
          </button>
        </div>
      </div>

      {/* 4 Priority Policy KPI Summary Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {(["P0", "P1", "P2", "P3"] as RoomPriority[]).map((p) => {
          const pol = PRIORITY_POLICIES[p];
          const summary =
            p === "P0"
              ? prioritySummary.p0
              : p === "P1"
              ? prioritySummary.p1
              : p === "P2"
              ? prioritySummary.p2
              : prioritySummary.p3;

          const accentColor = isDark ? pol.accentColor : pol.accentColorLight;
          const isFilterActive = selectedPriority === p;

          return (
            <div
              key={p}
              onClick={() => setSelectedPriority(isFilterActive ? "ALL" : p)}
              className={cn(
                "p-4 rounded-2xl border transition-all cursor-pointer shadow-xs flex flex-col justify-between group",
                isFilterActive
                  ? "border-primary ring-1 ring-primary bg-surface-soft"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                  <span className="font-mono text-xs font-bold" style={{ color: accentColor }}>
                    {pol.badgeLabel}
                  </span>
                </div>
                <span className="font-mono text-xs text-text-tertiary">
                  {summary.count} Rooms
                </span>
              </div>

              <div className="mt-3">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-2xl font-black text-foreground tabular-nums">
                    {summary.demandKw}
                  </span>
                  <span className="font-mono text-xs text-text-secondary">kW</span>
                  <span className="font-mono text-[11px] text-text-tertiary ml-1">
                    ({summary.percentage}% load)
                  </span>
                </div>
                <span className="block text-[11px] text-text-secondary mt-1 font-medium truncate">
                  {summary.coverage}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* RENDER TAB 1: ROOM EXPLORER */}
      {activeTab === "rooms" && (
        <div className="space-y-4">
          {/* Controls Bar: Search, Filters, Sorters & View Toggle */}
          <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[240px]">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by room name, code, medical equipment (e.g. ventilator, mri, ot)..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-surface text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-text-tertiary"
                />
              </div>

              {/* View Toggle (Grid vs Table) */}
              <div className="flex items-center gap-2 self-end lg:self-center">
                <div className="flex items-center p-0.5 rounded-lg border border-border bg-surface-soft">
                  <button
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                    className={cn(
                      "p-1.5 rounded-md text-xs transition-colors",
                      viewMode === "grid"
                        ? "bg-card text-foreground shadow-xs"
                        : "text-text-tertiary hover:text-foreground"
                    )}
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    aria-label="Table view"
                    className={cn(
                      "p-1.5 rounded-md text-xs transition-colors",
                      viewMode === "table"
                        ? "bg-card text-foreground shadow-xs"
                        : "text-text-tertiary hover:text-foreground"
                    )}
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-border/60 text-xs">
              {/* Department Filter */}
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] text-text-tertiary uppercase">Department:</span>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-border bg-surface text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="ALL">All Departments ({HOSPITAL_DEPARTMENTS.length})</option>
                  {HOSPITAL_DEPARTMENTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.code} — {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] text-text-tertiary uppercase">Priority:</span>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-border bg-surface text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="P0">P0 — Life-Critical</option>
                  <option value="P1">P1 — Clinically Essential</option>
                  <option value="P2">P2 — Clinical Support</option>
                  <option value="P3">P3 — Flexible / Non-Critical</option>
                </select>
              </div>

              {/* Energy Status Filter */}
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] text-text-tertiary uppercase">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-border bg-surface text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Normal">Normal</option>
                  <option value="Attention Required">Attention Required</option>
                  <option value="Backup Active">Backup Active</option>
                  <option value="Energy Constraint">Energy Constraint</option>
                  <option value="Offline">Offline / Data Unavailable</option>
                </select>
              </div>

              {/* Sorter */}
              <div className="flex items-center gap-1.5 ml-auto">
                <ArrowUpDown size={13} className="text-text-tertiary" />
                <span className="font-mono text-[10px] text-text-tertiary uppercase">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2.5 py-1 rounded-lg border border-border bg-surface text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="priority">Priority Level (P0 first)</option>
                  <option value="demand">Current Demand (High to Low)</option>
                  <option value="alerts">Active Alarms</option>
                  <option value="name">Room Name</option>
                </select>
              </div>
            </div>
          </div>

          {/* RESULTS: GRID VIEW */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRooms.map((room) => {
                const pol = PRIORITY_POLICIES[room.priority];
                const accentColor = isDark ? pol.accentColor : pol.accentColorLight;

                return (
                  <div
                    key={room.id}
                    className="p-4 rounded-2xl border border-border bg-card shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Room Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <span className="block font-mono text-[10px] text-text-tertiary uppercase tracking-wider">
                            {room.code} · {room.floor}
                          </span>
                          <h3 className="font-sans text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                            {room.name}
                          </h3>
                          <span className="block text-[11px] text-text-secondary truncate mt-0.5">
                            {room.departmentName}
                          </span>
                        </div>

                        <span
                          className="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold border tracking-wide uppercase shrink-0"
                          style={{
                            backgroundColor: isDark ? pol.bgTint : "rgba(0,0,0,0.04)",
                            borderColor: accentColor,
                            color: accentColor,
                          }}
                        >
                          {room.priority}
                        </span>
                      </div>

                      {/* Power Stats Bar */}
                      <div className="p-3 rounded-xl bg-surface-soft/60 border border-border my-3 space-y-1.5">
                        <div className="flex items-baseline justify-between">
                          <div>
                            <span className="font-mono text-base font-black text-foreground tabular-nums">
                              {room.currentKw}
                            </span>
                            <span className="font-mono text-xs text-text-secondary ml-1">kW</span>
                          </div>
                          <span className="font-mono text-xs text-danger tabular-nums">
                            Min: {room.minRequiredKw} kW
                          </span>
                        </div>

                        {/* Power Load Gauge */}
                        <div className="h-1.5 w-full rounded-full bg-surface overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, (room.currentKw / room.peakKw) * 100)}%`,
                              backgroundColor: accentColor,
                            }}
                          />
                        </div>
                      </div>

                      {/* Room Metadata Badges */}
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-text-secondary">
                          <span className="text-[11px]">Backup Architecture:</span>
                          <span className="font-mono text-[11px] text-foreground truncate max-w-[170px]" title={room.backupStatus}>
                            {room.backupStatus.split("·")[0]}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-text-secondary">
                          <span className="text-[11px]">Operating State:</span>
                          <span className="font-medium text-foreground truncate max-w-[170px]">
                            {room.occupancy}
                          </span>
                        </div>

                        {room.recentAlerts.length > 0 && (
                          <div className="flex items-center gap-1.5 text-[11px] text-warning font-mono pt-1">
                            <AlertTriangle size={12} className="shrink-0" />
                            <span className="truncate">{room.recentAlerts[0].title}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-mono font-medium",
                          room.energyStatus === "Normal"
                            ? "text-healthy bg-healthy/10"
                            : "text-warning bg-warning/10"
                        )}
                      >
                        {room.energyStatus}
                      </span>

                      <button
                        onClick={() => openRoomModal(room)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-soft hover:bg-primary hover:text-primary-foreground text-foreground border border-border text-xs font-mono font-semibold transition-colors shadow-xs"
                      >
                        <span>View Room Details</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* RESULTS: COMPACT TABLE VIEW */}
          {viewMode === "table" && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-surface-soft/80 border-b border-border font-mono text-[11px] text-text-tertiary uppercase">
                    <tr>
                      <th className="py-3 px-4">Room & Department</th>
                      <th className="py-3 px-3">Priority</th>
                      <th className="py-3 px-3 text-right">Current Draw</th>
                      <th className="py-3 px-3 text-right">Min Floor</th>
                      <th className="py-3 px-3">Backup Source</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredRooms.map((room) => {
                      const pol = PRIORITY_POLICIES[room.priority];
                      return (
                        <tr
                          key={room.id}
                          className="hover:bg-surface-soft/50 transition-colors cursor-pointer"
                          onClick={() => openRoomModal(room)}
                        >
                          <td className="py-3 px-4">
                            <span className="font-bold text-foreground block">{room.name}</span>
                            <span className="font-mono text-[10px] text-text-tertiary block">
                              {room.code} · {room.departmentName}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className="px-2 py-0.5 rounded font-mono text-[10px] font-black border"
                              style={{
                                color: isDark ? pol.accentColor : pol.accentColorLight,
                                borderColor: isDark ? pol.accentColor : pol.accentColorLight,
                                backgroundColor: isDark ? pol.bgTint : "transparent",
                              }}
                            >
                              {room.priority}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-foreground tabular-nums">
                            {room.currentKw} kW
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-danger tabular-nums">
                            {room.minRequiredKw} kW
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px] text-text-secondary truncate max-w-[200px]">
                            {room.backupStatus.split("·")[0]}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold border",
                                room.energyStatus === "Normal"
                                  ? "bg-healthy/10 border-healthy/40 text-healthy"
                                  : "bg-warning/10 border-warning/40 text-warning"
                              )}
                            >
                              {room.energyStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openRoomModal(room);
                              }}
                              className="px-2.5 py-1 rounded bg-surface-soft hover:bg-primary hover:text-primary-foreground border border-border text-[11px] font-mono font-bold transition-colors"
                            >
                              Details →
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filteredRooms.length === 0 && (
            <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card space-y-2">
              <p className="font-sans text-sm font-bold text-foreground">No matching clinical rooms found</p>
              <p className="text-xs text-text-secondary">
                Try adjusting your search query, priority level, or department filter.
              </p>
            </div>
          )}
        </div>
      )}

      {/* RENDER TAB 2: DEPARTMENT SCHEMATIC MAP */}
      {activeTab === "departments" && (
        <DepartmentMapView
          onSelectRoom={(room) => openRoomModal(room)}
        />
      )}

      {/* Dedicated Room Detail Modal */}
      <RoomDetailModal
        room={selectedRoom}
        open={roomModalOpen}
        onClose={() => setRoomModalOpen(false)}
        onPriorityChange={handlePriorityChange}
      />
    </div>
  );
}
