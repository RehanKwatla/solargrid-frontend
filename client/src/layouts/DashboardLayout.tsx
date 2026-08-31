import { useState, useEffect, type ReactNode } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { TopBar } from "@/components/layout/TopBar";
import { DashboardEnergyField } from "@/components/layout/DashboardEnergyField";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="dashboard-shell flex h-screen w-full max-w-full overflow-hidden bg-background text-foreground transition-colors duration-300 relative">
      <DashboardEnergyField />
      <AppSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto overflow-x-hidden relative z-10">
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 w-full min-w-0 max-w-full pb-16 lg:pb-0">{children}</main>
      </div>
      <MobileNavigation open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <MobileTabBar />
    </div>
  );
}
