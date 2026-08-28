import { useState, type ReactNode } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { TopBar } from "@/components/layout/TopBar";
import { DashboardEnergyField } from "@/components/layout/DashboardEnergyField";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="dashboard-shell min-h-screen bg-background text-foreground lg:flex transition-colors duration-300">
      <DashboardEnergyField />
      <AppSidebar />
      <div className="min-w-0 flex-1 pb-16 lg:pb-0 relative z-10">
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main>{children}</main>
      </div>
      <MobileNavigation open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <MobileTabBar />
    </div>
  );
}
