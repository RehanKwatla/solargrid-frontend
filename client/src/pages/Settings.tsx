import { useState } from "react";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";
import {
  Bell,
  CheckCircle2,
  Clock,
  Database,
  Globe,
  HardDrive,
  HeartPulse,
  Mail,
  Moon,
  Phone,
  Save,
  Shield,
  Sliders,
  Sun,
  User,
  Zap,
} from "lucide-react";

export default function Settings() {
  const { facility } = useDashboardData();
  const { theme, toggleTheme } = useTheme();

  // Facility settings
  const [facilityName, setFacilityName] = useState(facility?.name ?? "Apollo Care Campus");
  const [facilityCode, setFacilityCode] = useState(facility?.code ?? "SG-ACC-01");
  const [locationCity, setLocationCity] = useState("Pune · Maharashtra, India");
  const [operatorName, setOperatorName] = useState("Dr. R. Kwatla (Chief EMS Controller)");

  // Thresholds
  const [minBatteryReserve, setMinBatteryReserve] = useState("35");
  const [criticalCutoffMinutes, setCriticalCutoffMinutes] = useState("120");
  const [maxFeedInKw, setMaxFeedInKw] = useState("50");
  const [autoShedNonCritical, setAutoShedNonCritical] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState("5");

  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Settings Saved Successfully", {
        description: "Facility parameters and emergency dispatch thresholds updated.",
      });
    }, 450);
  };

  return (
    <div className="mx-auto w-full max-w-full min-w-0 px-4 py-5 sm:px-6 lg:px-8 xl:px-10 lg:py-8 space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[0.68rem] font-semibold tracking-[0.12em] uppercase text-text-tertiary">
              Configuration & Operations Console
            </span>
            <span className="pill pill-healthy !text-[9px] !py-0.5">Active Node</span>
          </div>
          <h1 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            System Settings
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-text-secondary">
            Manage microgrid thresholds, emergency escalation protocols, appearance, and contact channels for {facilityName}.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-sans text-xs font-semibold text-primary-foreground shadow-[var(--shadow-sm)] hover:opacity-95 transition-all self-start md:self-end"
        >
          {saving ? (
            <Clock size={15} className="animate-spin" />
          ) : (
            <Save size={15} />
          )}
          <span>{saving ? "Saving Changes…" : "Save Configuration"}</span>
        </button>
      </header>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Facility Profile */}
          <section className="card p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-border pb-3">
              <Globe size={18} className="text-primary" />
              <div>
                <h2 className="font-sans text-base font-bold text-foreground">Facility Profile</h2>
                <p className="text-xs text-text-secondary">Microgrid installation identifiers and location metadata</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[0.68rem] font-semibold uppercase tracking-wider text-text-secondary mb-1">
                  Facility Name
                </label>
                <input
                  type="text"
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block font-mono text-[0.68rem] font-semibold uppercase tracking-wider text-text-secondary mb-1">
                  Facility Node Code
                </label>
                <input
                  type="text"
                  value={facilityCode}
                  onChange={(e) => setFacilityCode(e.target.value)}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block font-mono text-[0.68rem] font-semibold uppercase tracking-wider text-text-secondary mb-1">
                  Operating Location
                </label>
                <input
                  type="text"
                  value={locationCity}
                  onChange={(e) => setLocationCity(e.target.value)}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block font-mono text-[0.68rem] font-semibold uppercase tracking-wider text-text-secondary mb-1">
                  Appointed EMS Controller
                </label>
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
              </div>
            </div>
          </section>

          {/* Section 2: EMS & Load Protection Rules */}
          <section className="card p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-border pb-3">
              <Shield size={18} className="text-primary" />
              <div>
                <h2 className="font-sans text-base font-bold text-foreground">
                  EMS Critical Load Safeguards
                </h2>
                <p className="text-xs text-text-secondary">
                  Hospital safety buffers and automatic shedding thresholds
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-mono text-[0.68rem] font-semibold uppercase tracking-wider text-text-secondary mb-1">
                  Min Battery Reserve (%)
                </label>
                <input
                  type="number"
                  min="15"
                  max="90"
                  value={minBatteryReserve}
                  onChange={(e) => setMinBatteryReserve(e.target.value)}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
                <span className="text-[10px] text-text-tertiary mt-1 block">Dedicated to ICU circuits</span>
              </div>

              <div>
                <label className="block font-mono text-[0.68rem] font-semibold uppercase tracking-wider text-text-secondary mb-1">
                  Autonomy Target (Min)
                </label>
                <input
                  type="number"
                  min="30"
                  max="480"
                  value={criticalCutoffMinutes}
                  onChange={(e) => setCriticalCutoffMinutes(e.target.value)}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
                <span className="text-[10px] text-text-tertiary mt-1 block">Expected islanded runtime</span>
              </div>

              <div>
                <label className="block font-mono text-[0.68rem] font-semibold uppercase tracking-wider text-text-secondary mb-1">
                  Max Microgrid Export (kW)
                </label>
                <input
                  type="number"
                  min="0"
                  max="250"
                  value={maxFeedInKw}
                  onChange={(e) => setMaxFeedInKw(e.target.value)}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
                <span className="text-[10px] text-text-tertiary mt-1 block">MSEDCL feeder ceiling</span>
              </div>
            </div>

            <div className="border-t border-border/60 pt-4 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-foreground block">
                    Automatic Non-Critical Shedding on Grid Fault
                  </span>
                  <span className="text-[11px] text-text-secondary">
                    Immediately shed administrative and non-clinical loads when grid disconnect is sensed.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoShedNonCritical}
                  onChange={(e) => setAutoShedNonCritical(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-[var(--accent)]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-foreground block">
                    Acoustic Clinical Annunciation (Audio Alert)
                  </span>
                  <span className="text-[11px] text-text-secondary">
                    Sound priority alarm on ICU circuit voltage drop or tier transition.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={soundAlerts}
                  onChange={(e) => setSoundAlerts(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-[var(--accent)]"
                />
              </label>
            </div>
          </section>

          {/* Section 3: Telemetry Polling */}
          <section className="card p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2.5 border-b border-border pb-3">
              <Database size={18} className="text-primary" />
              <div>
                <h2 className="font-sans text-base font-bold text-foreground">Data Stream & Telemetry</h2>
                <p className="text-xs text-text-secondary">Digital twin update frequency and sync rates</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-medium text-foreground block">Telemetry Sampling Rate</span>
                <span className="text-[11px] text-text-secondary">
                  Active interval for solar irradiance and inverter updates.
                </span>
              </div>
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(e.target.value)}
                className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-mono font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              >
                <option value="1">1 Second (Ultra-fine)</option>
                <option value="5">5 Seconds (Standard Live)</option>
                <option value="15">15 Seconds (Bandwidth saver)</option>
                <option value="60">60 Seconds (Passive)</option>
              </select>
            </div>
          </section>
        </div>

        {/* Right Column (1 col): Contacts with clickable tel: & mailto:, and theme settings */}
        <div className="space-y-6">
          {/* Direct Emergency Contacts (Requirement 18 & 19) */}
          <section className="card p-5 sm:p-6 space-y-4 border-[var(--accent-soft)]">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <HeartPulse size={18} className="text-[var(--danger)]" />
              <div>
                <h3 className="font-sans text-sm font-bold text-foreground">
                  Emergency Escalation Desk
                </h3>
                <p className="text-[10px] text-text-tertiary">24/7 Clinical & Grid Hotlines</p>
              </div>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              In the event of a catastrophic bus fault or automated life-support shedding error, contact the emergency desk directly:
            </p>

            <div className="space-y-3">
              {/* Phone 1 */}
              <div className="p-3 rounded-lg border border-border bg-surface-soft/60 space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary block">
                  Hospital EMS On-Call Desk
                </span>
                <a
                  href="tel:+912026001234"
                  className="font-mono text-xs font-bold text-primary hover:underline flex items-center gap-2"
                >
                  <Phone size={13} />
                  <span>+91 (20) 2600-1234</span>
                </a>
              </div>

              {/* Phone 2 */}
              <div className="p-3 rounded-lg border border-border bg-surface-soft/60 space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary block">
                  National Grid Dispatch (Toll-Free)
                </span>
                <a
                  href="tel:1800223344"
                  className="font-mono text-xs font-bold text-foreground hover:text-primary hover:underline flex items-center gap-2"
                >
                  <Phone size={13} />
                  <span>1800-22-3344</span>
                </a>
              </div>

              {/* Email 1 */}
              <div className="p-3 rounded-lg border border-border bg-surface-soft/60 space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary block">
                  Critical Response Team Email
                </span>
                <a
                  href="mailto:ems-critical@apollo.care"
                  className="font-mono text-xs font-semibold text-primary hover:underline flex items-center gap-2 break-all"
                >
                  <Mail size={13} className="shrink-0" />
                  <span>ems-critical@apollo.care</span>
                </a>
              </div>

              {/* Email 2 */}
              <div className="p-3 rounded-lg border border-border bg-surface-soft/60 space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary block">
                  Engineering Operations Support
                </span>
                <a
                  href="mailto:ops@solargrid.hospital"
                  className="font-mono text-xs font-semibold text-text-secondary hover:text-foreground hover:underline flex items-center gap-2 break-all"
                >
                  <Mail size={13} className="shrink-0" />
                  <span>ops@solargrid.hospital</span>
                </a>
              </div>
            </div>
          </section>

          {/* Theme & Display Options */}
          <section className="card p-5 sm:p-6 space-y-4">
            <h3 className="font-sans text-sm font-bold text-foreground border-b border-border pb-2">
              Appearance & Theme
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-foreground block">Display Mode</span>
                <span className="text-[11px] text-text-secondary">Current: {theme === "dark" ? "Dark Theme" : "Light Theme"}</span>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-soft transition-colors"
              >
                {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
                <span>{theme === "light" ? "Switch to Dark" : "Switch to Light"}</span>
              </button>
            </div>
          </section>

          {/* About / Hackathon attribution */}
          <section className="rounded-lg border border-border bg-surface-soft/40 p-4 space-y-2">
            <p className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary">
              Project Specification
            </p>
            <p className="font-sans text-xs font-semibold text-foreground">
              SolarGrid Intelligent Operating Layer
            </p>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Developed for the Smart India Hackathon (SIH) & presented at Indradhanu. Dynamic Digital Twin, hospital clinical circuit prioritization, and P2P clean power settlement.
            </p>
            <p className="font-mono text-[10px] text-text-tertiary pt-1 border-t border-border/50">
              Build Version: 2.4.0 · License: MIT
            </p>
          </section>
        </div>
      </form>
    </div>
  );
}
