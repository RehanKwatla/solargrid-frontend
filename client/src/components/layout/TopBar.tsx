import { useState, useEffect } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Clock,
  Command,
  Compass,
  FileText,
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
import { useSolarTracking } from "@/contexts/SolarTrackingContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { facility as fallbackFacility } from "@/data/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [searchQuery, setSearchQuery] = useState("");
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

  const searchItems = [
    { href: "/overview", label: "Energy Overview", category: "Core", icon: LayoutDashboard },
    { href: "/energy", label: "Energy Analytics & PV Curves", category: "Analytics", icon: Zap },
    { href: "/critical-loads", label: "Critical Load Management (EMS)", category: "Clinical", icon: ShieldAlert },
    { href: "/energy-sharing", label: "Energy Sharing & P2P Trading", category: "Microgrid", icon: ArrowRight },
    { href: "/intelligence", label: "Intelligence & Forecasts", category: "AI EMS", icon: Compass },
    { href: "/alerts", label: "System Events & Attention Log", category: "Safety", icon: AlertTriangle },
    { href: "/metering", label: "Metering & Financial Settlement", category: "Commercial", icon: FileText },
    { href: "/settings", label: "System Settings & Thresholds", category: "Config", icon: SettingsIcon },
    { href: "/", label: "Launch 3D Digital Twin", category: "Experience", icon: Compass },
  ];

  const filteredItems = searchItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectRoute = (href: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    setLocation(href);
  };

  const unackAlertCount = alerts.filter((a) => a.state === "critical").length;

  return (
    <>
      <header className="sticky top-0 z-20 flex h-[60px] w-full max-w-full min-w-0 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-3 sm:px-5 lg:px-6 xl:px-8 transition-colors duration-200 gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-shrink-0">
          <button
            onClick={onMenuClick}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-soft hover:text-foreground transition-colors lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu size={19} />
          </button>
          <div className="min-w-0">
            <div className="hidden items-center gap-1.5 text-[0.72rem] text-text-tertiary sm:flex min-w-0">
              <Link
                href="/overview"
                className="shrink-0 font-medium hover:text-foreground transition-colors"
                title="Return to Overview"
              >
                SolarGrid
              </Link>
              <span className="shrink-0 text-border">/</span>
              <span className="truncate font-medium">{facilityName}</span>
            </div>
            <p className="font-sans text-[0.95rem] font-bold text-foreground sm:mt-0.5 truncate leading-tight">
              {titles[location] ?? "Overview"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-5 flex-shrink-0 min-w-0">
          {/* Clock & Status */}
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

      {/* Quick Search Dialog (Cmd+K) */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-[480px] bg-surface border border-border p-0 shadow-2xl overflow-hidden">
          <DialogHeader className="p-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <Search size={18} className="text-text-tertiary" />
              <input
                type="text"
                placeholder="Search SolarGrid pages, telemetry, circuits…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent text-sm text-foreground placeholder:text-text-tertiary focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-text-tertiary hover:text-foreground"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </DialogHeader>

          <div className="max-h-[320px] overflow-y-auto p-2 space-y-1">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => handleSelectRoute(item.href)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-left hover:bg-surface-soft transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface text-text-secondary group-hover:text-primary transition-colors">
                        <Icon size={14} />
                      </div>
                      <div>
                        <span className="font-sans text-xs font-semibold text-foreground group-hover:text-primary transition-colors block">
                          {item.label}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={13} className="text-text-tertiary group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </button>
                );
              })
            ) : (
              <div className="p-6 text-center text-xs text-text-tertiary">
                No matching routes found for &ldquo;{searchQuery}&rdquo;
              </div>
            )}
          </div>

          <div className="p-2.5 bg-surface-soft/60 border-t border-border flex items-center justify-between text-[10px] font-mono text-text-tertiary">
            <span>Press ESC to close</span>
            <span>SolarGrid Navigation</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
