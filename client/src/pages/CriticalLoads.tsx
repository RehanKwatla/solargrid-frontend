import { useState } from "react";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { CriticalLoadOverview } from "@/components/critical-loads/CriticalLoadOverview";
import { HospitalHierarchyViewer } from "@/components/critical-loads/HospitalHierarchyViewer";
import { LoadControlTable } from "@/components/critical-loads/LoadControlTable";
import { EnergyAllocationFlow } from "@/components/critical-loads/EnergyAllocationFlow";
import { EditPriorityModal } from "@/components/critical-loads/EditPriorityModal";
import { EmergencyModeControl } from "@/components/critical-loads/EmergencyModeControl";
import { LoadAuditLogTable } from "@/components/critical-loads/LoadAuditLogTable";
import type { HospitalLoad } from "@/data/types";
import { HeartPulse, ShieldAlert, SlidersHorizontal } from "lucide-react";

export default function CriticalLoads() {
  const { facility } = useDashboardData();
  const [selectedLoadForEdit, setSelectedLoadForEdit] = useState<HospitalLoad | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const facilityCode = facility?.code ?? "SG-ACC-01";
  const facilityLocation = facility?.location ?? "Pune · India";
  const facilityName = facility?.name ?? "Apollo Care Campus";

  const handleOpenEdit = (load: HospitalLoad) => {
    setSelectedLoadForEdit(load);
    setEditModalOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-full min-w-0 px-4 py-5 sm:px-6 lg:px-8 xl:px-10 lg:py-8 space-y-6">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[0.68rem] font-semibold tracking-[0.12em] uppercase text-text-tertiary">
              {facilityCode} · {facilityLocation}
            </span>
            <span className="pill pill-danger !text-[9px] !py-0.5">Clinical EMS Priority</span>
          </div>
          <h1 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-1">
            Critical Load Management
          </h1>
          <p className="text-sm text-text-secondary mt-1.5 max-w-2xl">
            Hospital-grade electrical circuit classification, dynamic EMS prioritization, and automated life-support preservation for {facilityName}.
          </p>
        </div>
      </section>

      {/* Emergency Mode Banner & Quick Toggle */}
      <section>
        <EmergencyModeControl />
      </section>

      {/* 1. Critical Load Overview */}
      <section>
        <CriticalLoadOverview />
      </section>

      {/* 2. Optimization Connection & Energy Allocation Flow */}
      <section>
        <EnergyAllocationFlow />
      </section>

      {/* 3. Hospital Hierarchy Tree */}
      <section>
        <HospitalHierarchyViewer onSelectLoad={handleOpenEdit} />
      </section>

      {/* 4. Load Control & Matrix */}
      <section>
        <LoadControlTable onSelectLoad={handleOpenEdit} />
      </section>

      {/* 5. Load Audit Logs */}
      <section>
        <LoadAuditLogTable />
      </section>

      {/* Edit Priority Modal */}
      <EditPriorityModal
        load={selectedLoadForEdit}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />
    </div>
  );
}
