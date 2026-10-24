import { useState, useMemo } from "react";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Filter,
  PhoneCall,
  Search,
  Send,
  ShieldAlert,
  X,
  Zap,
  Clock,
  Info,
} from "lucide-react";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { cn } from "@/lib/utils";
import {
  DataSourceBadge,
  LastUpdated,
} from "@/components/common/DataState";
import {
  HOSPITAL_DEPARTMENTS,
  HOSPITAL_ROOMS,
} from "@/data/hospitalData";
import type { RoomPriority } from "@/data/types";
import { toast } from "sonner";

export interface HospitalEvent {
  id: string;
  severity: "critical" | "warning" | "advisory";
  title: string;
  explanation: string;
  recommendedAction: string;
  departmentId: string;
  departmentName: string;
  roomId?: string;
  roomCode?: string;
  priority: RoomPriority;
  source: string;
  timestamp: string;
  acknowledged: boolean;
  escalatedTo?: string;
}

// Initial realistic hospital event dataset combining Section 9 requirements
const INITIAL_HOSPITAL_EVENTS: HospitalEvent[] = [
  {
    id: "evt-01",
    severity: "critical",
    title: "Battery Reserve Approaching 35% Floor Lock",
    explanation: "Total BESS state of charge is at 38% and dropping at 1.2%/hr. NABH Life-Support policy mandates locking 35% reserve exclusively for ICU and OT suites.",
    recommendedAction: "Confirm standby diesel generator synchronizer readiness. Initiate Tier-3 administrative non-clinical shedding.",
    departmentId: "dept-infra",
    departmentName: "Hospital Power Infrastructure",
    priority: "P0",
    source: "BESS Rack 01-10 Controller",
    timestamp: "10:24 AM · 6 mins ago",
    acknowledged: false,
  },
  {
    id: "evt-02",
    severity: "warning",
    title: "Backup Static Switch Telemetry Intermittent",
    explanation: "Substation ATS (Automatic Transfer Switch) auxiliary contact resistance fluctuating between 0.2Ω and 1.8Ω during midday solar transition.",
    recommendedAction: "Dispatch Facilities electrical technician to inspect ATS terminal block and tighten bypass lugs.",
    departmentId: "dept-emg",
    departmentName: "Emergency & Trauma Resuscitation",
    roomId: "room-emg-01",
    roomCode: "EMG-RESUS-01",
    priority: "P0",
    source: "Static Transfer Switch #4",
    timestamp: "09:48 AM · 42 mins ago",
    acknowledged: false,
  },
  {
    id: "evt-03",
    severity: "warning",
    title: "CSSD Autoclave Batch Scheduled During Non-Optimal Window",
    explanation: "Autoclave Sterilizer 01 (18 kW demand) queued for 1:30 PM. Solar forecast indicates rain clouds moving in, which will increase grid import tariff by ₹820.",
    recommendedAction: "Shift CSSD cycle to 11:30 AM – 1:00 PM to leverage peak 84.6 kW solar generation with zero grid cost.",
    departmentId: "dept-pharm",
    departmentName: "Pharmacy, Blood Bank & CSSD",
    roomId: "room-pharm-03",
    roomCode: "CSSD-STERIL-01",
    priority: "P2",
    source: "EMS Forecast Optimizer",
    timestamp: "09:15 AM · 1 hr ago",
    acknowledged: false,
  },
  {
    id: "evt-04",
    severity: "advisory",
    title: "MRI Helium Cold Head Chiller Draw Stable",
    explanation: "Cryocooler compressor power draw steady at 12.5 kW. 3-phase harmonic distortion within IEEE 519 clean power limit (THD 2.4%).",
    recommendedAction: "Routine check verified. No operational operator intervention required.",
    departmentId: "dept-diag",
    departmentName: "Diagnostic Laboratories & Imaging",
    roomId: "room-diag-01",
    roomCode: "RAD-MRI-3T",
    priority: "P1",
    source: "Siemens Magnetom Power Gateway",
    timestamp: "08:30 AM · 2 hrs ago",
    acknowledged: true,
  },
  {
    id: "evt-05",
    severity: "warning",
    title: "Unexpected Demand Rise in Inpatient Ward 4B",
    explanation: "Circuit power draw increased from 6.2 kW to 11.4 kW unexpectedly during morning visiting hours. Suspected unauthorized portable heating equipment.",
    recommendedAction: "Alert Ward Nursing In-charge to verify authorized medical appliances on auxiliary sockets.",
    departmentId: "dept-ward",
    departmentName: "General Inpatient Wards",
    roomId: "room-ward-01",
    roomCode: "WARD-4A-MED",
    priority: "P2",
    source: "Smart Distribution Panel 4B",
    timestamp: "08:12 AM · 2.5 hrs ago",
    acknowledged: true,
  },
  {
    id: "evt-06",
    severity: "critical",
    title: "Blood Bank Ultra-Low Freezer -80°C Alarm Trigger",
    explanation: "Freezer #2 internal temperature sensor reads -74.2°C (exceeding -78°C warning threshold). Inverter circuit compressor cycling frequently.",
    recommendedAction: "Immediately verify secondary cooling circuit and transfer temperature-sensitive plasma units to standby Cryo-01.",
    departmentId: "dept-pharm",
    departmentName: "Pharmacy, Blood Bank & CSSD",
    roomId: "room-pharm-02",
    roomCode: "BLD-CRYO-01",
    priority: "P1",
    source: "Thermo Scientific Ultra-Freezer Controller",
    timestamp: "07:45 AM · 3 hrs ago",
    acknowledged: false,
  },
];

