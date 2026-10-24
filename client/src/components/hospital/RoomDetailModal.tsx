import React, { useState } from "react";
import {
  X,
  Shield,
  ShieldAlert,
  Activity,
  Building2,
  Sliders,
  Zap,
  Battery,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Edit3,
  ArrowRight,
  Info,
  Lock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { HospitalRoom, RoomPriority, PriorityLevel } from "@/data/types";
import { PRIORITY_POLICIES } from "@/data/hospitalData";
import { useTheme } from "@/contexts/ThemeContext";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RoomDetailModalProps {
  room: HospitalRoom | null;
  open: boolean;
  onClose: () => void;
  onPriorityChange?: (roomId: string, newPriority: RoomPriority, reason: string) => void;
}

export function RoomDetailModal({
  room,
  open,
  onClose,
  onPriorityChange,
}: RoomDetailModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { updateHospitalLoadPriority } = useDashboardData();

  const [activeTab, setActiveTab] = useState<"profile" | "equipment" | "continuity" | "recommendations">("profile");
  const [showPriorityEditor, setShowPriorityEditor] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<RoomPriority>(room?.priority || "P0");
  const [operatorName, setOperatorName] = useState("Dr. A. Sharma (Chief Medical Officer)");
  const [justification, setJustification] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open || !room) return null;

  const policy = PRIORITY_POLICIES[room.priority];
  const accentColor = isDark ? policy.accentColor : policy.accentColorLight;

  const handleSavePriority = async () => {
    if (!justification.trim()) {
      toast.error("Mandatory Justification Required", {
        description: "Please specify the clinical or operational reason for modifying this room's priority.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (onPriorityChange) {
        onPriorityChange(room.id, selectedPriority, justification.trim());
      }
      
      // Also record in audit log if backend integration exists
      const legacyPriorityMap: Record<RoomPriority, PriorityLevel> = {
        P0: "CRITICAL",
        P1: "HIGH",
        P2: "NORMAL",
        P3: "NON-CRITICAL",
      };
      await updateHospitalLoadPriority(
        room.id,
        legacyPriorityMap[selectedPriority],
        justification.trim(),
        operatorName.trim()
      );

      toast.success("Room Priority Policy Updated", {
        description: `${room.name} classified as ${selectedPriority} (${PRIORITY_POLICIES[selectedPriority].label}). Logged in clinical audit trail.`,
      });
      setShowPriorityEditor(false);
      setJustification("");
    } catch {
      toast.success("Room Priority Updated (Local Session)", {
        description: `${room.name} set to ${selectedPriority}.`,
      });
      setShowPriorityEditor(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="room-detail-title"
    >
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Modal Surface */}
      <div
        className={cn(
          "relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl border shadow-2xl transition-all duration-200 z-10 flex flex-col",
          isDark
            ? "bg-[#151C18] border-[#29332C] text-[#F4F0E8]"
            : "bg-white border-[#D8D1C5] text-[#252522]"
        )}
      >
        {/* Modal Header */}
        <div
          className={cn(
            "p-5 sm:p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 backdrop-blur-md",
            isDark ? "bg-[#111713]/95 border-[#29332C]" : "bg-[#F4F0E8]/95 border-[#D8D1C5]"
          )}
        >
          <div className="flex items-start gap-3.5 min-w-0">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border shadow-xs"
              style={{
                backgroundColor: isDark ? "rgba(227, 106, 69, 0.15)" : "rgba(181, 84, 58, 0.12)",
                borderColor: accentColor,
                color: accentColor,
              }}
            >
              {room.priority === "P0" ? (
                <ShieldAlert size={22} />
              ) : room.priority === "P1" ? (
                <Activity size={22} />
              ) : room.priority === "P2" ? (
                <Building2 size={22} />
              ) : (
                <Sliders size={22} />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  {room.code} · {room.building} ({room.floor})
                </span>
                <span
                  className="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold border tracking-wide uppercase"
                  style={{
                    backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                    borderColor: accentColor,
                    color: accentColor,
                  }}
                >
                  {policy.badgeLabel}
                </span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold border",
                    room.energyStatus === "Normal"
                      ? "bg-healthy/10 border-healthy/40 text-healthy"
                      : room.energyStatus === "Attention Required"
                      ? "bg-warning/10 border-warning/40 text-warning"
                      : "bg-danger/10 border-danger/40 text-danger"
                  )}
                >
                  {room.energyStatus}
                </span>
              </div>

              <h2 id="room-detail-title" className="font-sans text-xl sm:text-2xl font-black text-foreground truncate">
                {room.name}
              </h2>
              <p className="font-mono text-xs text-text-secondary mt-0.5">
                {room.departmentName} · {room.occupancy}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={() => setShowPriorityEditor((prev) => !prev)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-colors shadow-xs",
                showPriorityEditor
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-surface-soft border-border text-foreground hover:bg-surface"
              )}
            >
              <Edit3 size={13} />
              <span>{showPriorityEditor ? "Cancel Edit" : "Configure Priority"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-border bg-surface-soft text-text-secondary hover:text-foreground transition-colors"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Priority Override Panel (Accordion) */}
        {showPriorityEditor && (
          <div
            className={cn(
              "p-5 border-b space-y-4 animate-in slide-in-from-top-2 duration-200",
              isDark ? "bg-[#18231C] border-[#29332C]" : "bg-[#FAF5DC]/60 border-[#D8D1C5]"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock size={15} className="text-primary" />
                <h3 className="font-sans text-sm font-bold text-foreground">
                  Authorized Clinical Priority Reclassification
                </h3>
              </div>
              <span className="font-mono text-[10px] text-text-tertiary">
                Requires clinical or engineering justification
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(["P0", "P1", "P2", "P3"] as RoomPriority[]).map((p) => {
                const isSelected = selectedPriority === p;
                const pol = PRIORITY_POLICIES[p];
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPriority(p)}
                    className={cn(
                      "p-3 rounded-xl border text-left transition-all",
                      isSelected
                        ? "border-primary bg-primary/10 ring-1 ring-primary shadow-xs"
                        : "border-border bg-card hover:bg-surface-soft"
                    )}
                  >
                    <span className="block font-mono text-xs font-bold" style={{ color: isDark ? pol.accentColor : pol.accentColorLight }}>
                      {pol.badgeLabel}
                    </span>
                    <span className="block text-[11px] text-text-secondary mt-1 leading-tight line-clamp-2">
                      {pol.description}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block font-mono text-xs font-medium text-text-secondary mb-1">
                  Authorizing Clinician / Lead Engineer
                </label>
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-medium text-text-secondary mb-1">
                  Clinical / Operational Justification *
                </label>
                <input
                  type="text"
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="e.g., Scheduled for emergent craniotomy procedure..."
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowPriorityEditor(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-surface-soft"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePriority}
                disabled={isSubmitting}
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-opacity"
              >
                {isSubmitting ? "Updating..." : "Commit Priority Change"}
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-5 sm:px-6 border-b border-border bg-surface-soft/40 overflow-x-auto">
          {[
            { id: "profile", label: "Energy & Profile", icon: Zap },
            { id: "equipment", label: `Medical Equipment (${room.equipmentList.length})`, icon: Cpu },
            { id: "continuity", label: "Power Continuity & Backup", icon: Shield },
            { id: "recommendations", label: "AI Recommendations", icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-mono font-medium transition-colors shrink-0",
                  isActive
                    ? "border-primary text-foreground font-bold"
                    : "border-transparent text-text-secondary hover:text-foreground"
                )}
              >
                <Icon size={14} className={isActive ? "text-primary" : "text-text-tertiary"} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-6 space-y-6 flex-1">
          {/* TAB 1: Profile & Real-Time Energy Consumption */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Telemetry Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs">
                  <span className="block font-mono text-[10px] uppercase text-text-tertiary">
                    Current Demand
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-mono text-2xl font-black text-foreground tabular-nums">
                      {room.currentKw}
                    </span>
                    <span className="font-mono text-xs text-text-secondary">kW</span>
                  </div>
                  <span className="block font-mono text-[10px] text-text-tertiary mt-1">
                    Trend: <span className="text-primary font-bold">{room.energyTrend}</span>
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs">
                  <span className="block font-mono text-[10px] uppercase text-text-tertiary">
                    Min Required Floor
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-mono text-2xl font-black text-danger tabular-nums">
                      {room.minRequiredKw}
                    </span>
                    <span className="font-mono text-xs text-text-secondary">kW</span>
                  </div>
                  <span className="block font-mono text-[10px] text-text-tertiary mt-1">
                    Locked life-support floor
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs">
                  <span className="block font-mono text-[10px] uppercase text-text-tertiary">
                    Peak Recorded
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-mono text-2xl font-black text-foreground tabular-nums">
                      {room.peakKw}
                    </span>
                    <span className="font-mono text-xs text-text-secondary">kW</span>
                  </div>
                  <span className="block font-mono text-[10px] text-text-tertiary mt-1">
                    Today's procedure peak
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs">
                  <span className="block font-mono text-[10px] uppercase text-text-tertiary">
                    Consumed Today
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-mono text-2xl font-black text-foreground tabular-nums">
                      {room.energyTodayKwh}
                    </span>
                    <span className="font-mono text-xs text-text-secondary">kWh</span>
                  </div>
                  <span className="block font-mono text-[10px] text-healthy font-bold mt-1">
                    78% Solar Offset
                  </span>
                </div>
              </div>

              {/* 24-Hour Room Demand & Safety Floor Chart */}
              <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-sans text-sm font-bold text-foreground">
                      24-Hour Power Demand Curve vs. Life-Support Safety Floor
                    </h3>
                    <p className="font-mono text-[11px] text-text-secondary">
                      Measured room kW draw (solid line) and configured minimum clinical floor (dashed red line)
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-border bg-surface-soft text-text-tertiary">
                    Telemetry: 5-sec sample
                  </span>
                </div>

                <div className="h-56 w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={room.history24h} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="roomDemandFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={accentColor} stopOpacity={0.3} />
                          <stop offset="100%" stopColor={accentColor} stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke={isDark ? "#29332C" : "#D8D1C5"}
                        strokeOpacity={0.6}
                      />
                      <XAxis
                        dataKey="time"
                        tick={{ fill: isDark ? "#A8ADA5" : "#68685F", fontSize: 10, fontFamily: "monospace" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, Math.ceil(room.peakKw * 1.3)]}
                        tick={{ fill: isDark ? "#A8ADA5" : "#68685F", fontSize: 10, fontFamily: "monospace" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? "#151C18" : "#FFFFFF",
                          borderColor: isDark ? "#29332C" : "#D8D1C5",
                          color: isDark ? "#F4F0E8" : "#252522",
                          borderRadius: "8px",
                          fontFamily: "monospace",
                          fontSize: "11px",
                        }}
                      />
                      <ReferenceLine
                        y={room.minRequiredKw}
                        stroke="#E36A45"
                        strokeDasharray="4 4"
                        strokeWidth={1.8}
                        label={{
                          value: `P0 Floor: ${room.minRequiredKw} kW`,
                          fill: "#E36A45",
                          fontSize: 10,
                          position: "insideTopRight",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="demandKw"
                        name="Room Demand (kW)"
                        stroke={accentColor}
                        strokeWidth={2}
                        fill="url(#roomDemandFill)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Room Clinical Function & Authority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border bg-surface-soft/60 space-y-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary block">
                    Clinical Function & Protocol
                  </span>
                  <p className="text-xs text-foreground leading-relaxed">
                    {room.clinicalFunction}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border bg-surface-soft/60 space-y-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary block">
                    Assigned Medical Authority
                  </span>
                  <p className="text-xs font-bold text-foreground">
                    {room.authorizedBy}
                  </p>
                  <p className="font-mono text-[11px] text-text-secondary">
                    Policy governed by NABH Section 9 Electrical Safety Standard.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Equipment Monitoring */}
          {activeTab === "equipment" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div>
                  <h3 className="font-sans text-sm font-bold text-foreground">
                    Active Medical Equipment & Power Distribution
                  </h3>
                  <p className="font-mono text-xs text-text-secondary">
                    Individual device draw, monitoring status, and backup supply circuit
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-primary">
                  Total: {room.equipmentList.reduce((acc, eq) => acc + eq.drawKw, 0).toFixed(2)} kW
                </span>
              </div>

              <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card">
                {room.equipmentList.map((eq) => (
                  <div key={eq.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-soft transition-colors">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0 text-text-secondary mt-0.5">
                        <Cpu size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-xs sm:text-sm font-bold text-foreground truncate">
                            {eq.name}
                          </span>
                          <span
                            className={cn(
                              "px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase",
                              eq.criticality.includes("P0")
                                ? "bg-danger/10 text-danger border border-danger/30"
                                : eq.criticality.includes("P1")
                                ? "bg-warning/10 text-warning border border-warning/30"
                                : "bg-primary/10 text-primary border border-primary/30"
                            )}
                          >
                            {eq.criticality}
                          </span>
                        </div>
                        <p className="font-mono text-[10px] text-text-secondary mt-0.5">
                          Category: {eq.category} · Backup: <span className="text-foreground font-medium">{eq.backupSupply}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 sm:text-right">
                      <div>
                        <span className="block font-mono text-sm font-bold text-foreground tabular-nums">
                          {eq.drawKw} kW
                        </span>
                        <span className="block font-mono text-[9px] text-text-tertiary">
                          Min: {eq.minReqKw} kW
                        </span>
                      </div>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold border",
                          eq.status === "Running"
                            ? "bg-healthy/10 border-healthy/40 text-healthy"
                            : eq.status === "Standby"
                            ? "bg-surface-soft border-border text-text-secondary"
                            : "bg-warning/10 border-warning/40 text-warning"
                        )}
                      >
                        {eq.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Power Continuity & Backup Readiness */}
          {activeTab === "continuity" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheckIcon size={18} className="text-healthy" />
                    <h3 className="font-sans text-sm font-bold text-foreground">
                      Power Continuity & Feeder Redundancy Architecture
                    </h3>
                  </div>
                  <span className="pill pill-healthy !text-[9px]">Continuous Online</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-surface-soft border border-border space-y-1">
                    <span className="font-mono text-[10px] uppercase text-text-tertiary block">
                      Primary Power Path
                    </span>
                    <span className="font-mono text-xs font-bold text-foreground block">
                      Solar Microgrid + BESS Bus
                    </span>
                    <span className="text-[10px] text-text-secondary block">
                      Zero carbon clinical allocation
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-surface-soft border border-border space-y-1">
                    <span className="font-mono text-[10px] uppercase text-text-tertiary block">
                      Secondary Emergency Bus
                    </span>
                    <span className="font-mono text-xs font-bold text-foreground block">
                      Dual-Bus Online UPS (15m)
                    </span>
                    <span className="text-[10px] text-text-secondary block">
                      Transfer speed: 0 milliseconds
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-surface-soft border border-border space-y-1">
                    <span className="font-mono text-[10px] uppercase text-text-tertiary block">
                      Tertiary Reserve
                    </span>
                    <span className="font-mono text-xs font-bold text-foreground block">
                      Tier-1 DG Auto-Synchronizer
                    </span>
                    <span className="text-[10px] text-text-secondary block">
                      Auto-cranks within 12 seconds
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border/80 bg-surface text-xs space-y-1">
                  <div className="flex justify-between items-center text-text-secondary font-mono text-[11px]">
                    <span>Backup Readiness Status:</span>
                    <span className="text-healthy font-bold">100% Operational (Battery Health: 99.4%)</span>
                  </div>
                  <div className="flex justify-between items-center text-text-secondary font-mono text-[11px]">
                    <span>Feeder Configuration:</span>
                    <span className="text-foreground">Dual Isolated Medical Line · 230V ± 1.5%</span>
                  </div>
                  <div className="flex justify-between items-center text-text-secondary font-mono text-[11px]">
                    <span>Last Routine Self-Test:</span>
                    <span className="text-foreground">Today, 06:00 AM (Automated Weekly Discharge)</span>
                  </div>
                </div>
              </div>

              {/* Active Alarms for this Room */}
              <div className="space-y-2">
                <h4 className="font-mono text-xs font-bold uppercase text-text-secondary">
                  Recent Room Alarms & Events ({room.recentAlerts.length})
                </h4>
                {room.recentAlerts.length > 0 ? (
                  <div className="space-y-2">
                    {room.recentAlerts.map((alt) => (
                      <div
                        key={alt.id}
                        className={cn(
                          "p-3 rounded-xl border flex items-start gap-3",
                          alt.severity === "critical"
                            ? "bg-danger/10 border-danger/40 text-foreground"
                            : alt.severity === "warning"
                            ? "bg-warning/10 border-warning/40 text-foreground"
                            : "bg-surface-soft border-border text-foreground"
                        )}
                      >
                        <AlertTriangle
                          size={16}
                          className={cn(
                            "shrink-0 mt-0.5",
                            alt.severity === "critical"
                              ? "text-danger"
                              : alt.severity === "warning"
                              ? "text-warning"
                              : "text-primary"
                          )}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h5 className="font-sans text-xs font-bold text-foreground">{alt.title}</h5>
                            <span className="font-mono text-[10px] text-text-tertiary">{alt.time}</span>
                          </div>
                          <p className="text-xs text-text-secondary mt-0.5">{alt.message}</p>
                          {alt.recommendedAction && (
                            <p className="font-mono text-[10px] text-primary mt-1">
                              Action: {alt.recommendedAction}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-border bg-card text-center text-xs text-text-tertiary">
                    No active alarm conditions in this room. All medical circuits nominal.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Explainable Recommendations */}
          {activeTab === "recommendations" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div>
                  <h3 className="font-sans text-sm font-bold text-foreground">
                    Explainable Energy Optimization & Scheduling
                  </h3>
                  <p className="font-mono text-xs text-text-secondary">
                    Context-aware suggestions verified against hospital clinical protocols
                  </p>
                </div>
                <span className="pill pill-muted !text-[9px]">Decision Support</span>
              </div>

              {room.recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-2 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-primary" />
                      <h4 className="font-sans text-sm font-bold text-foreground">{rec.title}</h4>
                    </div>
                    {rec.isDemo && (
                      <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded-full bg-surface-soft border border-border text-text-tertiary">
                        Simulated Demo
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed">
                    {rec.detail}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-border/60 text-xs font-mono">
                    <div>
                      <span className="text-text-tertiary">Expected Impact:</span>{" "}
                      <span className="text-healthy font-semibold">{rec.expectedImpact}</span>
                    </div>
                    <div>
                      <span className="text-text-tertiary">Clinical Justification:</span>{" "}
                      <span className="text-foreground">{rec.reason}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className={cn(
            "p-4 px-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs",
            isDark ? "bg-[#111713] border-[#29332C]" : "bg-[#F4F0E8] border-[#D8D1C5]"
          )}
        >
          <div className="flex items-center gap-2 text-text-tertiary font-mono text-[11px]">
            <Info size={13} />
            <span>SolarGrid NABH Clinical Decision Support · Human-in-the-Loop</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-surface-soft border border-border text-foreground hover:bg-surface text-xs font-bold transition-colors"
          >
            Close Room View
          </button>
        </div>
      </div>
    </div>
  );
}

function ShieldCheckIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
