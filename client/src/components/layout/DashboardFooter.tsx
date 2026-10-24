import { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  FileCheck,
  HeartPulse,
  Info,
  Mail,
  Phone,
  Scale,
  Shield,
  X,
  Zap,
} from "lucide-react";
import { Link } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DashboardFooter() {
  const currentYear = new Date().getFullYear();
  const [docsOpen, setDocsOpen] = useState(false);
  const [complianceOpen, setComplianceOpen] = useState(false);

  return (
    <>
      <footer className="w-full border-t border-border/80 bg-surface/50 backdrop-blur-sm px-4 py-5 sm:px-6 lg:px-8 xl:px-10 mt-8 text-xs text-text-tertiary">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          {/* Brand & Attribution */}
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-sans font-bold text-foreground">SolarGrid</span>
              <span className="text-border">·</span>
              <span className="font-mono text-[11px]">Field Operating Layer</span>
              <span className="pill pill-healthy !text-[9px] !py-0">v2.4.0</span>
            </div>
            <p className="text-[11px] text-text-secondary">
              Smart India Hackathon &amp; Indradhanu · Hospital EMS &amp; Distributed Microgrid Optimization.
            </p>
          </div>

          {/* Action Links & Dialog Triggers (Requirement 7) */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button
              type="button"
              onClick={() => setDocsOpen(true)}
              className="hover:text-foreground hover:underline transition-colors flex items-center gap-1.5"
            >
              <BookOpen size={13} />
              <span>Architecture &amp; Docs</span>
            </button>

            <button
              type="button"
              onClick={() => setComplianceOpen(true)}
              className="hover:text-foreground hover:underline transition-colors flex items-center gap-1.5"
            >
              <Scale size={13} />
              <span>MERC / CEA Standards</span>
            </button>

            {/* Clickable Phone (Requirement 18) */}
            <a
              href="tel:+912026001234"
              className="hover:text-primary transition-colors flex items-center gap-1 font-mono font-medium text-text-secondary"
              title="24/7 Clinical EMS Hotline"
            >
              <Phone size={12} className="text-primary" />
              <span>+91 20 2600-1234</span>
            </a>

            {/* Clickable Mail (Requirement 19) */}
            <a
              href="mailto:ops@solargrid.hospital"
              className="hover:text-primary transition-colors flex items-center gap-1 font-mono font-medium text-text-secondary"
              title="Operations Support Desk"
            >
              <Mail size={12} className="text-primary" />
              <span>ops@solargrid.hospital</span>
            </a>
          </div>

          {/* Dynamic Copyright Year (Requirement 9) */}
          <div className="font-mono text-[10px] text-text-tertiary">
            &copy; {currentYear} SolarGrid Technologies. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Architecture & Documentation Dialog */}
      <Dialog open={docsOpen} onOpenChange={setDocsOpen}>
        <DialogContent className="sm:max-w-[560px] bg-surface border border-border p-6 shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <BookOpen size={16} />
              </div>
              <DialogTitle className="font-sans text-lg font-bold text-foreground">
                SolarGrid Architecture &amp; Digital Twin
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-3.5 text-xs text-text-secondary leading-relaxed pt-2">
            <p>
              <strong className="text-foreground">Project:</strong> SolarGrid — Smart Solar Grid &amp; Energy Optimization Platform.
            </p>
            <div className="space-y-2 p-3.5 rounded-lg border border-border bg-surface-soft/60">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-[var(--healthy)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-foreground block">Real-Time Solar Tracking Digital Twin</span>
                  <span className="text-[11px] text-text-tertiary">
                    Calculates solar azimuth and zenith angles continuously, driving physical Dual-Axis Tracker actuator positions to maximize PV yield (+28.4% energy uplift).
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-[var(--healthy)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-foreground block">Clinical Emergency Load Preservation (EMS)</span>
                  <span className="text-[11px] text-text-tertiary">
                    Classifies hospital circuits into Tier 01 (ICU/Life Support), Tier 02 (Emergency/OT), Tier 03 (Wards), and Tier 04 (Administrative). Instantly sheds lower tiers to protect human life.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-[var(--healthy)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-foreground block">P2P Microgrid Energy Trading</span>
                  <span className="text-[11px] text-text-tertiary">
                    Automates peer-to-peer microgrid matching with neighboring clinical wings and cold-chain depots with instant digital ledger settlement.
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 text-[11px] font-mono text-text-tertiary border-t border-border">
              <span>Presented at Indradhanu · SIH</span>
              <a
                href="mailto:contact@solargrid.hospital"
                className="text-primary hover:underline"
              >
                contact@solargrid.hospital
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Statutory Regulatory Compliance Dialog */}
      <Dialog open={complianceOpen} onOpenChange={setComplianceOpen}>
        <DialogContent className="sm:max-w-[520px] bg-surface border border-border p-6 shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Scale size={16} />
              </div>
              <DialogTitle className="font-sans text-lg font-bold text-foreground">
                MERC &amp; CEA Statutory Grid Compliance
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-3 text-xs text-text-secondary leading-relaxed pt-2">
            <p>
              SolarGrid operates in accordance with the Maharashtra Electricity Regulatory Commission (MERC) Distributed Renewable Energy Regulations and Central Electricity Authority (CEA) Technical Standards:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[11px]">
              <li><strong>CEA Grid Connectivity Standards:</strong> Anti-islanding detection time &lt; 2.0 seconds with IEEE 1547 compliance.</li>
              <li><strong>Frequency Regulation:</strong> Automatic solar curtailment if grid frequency exceeds 50.2 Hz.</li>
              <li><strong>Harmonic Limits:</strong> Total Harmonic Distortion (THD) maintained &lt; 3% at Point of Common Coupling (PCC).</li>
              <li><strong>Microgrid P2P Billing:</strong> Net-metering settlement approved under Schedule D-2 Institutional Clinical Tariff.</li>
            </ul>

            <div className="p-3 rounded-lg border border-[var(--healthy)]/30 bg-[var(--healthy-bg)] text-xs text-foreground font-medium flex items-center gap-2 mt-2">
              <CheckCircle2 size={16} className="text-[var(--healthy)] shrink-0" />
              <span>Full compliance verified by Chief Electrical Inspectorate.</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
