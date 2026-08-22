import { useState, type ReactNode } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { TopBar } from "@/components/layout/TopBar";
/** Grid Atlas: the operation map uses a visible desktop rail and a purposeful mobile drawer. */
export function DashboardLayout({ children }: { children: ReactNode }) { const [mobileOpen, setMobileOpen] = useState(false); return <div className="min-h-screen bg-[#0b1011] text-[#e7ece9] lg:flex"><AppSidebar /><div className="min-w-0 flex-1"><TopBar onMenuClick={() => setMobileOpen(true)} /><main>{children}</main></div><MobileNavigation open={mobileOpen} onClose={() => setMobileOpen(false)} /></div>; }
