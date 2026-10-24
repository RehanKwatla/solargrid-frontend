import React, { useState } from "react";
import {
  ShieldAlert,
  Activity,
  HeartPulse,
  Baby,
  Stethoscope,
  ThermometerSnowflake,
  BedDouble,
  Building2,
  Cpu,
  Users,
  AlertTriangle,
  ArrowRight,
  Info,
  CheckCircle2,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  HOSPITAL_DEPARTMENTS,
  HOSPITAL_ROOMS,
  PRIORITY_POLICIES,
} from "@/data/hospitalData";
import type { HospitalDepartment, HospitalRoom, RoomPriority } from "@/data/types";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface DepartmentMapViewProps {
  onSelectDepartment?: (deptId: string) => void;
  onSelectRoom?: (room: HospitalRoom) => void;
  selectedDepartmentId?: string | null;
}

const DEPT_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  ShieldAlert,
  Activity,
  HeartPulse,
  Baby,
  Stethoscope,
  ThermometerSnowflake,
  BedDouble,
  Building2,
  Cpu,
  Users,
};

export function DepartmentMapView({
  onSelectDepartment,
  onSelectRoom,
  selectedDepartmentId,
}: DepartmentMapViewProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeDeptId, setActiveDeptId] = useState<string>(selectedDepartmentId || "dept-icu");
  const [floorFilter, setFloorFilter] = useState<string>("All");

  const activeDept =
    HOSPITAL_DEPARTMENTS.find((d) => d.id === activeDeptId) || HOSPITAL_DEPARTMENTS[0];

  const deptRooms = HOSPITAL_ROOMS.filter((r) => r.departmentId === activeDept.id);

  const filteredDepts =
    floorFilter === "All"
      ? HOSPITAL_DEPARTMENTS
      : HOSPITAL_DEPARTMENTS.filter((d) => d.floor.includes(floorFilter));

  const totalHospitalKw = HOSPITAL_DEPARTMENTS.reduce((sum, d) => sum + d.currentDemandKw, 0);

  return (
    <div className="space-y-6">
      {/* Floor Filter Bar & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card shadow-xs">
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-primary" />
          <span className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
            Campus Schematic Map
          </span>
          <span className="text-text-tertiary text-xs">|</span>
          <span className="text-xs text-text-secondary">
            Select a department to inspect live circuits & clinical priorities
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["All", "Floor 3", "Floor 2", "Floor 4", "Ground Floor", "Basement"].map((floor) => (
            <button
              key={floor}
              onClick={() => setFloorFilter(floor)}
              className={cn(
                "px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors",
                floorFilter === floor
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "bg-surface-soft text-text-secondary hover:text-foreground"
              )}
            >
              {floor}
            </button>
          ))}
        </div>
      </div>

      {/* Main Department Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredDepts.map((dept) => {
          const Icon = DEPT_ICONS[dept.iconName] || Building2;
          const isSelected = dept.id === activeDeptId;
          const pctOfHospital = Math.round((dept.currentDemandKw / totalHospitalKw) * 100);

          return (
            <div
              key={dept.id}
              onClick={() => {
                setActiveDeptId(dept.id);
                if (onSelectDepartment) onSelectDepartment(dept.id);
              }}
              className={cn(
                "p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden shadow-xs",
                isSelected
                  ? isDark
                    ? "bg-[#18231C] border-primary ring-1 ring-primary shadow-md"
                    : "bg-[#FFFFFF] border-primary ring-1 ring-primary shadow-md"
                  : "bg-card border-border hover:border-primary/50 hover:bg-surface-soft/60"
              )}
            >
              <div>
                {/* Department Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105",
                        dept.p0Count > 0
                          ? isDark
                            ? "bg-danger/10 border-danger/40 text-danger"
                            : "bg-danger/10 border-danger/40 text-danger"
                          : "bg-primary/10 border-primary/40 text-primary"
                      )}
                    >
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0">
                      <span className="block font-mono text-[10px] text-text-tertiary uppercase tracking-wider">
                        {dept.code} · {dept.floor}
                      </span>
                      <h3 className="font-sans text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {dept.name}
                      </h3>
                    </div>
                  </div>

                  {dept.activeAlerts > 0 ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-danger/15 border border-danger/40 text-danger font-mono text-[10px] font-bold">
                      <AlertTriangle size={11} /> {dept.activeAlerts} Alert
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-healthy/10 border border-healthy/30 text-healthy font-mono text-[10px] font-semibold">
                      <CheckCircle2 size={11} /> Nominal
                    </span>
                  )}
                </div>

                <p className="text-xs text-text-secondary line-clamp-2 mt-1 leading-relaxed">
                  {dept.description}
                </p>
              </div>

              {/* Department Metrics & Priority Composition */}
              <div className="mt-4 pt-3 border-t border-border/80 space-y-2.5">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-mono text-lg font-black text-foreground tabular-nums">
                      {dept.currentDemandKw}
                    </span>
                    <span className="font-mono text-xs text-text-secondary ml-1">kW</span>
                    <span className="font-mono text-[10px] text-text-tertiary ml-2">
                      ({pctOfHospital}% hospital)
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs font-semibold text-danger tabular-nums">
                      {dept.minRequiredKw} kW
                    </span>
                    <span className="font-mono text-[9px] text-text-tertiary block">
                      Min Protected Floor
                    </span>
                  </div>
                </div>

                {/* Priority Composition Segmented Bar */}
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-text-tertiary mb-1">
                    <span>Priority Allocation</span>
                    <span className="flex gap-2">
                      {dept.p0Count > 0 && <span className="text-danger font-bold">{dept.p0Count} P0</span>}
                      {dept.p1Count > 0 && <span className="text-warning font-bold">{dept.p1Count} P1</span>}
                      {dept.p2Count > 0 && <span className="text-healthy font-bold">{dept.p2Count} P2</span>}
                      {dept.p3Count > 0 && <span className="text-text-tertiary">{dept.p3Count} P3</span>}
                    </span>
                  </div>

                  <div className="h-1.5 w-full rounded-full bg-surface-soft overflow-hidden flex">
                    {dept.p0Count > 0 && (
                      <div
                        className="h-full bg-danger"
                        style={{ width: `${(dept.p0Count / dept.totalRooms) * 100}%` }}
                        title={`${dept.p0Count} P0 Life-Critical Rooms`}
                      />
                    )}
                    {dept.p1Count > 0 && (
                      <div
                        className="h-full bg-warning"
                        style={{ width: `${(dept.p1Count / dept.totalRooms) * 100}%` }}
                        title={`${dept.p1Count} P1 Essential Rooms`}
                      />
                    )}
                    {dept.p2Count > 0 && (
                      <div
                        className="h-full bg-healthy"
                        style={{ width: `${(dept.p2Count / dept.totalRooms) * 100}%` }}
                        title={`${dept.p2Count} P2 Clinical Support Rooms`}
                      />
                    )}
                    {dept.p3Count > 0 && (
                      <div
                        className="h-full bg-text-tertiary/40"
                        style={{ width: `${(dept.p3Count / dept.totalRooms) * 100}%` }}
                        title={`${dept.p3Count} P3 Flexible Rooms`}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Department Detailed Room Inspection Drawer/Section */}
      <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                Department Deep-Dive
              </span>
              <span className="pill pill-healthy !text-[9px]">
                {activeDept.code} · {activeDept.building}
              </span>
            </div>
            <h3 className="font-sans text-lg font-extrabold text-foreground">
              {activeDept.name} — Connected Circuits & Rooms
            </h3>
            <p className="font-mono text-xs text-text-secondary mt-0.5">
              Supervising Lead: <span className="text-foreground font-semibold">{activeDept.clinicalLead}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="font-mono text-lg font-black text-foreground tabular-nums">
                {activeDept.currentDemandKw} kW
              </span>
              <span className="font-mono text-[10px] text-text-tertiary block">
                Total Department Draw
              </span>
            </div>
          </div>
        </div>

        {/* Room Cards belonging to this Department */}
        {deptRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
            {deptRooms.map((room) => {
              const pol = PRIORITY_POLICIES[room.priority];
              return (
                <div
                  key={room.id}
                  onClick={() => onSelectRoom && onSelectRoom(room)}
                  className="p-3.5 rounded-xl border border-border bg-surface-soft/60 hover:border-primary hover:bg-surface-soft transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {room.name}
                      </span>
                      <span
                        className="px-1.5 py-0.2 rounded font-mono text-[9px] font-black border"
                        style={{
                          backgroundColor: isDark ? pol.bgTint : "rgba(0,0,0,0.04)",
                          borderColor: isDark ? pol.accentColor : pol.accentColorLight,
                          color: isDark ? pol.accentColor : pol.accentColorLight,
                        }}
                      >
                        {room.priority}
                      </span>
                    </div>

                    <p className="text-[11px] text-text-secondary line-clamp-1">
                      {room.occupancy}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="font-bold text-foreground tabular-nums">{room.currentKw} kW</span>
                      <span className="text-[10px] text-text-tertiary ml-1">(Min: {room.minRequiredKw})</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-primary group-hover:underline">
                      <span>Inspect</span>
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-text-tertiary border border-dashed border-border rounded-xl">
            Additional rooms in this department telemetry simulated. Click any room above for full device-level monitoring.
          </div>
        )}
      </div>
    </div>
  );
}
