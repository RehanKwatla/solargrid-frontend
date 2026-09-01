import { Bell, Clock, Menu, Search, Moon, Sun, User } from "lucide-react";
import { useLocation } from "wouter";
import { useSolarTracking } from "@/contexts/SolarTrackingContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { facility as fallbackFacility } from "@/data/mockData";

const titles: Record<string, string> = {
  "/overview": "Energy overview",
  "/energy": "Energy",
  "/critical-loads": "Critical Load Management",
  "/energy-sharing": "Energy Sharing & Peer Trading",
  "/intelligence": "Intelligence",
  "/alerts": "Events",
  "/feature-1": "Metering",
};

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const [location] = useLocation();
  const { formattedTime } = useSolarTracking();
  const { theme, toggleTheme } = useTheme();
  const { facility: dbFacility, overallStatus } = useDashboardData();

  const facilityName = dbFacility?.name ?? fallbackFacility.name;

  return (
    <header className="sticky top-0 z-20 flex h-[60px] w-full max-w-full min-w-0 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-3 sm:px-5 lg:px-6 xl:px-8 transition-colors duration-200 gap-2">
      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-shrink-0">
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-soft hover:text-foreground transition-colors lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={19} />
        </button>
        <div className="min-w-0">
          <div className="hidden items-center gap-1.5 text-[0.72rem] text-text-tertiary sm:flex min-w-0">
            <span className="shrink-0 font-medium">SolarGrid</span>
            <span className="shrink-0">/</span>
            <span className="truncate font-medium">{facilityName}</span>
          </div>
          <p className="font-sans text-[0.95rem] font-semibold text-foreground sm:mt-0.5 truncate leading-tight">
            {titles[location] ?? "Overview"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-5 flex-shrink-0 min-w-0">
        <div className="hidden items-center gap-2 sm:flex min-w-0">
          <Clock size={14} className="text-text-tertiary shrink-0" />
          <span className="font-mono text-[0.75rem] font-medium text-text-secondary shrink-0 whitespace-nowrap tabular-nums">
            {formattedTime}
          </span>
          {overallStatus.kind === "live" ? (
            <span className="ml-1 flex items-center gap-1.5 rounded-full bg-[var(--healthy-bg)] px-2 py-0.5 text-[0.68rem] font-medium text-[var(--healthy)] shrink-0 whitespace-nowrap border border-[var(--healthy-ring)]/20">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--healthy)] shrink-0 live-dot" />
              <span className="hidden sm:inline">Backend Live</span>
            </span>
          ) : overallStatus.kind === "mock" ? (
            <span className="ml-1 flex items-center gap-1.5 rounded-full bg-surface-soft px-2 py-0.5 text-[0.68rem] font-medium text-text-tertiary shrink-0 whitespace-nowrap border border-border">
              <span className="h-1.5 w-1.5 rounded-full bg-text-tertiary shrink-0" />
              <span className="hidden sm:inline">Simulated</span>
            </span>
          ) : (
            <span className="ml-1 flex items-center gap-1.5 rounded-full bg-[var(--danger-bg)] px-2 py-0.5 text-[0.68rem] font-medium text-[var(--danger)] shrink-0 whitespace-nowrap border border-[var(--danger-ring)]/20">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--danger)] shrink-0" />
              <span className="hidden sm:inline">Offline</span>
            </span>
          )}
        </div>

        <div className="h-5 w-px bg-border hidden sm:block shrink-0" />

        <div className="flex items-center gap-0.5 sm:gap-1.5 shrink-0">
          <button
            className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-soft hover:text-foreground transition-colors"
            aria-label="Search"
          >
            <Search size={16} />
          </button>

          <button
            className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-soft hover:text-foreground transition-colors"
            aria-label="Notifications"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 flex h-[6px] w-[6px] rounded-full bg-danger shrink-0 ring-2 ring-background" />
          </button>

          {toggleTheme && (
            <button
              onClick={toggleTheme}
              className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-soft hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          )}

          <div className="h-4 w-px bg-border mx-0.5 sm:mx-1 shrink-0 hidden sm:block" />

          <button
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-soft text-text-tertiary hover:bg-accent/10 hover:text-foreground transition-colors"
            aria-label="User profile"
          >
            <User size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
