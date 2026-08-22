import { useState, type ReactNode } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { TopBar } from "@/components/layout/TopBar";

/** Grid Atlas: the operation map uses a visible desktop rail, a purposeful mobile drawer, and a compact bottom tab bar. */
export function DashboardLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b1011] text-[#e7ece9] lg:flex">
      <AppSidebar />
      <div className="min-w-0 flex-1 pb-16 lg:pb-0">
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main>{children}</main>
      </div>
      <MobileNavigation open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <MobileTabBar />
    </div>
  );
}
