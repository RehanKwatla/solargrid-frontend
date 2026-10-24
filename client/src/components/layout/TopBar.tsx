import { useState, useEffect } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Clock,
  Command,
  Compass,
  FileText,
  Info,
  LayoutDashboard,
  Menu,
  Moon,
  Search,
  Settings as SettingsIcon,
  ShieldAlert,
  Sun,
  User,
  X,
  Zap,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useSolarTracking } from "@/contexts/SolarTrackingContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { facility as fallbackFacility } from "@/data/mockData";
import { GlobalCommandSearch } from "./GlobalCommandSearch";

const titles: Record<string, string> = {
  "/overview": "Energy overview",
  "/energy": "Energy",
  "/critical-loads": "Critical Load Management",
  "/energy-sharing": "Energy Sharing & Peer Trading",
  "/intelligence": "Intelligence & Decision Board",
  "/alerts": "Events & Attention Log",
  "/metering": "Metering & Settlement",
  "/feature-1": "Metering & Settlement",
  "/settings": "System Settings",
};

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const [location, setLocation] = useLocation();
  const { formattedTime } = useSolarTracking();
  const { theme, toggleTheme } = useTheme();
  const { facility: dbFacility, overallStatus, alerts } = useDashboardData();

  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const facilityName = dbFacility?.name ?? fallbackFacility.name;

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const unackAlertCount = alerts.filter((a) => a.state === "critical").length;

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[58px] w-full max-w-full min-w-0 items-center justify-between border-b border-border bg-background/95 backdrop-blur-md px-3 sm:px-6 transition-colors duration-200 gap-3">
        {/* Left: Branding & Mobile Menu */}
        <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
          <button
            onClick={onMenuClick}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-soft hover:text-foreground transition-colors lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu size={19} />
          </button>

          <Link
            href="/overview"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          >
            <div className="w-8 h-8 rounded-lg bg-surface-soft border border-border p-1 flex items-center justify-center shadow-xs group-hover:border-primary transition-colors">
              <img src="/favicon.svg" alt="SolarGrid Logo" className="h-full w-full object-contain" />
            </div>
            <span className="font-sans text-base font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors">
              SolarGrid
            </span>
          </Link>
        </div>

        {/* Center: Reference Navigation Tabs (Hidden on small screens) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-medium">
          <Link
            href="/overview"
            className={cn(
              "relative py-4 transition-colors hover:text-foreground",
              location === "/overview" || location === "/"
                ? "text-foreground font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                : "text-text-secondary"
            )}
          >
            Overview
          </Link>
          <Link
            href="/energy"
            className={cn(
              "relative py-4 transition-colors hover:text-foreground",
              location === "/energy"
                ? "text-foreground font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                : "text-text-secondary"
            )}
          >
            Live Monitoring
          </Link>
          <Link
            href="/intelligence"
            className={cn(
              "relative py-4 transition-colors hover:text-foreground",
              location === "/intelligence"
                ? "text-foreground font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                : "text-text-secondary"
            )}
          >
            Forecasts
          </Link>
          <Link
            href="/intelligence"
            className={cn(
              "relative py-4 transition-colors hover:text-foreground",
              location === "/intelligence#optimization"
                ? "text-foreground font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                : "text-text-secondary"
            )}
          >
            Optimization
          </Link>
          <Link
            href="/metering"
            className={cn(
              "relative py-4 transition-colors hover:text-foreground",
              location === "/metering"
                ? "text-foreground font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                : "text-text-secondary"
            )}
          >
            Reports
          </Link>
        </nav>

        {/* Right: Demonstration Mode Pill, Theme Toggle & User */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0">
          {/* Demonstration Mode Pill Badge */}
          <Link
            href="/overview"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-soft border border-border text-[10px] sm:text-[11px] font-mono text-warning hover:border-warning/50 transition-colors shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            <span className="font-bold tracking-wider uppercase">DEMONSTRATION MODE</span>
            <Info size={12} className="text-text-tertiary" />
          </Link>

          {/* Action icons */}
          <div className="flex items-center gap-0.5 sm:gap-1.5 shrink-0">
            {/* Quick Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-8 w-8 sm:w-auto sm:px-2.5 shrink-0 items-center justify-center sm:gap-2 rounded-lg border border-transparent sm:border-border sm:bg-surface-soft/60 text-text-tertiary hover:bg-surface-soft hover:text-foreground transition-colors"
              aria-label="Search navigation and telemetry"
              title="Quick Search (Ctrl+K)"
            >
              <Search size={15} />
              <span className="hidden sm:inline text-xs font-mono text-text-secondary">Search</span>
              <kbd className="hidden md:inline-flex h-4 items-center gap-0.5 rounded border border-border bg-surface px-1 text-[9px] font-mono font-semibold text-text-tertiary">
                ⌘K
              </kbd>
            </button>

            {/* Notifications / Alerts */}
            <Link
              href="/alerts"
              className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-soft hover:text-foreground transition-colors"
              aria-label="View System Events"
              title="System Events & Alerts"
            >
              <Bell size={16} />
              {unackAlertCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-[6px] w-[6px] rounded-full bg-danger shrink-0 ring-2 ring-background animate-pulse" />
              )}
            </Link>

            {/* Theme Toggle */}
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-soft hover:text-foreground transition-colors"
                aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
                title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              >
                {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
              </button>
            )}

            <div className="h-4 w-px bg-border mx-0.5 sm:mx-1 shrink-0" />

            {/* User Profile / Settings */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-soft text-text-tertiary hover:bg-accent/10 hover:text-foreground transition-colors"
                aria-label="Operator profile & session"
                title="Operator Profile"
              >
                <User size={16} />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-10 z-40 w-56 rounded-lg border border-border bg-surface p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-2 border-b border-border/60 mb-1">
                      <p className="font-sans text-xs font-bold text-foreground">Dr. R. Kwatla</p>
                      <p className="font-mono text-[10px] text-text-tertiary">Chief EMS Controller</p>
                      <span className="mt-1 inline-block pill pill-healthy !text-[9px] !py-0">
                        Authenticated Session
                      </span>
                    </div>

                    <Link
                      href="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-text-secondary hover:bg-surface-soft hover:text-foreground transition-colors"
                    >
                      <SettingsIcon size={14} />
                      <span>System Settings</span>
                    </Link>

                    <Link
                      href="/alerts"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-text-secondary hover:bg-surface-soft hover:text-foreground transition-colors"
                    >
                      <AlertTriangle size={14} />
                      <span>Attention Logs</span>
                    </Link>

                    <div className="border-t border-border/60 my-1" />

                    <div className="px-2 py-1">
                      <p className="font-mono text-[9px] text-text-tertiary">
                        Emergency Hotline:{" "}
                        <a href="tel:+912026001234" className="text-primary hover:underline">
                          +91 (20) 2600-1234
                        </a>
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Global Command Palette Search Modal */}
      <GlobalCommandSearch
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