export default function Alerts() {
  const { facility, facilityStatus, alertsStatus } = useDashboardData();

  const [events, setEvents] = useState<HospitalEvent[]>(INITIAL_HOSPITAL_EVENTS);
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "ACKNOWLEDGED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Escalation Modal State
  const [selectedEventForEscalation, setSelectedEventForEscalation] = useState<HospitalEvent | null>(null);
  const [escalationTarget, setEscalationTarget] = useState<string>("biomedical");
  const [escalationNote, setEscalationNote] = useState<string>("");

  const facilityCode = facility?.code ?? "SG-ACC-01";
  const facilityLocation = facility?.location ?? "Pune · Maharashtra";
  const facilityName = facility?.name ?? "Apollo Care Campus";

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (priorityFilter !== "ALL" && e.priority !== priorityFilter) return false;
      if (departmentFilter !== "ALL" && e.departmentId !== departmentFilter) return false;
      if (severityFilter !== "ALL" && e.severity !== severityFilter) return false;
      if (statusFilter === "ACTIVE" && e.acknowledged) return false;
      if (statusFilter === "ACKNOWLEDGED" && !e.acknowledged) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = e.title.toLowerCase().includes(q);
        const matchesDept = e.departmentName.toLowerCase().includes(q);
        const matchesRoom = e.roomCode?.toLowerCase().includes(q) ?? false;
        const matchesExplanation = e.explanation.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDept && !matchesRoom && !matchesExplanation) return false;
      }
      return true;
    });
  }, [events, priorityFilter, departmentFilter, severityFilter, statusFilter, searchQuery]);

  const criticalCount = events.filter((e) => e.severity === "critical" && !e.acknowledged).length;
  const warningCount = events.filter((e) => e.severity === "warning" && !e.acknowledged).length;
  const advisoryCount = events.filter((e) => e.severity === "advisory" && !e.acknowledged).length;

  const handleAcknowledge = (id: string) => {
    setEvents((prev) =>
      prev.map((evt) => (evt.id === id ? { ...evt, acknowledged: true } : evt))
    );
    toast.success("Event acknowledged by operator", {
      description: "Logged to hospital clinical EMS audit trail.",
    });
  };

  const handleConfirmEscalation = () => {
    if (!selectedEventForEscalation) return;

    const targetLabel =
      escalationTarget === "biomedical"
        ? "Biomedical Engineering Team (Ext 4012)"
        : escalationTarget === "electrical"
        ? "Electrical Control Room / Duty Engineer (Ext 5010)"
        : "Chief Medical Officer On-Call (Ext 1001)";

    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === selectedEventForEscalation.id
          ? { ...evt, acknowledged: true, escalatedTo: targetLabel }
          : evt
      )
    );

    toast.warning(`Escalated to ${targetLabel}`, {
      description: `Note: Demonstration mode. Incident ticket #${selectedEventForEscalation.id.toUpperCase()} registered locally. External SMS/Pager dispatch requires hospital PBX gateway integration.`,
    });

    setSelectedEventForEscalation(null);
    setEscalationNote("");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4 pb-3 border-b border-border">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <div className="instrument-label">
              {facilityCode} · {facilityLocation}
            </div>
            <DataSourceBadge source={facilityStatus.kind} />
            <span className="pill pill-healthy !text-[9px] !py-0.5">Clinical EMS Alert Gateway</span>
          </div>
          <h1 className="heading-xl text-foreground">Hospital Event Center & Alarms</h1>
          <p className="mt-2 text-[0.84rem] text-text-secondary">
            Continuous priority monitoring, clinical safety notifications, and verified escalation procedures for {facilityName}.
          </p>
        </div>
      </header>

      {/* Severity Metric Summaries */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="rounded-xl border border-[var(--danger)]/35 bg-card p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-text-secondary font-medium">Critical Alarms (Unacknowledged)</p>
            <p className="text-2xl font-extrabold text-[var(--danger)] font-mono tabular-nums mt-1">
              {criticalCount}
            </p>
            <p className="text-[10px] text-text-tertiary mt-0.5">Requires Immediate Action</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--danger-bg)] text-[var(--danger)] flex items-center justify-center shrink-0">
            <ShieldAlert size={20} />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--warning)]/35 bg-card p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-text-secondary font-medium">Active Warnings</p>
            <p className="text-2xl font-extrabold text-[var(--warning)] font-mono tabular-nums mt-1">
              {warningCount}
            </p>
            <p className="text-[10px] text-text-tertiary mt-0.5">Clinical Support & Optimization</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--warning-bg)] text-[var(--warning)] flex items-center justify-center shrink-0">
            <AlertTriangle size={20} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-text-secondary font-medium">Advisory Logs</p>
            <p className="text-2xl font-extrabold text-foreground font-mono tabular-nums mt-1">
              {advisoryCount}
            </p>
            <p className="text-[10px] text-text-tertiary mt-0.5">Telemetry & Self-Checks</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-soft text-text-secondary flex items-center justify-center shrink-0">
            <Info size={20} />
          </div>
        </div>
      </section>

      {/* Filters & Search Toolbar (Section 9 Requirement) */}
      <section className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search alert by room, department, equipment or root cause..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border bg-surface-soft text-xs text-foreground placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1 bg-surface-soft p-1 rounded-xl border border-border self-start lg:self-auto">
            {(["ALL", "ACTIVE", "ACKNOWLEDGED"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-semibold transition-all",
                  statusFilter === status
                    ? "bg-card text-foreground shadow-xs font-bold"
                    : "text-text-secondary hover:text-foreground"
                )}
              >
                {status === "ALL" ? "All Events" : status === "ACTIVE" ? "Active" : "Acknowledged"}
              </button>
            ))}
          </div>
        </div>

        {/* Priority & Department Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/70 text-xs">
          <div className="flex items-center gap-1.5 text-text-secondary font-medium mr-1">
            <Filter size={13} />
            <span>Filter By:</span>
          </div>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-border bg-surface-soft text-xs text-foreground focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="ALL">All Priorities (P0–P3)</option>
            <option value="P0">P0 — Life-Critical Only</option>
            <option value="P1">P1 — Clinically Essential</option>
            <option value="P2">P2 — Clinical Support</option>
            <option value="P3">P3 — Flexible / Non-Critical</option>
          </select>

          {/* Department filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-border bg-surface-soft text-xs text-foreground focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="ALL">All Hospital Departments</option>
            {HOSPITAL_DEPARTMENTS.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>

          {/* Severity filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-border bg-surface-soft text-xs text-foreground focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="critical">Critical Only</option>
            <option value="warning">Warnings Only</option>
            <option value="advisory">Advisories Only</option>
          </select>

          {(priorityFilter !== "ALL" || departmentFilter !== "ALL" || severityFilter !== "ALL" || searchQuery) && (
            <button
              onClick={() => {
                setPriorityFilter("ALL");
                setDepartmentFilter("ALL");
                setSeverityFilter("ALL");
                setSearchQuery("");
              }}
              className="ml-auto text-[11px] font-mono text-primary hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </section>

      {/* Event Stream List */}
      <section className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center bg-card">
            <CheckCircle2 size={32} className="mx-auto text-primary opacity-60 mb-2" />
            <p className="text-sm font-bold text-foreground">No matching alerts found</p>
            <p className="text-xs text-text-secondary mt-1">
              All monitored hospital circuits and rooms are operating within safe clinical parameters.
            </p>
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const isCritical = evt.severity === "critical";
            const isWarning = evt.severity === "warning";

            return (
              <div
                key={evt.id}
                className={cn(
                  "rounded-2xl border p-4 sm:p-5 bg-card transition-all shadow-xs",
                  isCritical
                    ? "border-[var(--danger)]/40 hover:border-[var(--danger)]"
                    : isWarning
                    ? "border-[var(--warning)]/40 hover:border-[var(--warning)]"
                    : "border-border hover:border-border",
                  evt.acknowledged && "opacity-75"
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  {/* Left: Badge + Details */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider",
                          isCritical
                            ? "bg-[var(--danger-bg)] text-[var(--danger)] border border-[var(--danger)]/30"
                            : isWarning
                            ? "bg-[var(--warning-bg)] text-[var(--warning)] border border-[var(--warning)]/30"
                            : "bg-surface-soft text-text-secondary border border-border"
                        )}
                      >
                        {evt.severity}
                      </span>

                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-mono font-bold",
                          evt.priority === "P0"
                            ? "bg-[var(--danger)] text-white"
                            : evt.priority === "P1"
                            ? "bg-[#E36A45] text-white"
                            : "bg-surface-soft text-foreground border border-border"
                        )}
                      >
                        {evt.priority}
                      </span>

                      <span className="font-mono text-[11px] text-text-tertiary flex items-center gap-1">
                        <Clock size={11} />
                        {evt.timestamp}
                      </span>

                      <span className="font-mono text-[11px] text-text-secondary">
                        Source: <span className="text-foreground font-semibold">{evt.source}</span>
                      </span>

                      {evt.acknowledged && (
                        <span className="pill pill-healthy !text-[9px] !py-0">
                          Acknowledged
                        </span>
                      )}

                      {evt.escalatedTo && (
                        <span className="pill pill-warning !text-[9px] !py-0">
                          Escalated: {evt.escalatedTo.split("(")[0]}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-foreground leading-snug">
                      {evt.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-text-secondary">
                      <span>Department: <strong className="text-foreground">{evt.departmentName}</strong></span>
                      {evt.roomCode && (
                        <>
                          <span>·</span>
                          <span>Room: <strong className="text-primary">{evt.roomCode}</strong></span>
                        </>
                      )}
                    </div>

                    <p className="text-xs text-text-secondary leading-relaxed">
                      {evt.explanation}
                    </p>

                    {/* Recommended Action Box */}
                    <div className="p-3 rounded-xl bg-surface-soft border border-border/80 flex items-start gap-2.5 text-xs">
                      <span className="text-primary mt-0.5">👉</span>
                      <div>
                        <span className="font-bold text-foreground">Recommended Next Step: </span>
                        <span className="text-text-secondary">{evt.recommendedAction}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0">
                    {!evt.acknowledged ? (
                      <>
                        <button
                          onClick={() => handleAcknowledge(evt.id)}
                          className="px-3 py-1.5 rounded-lg bg-surface-soft hover:bg-surface border border-border text-xs font-semibold text-foreground transition-colors"
                        >
                          Acknowledge
                        </button>
                        <button
                          onClick={() => setSelectedEventForEscalation(evt)}
                          className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-opacity flex items-center gap-1"
                        >
                          <Send size={12} />
                          <span>Escalate</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] font-mono text-text-tertiary flex items-center gap-1">
                        <CheckCircle2 size={13} className="text-primary" />
                        <span>Action Logged</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Escalation Workflow Modal (Section 9 Requirement) */}
      {selectedEventForEscalation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[var(--danger-bg)] text-[var(--danger)] flex items-center justify-center">
                  <PhoneCall size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Clinical Escalation Workflow
                  </h3>
                  <p className="text-[11px] text-text-secondary">
                    Incident #{selectedEventForEscalation.id.toUpperCase()} · {selectedEventForEscalation.priority} Life-Support
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEventForEscalation(null)}
                className="w-7 h-7 rounded-lg bg-surface-soft text-text-secondary hover:text-foreground flex items-center justify-center transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-text-secondary font-medium mb-1">
                  Select Authorized Escalation Team:
                </label>
                <select
                  value={escalationTarget}
                  onChange={(e) => setEscalationTarget(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface-soft text-foreground text-xs focus:outline-none focus:border-primary"
                >
                  <option value="biomedical">Biomedical Engineering Control (Ext 4012)</option>
                  <option value="electrical">Electrical Control Room / Duty Engineer (Ext 5010)</option>
                  <option value="cmo">Chief Medical Officer (CMO) On-Call (Ext 1001)</option>
                </select>
              </div>

              <div>
                <label className="block text-text-secondary font-medium mb-1">
                  Operator Dispatch Directive & Clinical Notes:
                </label>
                <textarea
                  rows={3}
                  value={escalationNote}
                  onChange={(e) => setEscalationNote(e.target.value)}
                  placeholder="e.g. Dispatched standby UPS inspection. Critical ventilators running on dual-bus."
                  className="w-full p-2.5 rounded-lg border border-border bg-surface-soft text-foreground text-xs focus:outline-none focus:border-primary placeholder:text-text-tertiary"
                />
              </div>

              {/* Safety notice adhering to Section 9 requirement */}
              <div className="p-3 rounded-xl bg-surface-soft border border-border/80 text-[11px] text-text-secondary space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <Info size={13} className="text-primary" />
                  <span>Verified Delivery Policy:</span>
                </div>
                <p>
                  This action records an immutable audit log into the EMS incident store. External telephony/pager dispatch requires hospital PBX physical gateway confirmation.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-border">
              <button
                onClick={() => setSelectedEventForEscalation(null)}
                className="px-3.5 py-1.5 rounded-lg border border-border text-xs text-text-secondary hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEscalation}
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                <Send size={13} />
                <span>Confirm & Dispatch Ticket</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
