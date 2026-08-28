import { AlertTriangle, BrainCircuit, ChevronLeft, ChevronRight, LayoutDashboard, Map, Settings, Zap } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { facility } from "@/data/mockData";
import { useTelemetry } from "@/contexts/SolarTrackingContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navigation = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/energy", label: "Energy", icon: Zap },
  { href: "/intelligence", label: "Intelligence", icon: BrainCircuit },
  { href: "/alerts", label: "Events", icon: AlertTriangle, badge: "3" },
  { href: "/feature-1", label: "Metering", icon: Map },
];

interface AppSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function AppSidebar({ isCollapsed, onToggleCollapse }: AppSidebarProps) {
  const [location] = useLocation();
  const t = useTelemetry();

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-30 hidden h-screen shrink-0 flex-col bg-[var(--bg-raised)] border-r border-border lg:flex sidebar-transition overflow-x-hidden",
        isCollapsed ? "w-[72px] max-w-[72px] px-1.5" : "w-[256px] max-w-[256px] px-3"
      )}
    >
      <button
        onClick={onToggleCollapse}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-7 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-text-tertiary hover:text-foreground hover:bg-surface-soft shadow-[var(--shadow-sm)] transition-colors z-40"
      >
        {isCollapsed ? <ChevronRight size={14} strokeWidth={2.25} /> : <ChevronLeft size={14} strokeWidth={2.25} />}
      </button>

      {/* Brand */}
      <div className={cn("flex items-center mb-6", isCollapsed ? "justify-center" : "gap-2.5 px-0.5")}>
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--accent-soft)] bg-primary text-primary-foreground font-bold text-sm shadow-[var(--shadow-sm)]">
          <span className="leading-none -mt-px">SG</span>
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden min-w-0">
            <span className="block font-sans text-[0.88rem] font-semibold tracking-[-0.02em] text-foreground leading-tight">
              SolarGrid
            </span>
            <span className="block font-mono text-[0.62rem] font-medium text-text-tertiary leading-tight mt-0.5 tracking-wide">
              Operations · {facility.code}
            </span>
          </div>
        )}
      </div>

      {/* Nav section label */}
      {!isCollapsed && (
        <div className="px-2.5 mb-2">
          <p className="font-mono text-[0.6rem] font-medium tracking-[0.12em] uppercase text-text-tertiary">
            Console
          </p>
        </div>
      )}

      {/* Navigation */}
      <nav className={cn("flex-1 space-y-0.5", !isCollapsed && "px-1")}>
        {navigation.map((item) => {
          const selected = location === item.href;
          const Icon = item.icon;

          const NavLink = (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative group flex items-center rounded-lg font-sans text-[0.82rem] font-medium transition-[background-color,color] duration-150",
                isCollapsed ? "justify-center mx-auto h-9 w-9" : "gap-2 px-2.5 py-[0.45rem]",
                selected
                  ? "bg-[var(--accent-bg)] text-[var(--accent-strong)] shadow-[inset_0_0_0_1px_var(--accent-soft)] dark:text-[var(--accent-strong)]"
                  : "text-text-secondary hover:bg-surface-soft hover:text-foreground"
              )}
              aria-current={selected ? "page" : undefined}
            >
              {selected && !isCollapsed && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r-full bg-[var(--accent)]" aria-hidden />
              )}
              <Icon
                size={isCollapsed ? 20 : 17}
                strokeWidth={selected ? 2.5 : 2}
                className={cn("shrink-0", selected && "text-[var(--accent-strong)] dark:text-[var(--accent-strong)]")}
              />

              {!isCollapsed && (
                <span className={cn("truncate", selected && "font-semibold")}>{item.label}</span>
              )}

              {!isCollapsed && item.badge && (
                <span
                  className={cn(
                    "ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[0.65rem] font-bold tabular-nums",
                    selected
                      ? "bg-[var(--danger)] text-white"
                      : "bg-[var(--danger-bg)] text-[var(--danger)] border border-[var(--danger-ring)]/40"
                  )}
                >
                  {item.badge}
                </span>
              )}

              {isCollapsed && item.badge && (
                <span
                  className="absolute top-2 right-2 h-2 w-2 rounded-full"
                  style={{ background: "var(--danger)", boxShadow: "0 0 0 2px var(--bg-raised)" }}
                />
              )}
            </Link>
          );

          if (isCollapsed) {
            return (
              <Tooltip key={item.href} delayDuration={120}>
                <TooltipTrigger asChild>
                  <div className="my-0.5">{NavLink}</div>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  sideOffset={10}
                  className="font-sans font-medium text-[0.8rem] py-1.5 px-2.5"
                >
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
        <div className="mt-5 rounded-xl border border-border bg-surface p-3 shadow-[var(--shadow-xs)]">
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <div className="min-w-0">
              <p className="font-sans text-[0.82rem] font-semibold text-foreground leading-tight truncate">
                {facility.name}
              </p>
              <p className="font-mono text-[0.65rem] tracking-[0.05em] text-text-secondary mt-0.5 truncate">
                {facility.code} · {facility.location}
              </p>
            </div>
            <span className="pill pill-healthy shrink-0 mt-0.5">
              <span className="status-dot healthy" style={{ width: 5, height: 5 }} />
              Online
            </span>
          </div>

          <div className="space-y-1.5 border-t border-border/60 pt-3">
            <div className="telemetry-row" style={{ gap: "0.5rem" }}>
              <span className="label !text-[0.72rem] !font-medium" style={{ fontSize: "0.72rem" }}>Solar PV</span>
              <span className="value !text-[0.8rem]" style={{ fontSize: "0.8rem" }}>
                {t.solarKw.toFixed(1)}<span className="unit">kW</span>
              </span>
            </div>
            <div className="telemetry-row" style={{ gap: "0.5rem" }}>
              <span className="label !text-[0.72rem] !font-medium" style={{ fontSize: "0.72rem" }}>Battery SOC</span>
              <span className="value !text-[0.8rem]" style={{ fontSize: "0.8rem" }}>
                {t.batterySoc}<span className="unit">%</span>
              </span>
            </div>
            <div className="telemetry-row" style={{ gap: "0.5rem" }}>
              <span className="label !text-[0.72rem] !font-medium" style={{ fontSize: "0.72rem" }}>Grid</span>
              <span className={cn("value !text-[0.8rem]", Math.abs(t.gridKw) > 0.1 ? "accent" : "")} style={{ fontSize: "0.8rem" }}>
                {t.gridConnected ? `${t.gridKw.toFixed(1)} kW` : "Disconnected"}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 mb-2 flex flex-col items-center gap-3">
          <div className="relative">
            <div className="status-dot healthy pulse" title="System Online" />
          </div>
          <Tooltip delayDuration={120}>
            <TooltipTrigger asChild>
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary hover:text-foreground hover:bg-surface-soft transition-colors cursor-default"
                title={facility.code}
              >
                <span className="font-mono text-[0.65rem] font-semibold tracking-[0.08em]">{facility.code}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10} className="text-[0.8rem]">
              {facility.name}
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Settings */}
      <Link
        href="/settings"
        aria-label="Settings"
        className={cn(
          "mt-3 flex items-center rounded-lg font-sans text-[0.85rem] font-medium text-text-secondary transition-[background-color,color] duration-150 hover:bg-surface-soft hover:text-foreground",
          isCollapsed ? "justify-center mx-auto h-10 w-10" : "gap-2.5 px-2.5 py-2 mx-1 mb-1"
        )}
      >
        <Settings size={isCollapsed ? 20 : 17} className="shrink-0" />
        {!isCollapsed && <span className="truncate">Settings</span>}
      </Link>
    </aside>
  );
}
