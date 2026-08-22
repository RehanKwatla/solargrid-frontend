import { AlertTriangle, BrainCircuit, ChevronLeft, ChevronRight, LayoutDashboard, Map, Settings, Zap } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { facility, mockTelemetry } from "@/data/mockData";
import { useTelemetry } from "@/contexts/SolarTrackingContext";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navigation = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/energy", label: "Energy", icon: Zap },
  { href: "/intelligence", label: "Intelligence", icon: BrainCircuit },
  { href: "/alerts", label: "Events", icon: AlertTriangle, badge: "3" },
  { href: "/feature-1", label: "Metering", icon: Map },
];

export function AppSidebar() {
  const [location] = useLocation();
  const t = useTelemetry();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "sticky top-0 z-30 hidden h-screen shrink-0 flex-col bg-surface border-r border-border py-6 lg:flex sidebar-transition relative",
        isCollapsed ? "w-[88px] px-3" : "w-[280px] px-5"
      )}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-text-secondary hover:text-foreground hover:bg-surface-soft shadow-sm transition-colors z-40"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Brand */}
      <div className={cn("flex items-center mb-8", isCollapsed ? "justify-center" : "gap-3 px-2")}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-sm">
          SG
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden transition-all duration-300">
            <span className="block font-sans text-lg font-bold tracking-tight text-foreground">
              SolarGrid
            </span>
            <span className="block font-sans text-xs font-medium text-text-secondary">
              Energy Platform
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="space-y-1.5 flex-1">
        {navigation.map((item) => {
          const selected = location === item.href;
          const Icon = item.icon;
          
          const NavLink = (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center rounded-xl font-sans text-sm font-medium transition-all duration-200",
                isCollapsed ? "justify-center p-3" : "gap-3 px-3 py-2.5",
                selected
                  ? "bg-primary/10 text-primary"
                  : "text-text-secondary hover:bg-surface-soft hover:text-foreground"
              )}
            >
              <Icon size={isCollapsed ? 22 : 18} strokeWidth={selected ? 2.5 : 2} className="shrink-0" />
              
              {!isCollapsed && <span>{item.label}</span>}
              
              {!isCollapsed && item.badge && (
                <span
                  className={cn(
                    "ml-auto flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                    selected ? "bg-primary text-primary-foreground" : "bg-danger text-white"
                  )}
                >
                  {item.badge}
                </span>
              )}
              
              {isCollapsed && item.badge && (
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-danger" />
              )}
            </Link>
          );

          if (isCollapsed) {
            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <div>{NavLink}</div>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-sans font-medium">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return NavLink;
        })}
      </nav>

      {/* Facility block */}
      {!isCollapsed ? (
        <div className="mt-auto rounded-2xl bg-surface-soft p-4">
          <p className="font-sans text-sm font-semibold text-foreground">
            {facility.name}
          </p>
          <p className="font-sans text-xs font-medium text-text-secondary mt-0.5 mb-4">
            {facility.location}
          </p>

          <div className="space-y-2 border-t border-border/50 pt-3">
            <div className="flex justify-between items-center font-sans text-xs">
              <span className="text-text-secondary font-medium">System</span>
              <span className="flex items-center gap-1.5 text-success font-medium">
                <span className="status-dot healthy"></span> Online
              </span>
            </div>
            <div className="flex justify-between items-center font-sans text-xs">
              <span className="text-text-secondary font-medium">Solar PV</span>
              <span className="text-foreground font-semibold">{t.solarKw.toFixed(1)} kW</span>
            </div>
            <div className="flex justify-between items-center font-sans text-xs">
              <span className="text-text-secondary font-medium">Battery</span>
              <span className="text-foreground font-semibold">{t.batterySoc}%</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-auto flex justify-center mb-2">
          <div className="status-dot healthy pulse" title="System Online"></div>
        </div>
      )}

      {/* Settings */}
      <button className={cn(
        "mt-4 flex items-center rounded-xl font-sans text-sm font-medium text-text-secondary transition-all hover:bg-surface-soft hover:text-foreground",
        isCollapsed ? "justify-center p-3" : "gap-3 px-3 py-2.5 w-full"
      )}>
        <Settings size={isCollapsed ? 22 : 18} className="shrink-0" />
        {!isCollapsed && <span>Settings</span>}
      </button>
    </aside>
  );
}
