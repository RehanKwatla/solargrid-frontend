import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "wouter";
import {
  Search,
  X,
  ArrowRight,
  LayoutDashboard,
  Zap,
  ShieldAlert,
  ArrowLeftRight,
  BrainCircuit,
  AlertTriangle,
  FileText,
  Settings,
  Compass,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
  Sparkles,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export interface SearchItem {
  id: string;
  href: string;
  label: string;
  description: string;
  category: "Console" | "Clinical EMS" | "AI & Forecasting" | "Commercial" | "Experience" | "Configuration";
  keywords: string[];
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export const SEARCH_ITEMS: SearchItem[] = [
  {
    id: "overview",
    href: "/overview",
    label: "Overview & Energy Control Center",
    description: "Main operational dashboard, live KPI panels, generation vs demand curve, battery ring gauge",
    category: "Console",
    keywords: ["home", "main", "dashboard", "kpi", "solar", "battery", "demand", "overview", "status"],
    icon: LayoutDashboard,
  },
  {
    id: "energy",
    href: "/energy",
    label: "Live Energy Monitoring",
    description: "Real-time generation telemetry, dual-axis solar tracking, grid exchange, and inverter telemetry",
    category: "Console",
    keywords: ["pv", "solar", "monitoring", "tracking", "telemetry", "inverter", "generation", "curves"],
    icon: Zap,
  },
  {
    id: "critical-loads",
    href: "/critical-loads",
    label: "Critical Loads Management",
    description: "Hospital life-support circuit protection, ICU/OT priority matrix, and automated emergency shedding",
    category: "Clinical EMS",
    keywords: ["icu", "ot", "ventilator", "emergency", "life support", "hospital", "priority", "shedding", "t1", "t2", "t3"],
    icon: ShieldAlert,
  },
  {
    id: "energy-sharing",
    href: "/energy-sharing",
    label: "Energy Sharing & P2P Microgrid",
    description: "Peer-to-peer renewable energy sharing, credit ledger, and local feeder microgrid exchange",
    category: "Commercial",
    keywords: ["trading", "sharing", "p2p", "microgrid", "credit", "sell", "request", "ledger", "community"],
    icon: ArrowLeftRight,
  },
  {
    id: "intelligence",
    href: "/intelligence",
    label: "Forecasting & Optimization",
    description: "24h predictive solar & load forecasting, constraint solver, and explainable dispatch decisions",
    category: "AI & Forecasting",
    keywords: ["ai", "forecast", "prediction", "dispatch", "decision", "monsoon", "constraints", "optimizer"],
    icon: BrainCircuit,
  },
  {
    id: "alerts",
    href: "/alerts",
    label: "Events & Attention Log",
    description: "Safety alarm stream, transformer temperature alerts, and facility audit logs",
    category: "Clinical EMS",
    keywords: ["alerts", "events", "warnings", "alarms", "logs", "notifications", "incident", "attention"],
    icon: AlertTriangle,
  },
  {
    id: "metering",
    href: "/metering",
    label: "Metering & Reports",
    description: "MERC tariff settlement, fiscal metering reports, and CSV energy audit exports",
    category: "Commercial",
    keywords: ["metering", "reports", "tariff", "csv", "export", "billing", "settlement", "finance"],
    icon: FileText,
  },
  {
    id: "settings",
    href: "/settings",
    label: "System Settings & Thresholds",
    description: "Facility configurations, EMS threshold tuning, operator profiles, and emergency hotlines",
    category: "Configuration",
    keywords: ["settings", "thresholds", "profile", "facility", "config", "hotlines", "contact"],
    icon: Settings,
  },
  {
    id: "twin",
    href: "/intro",
    label: "3D Digital Twin Experience",
    description: "Interactive Three.js 3D facility twin with animated solar array tracking",
    category: "Experience",
    keywords: ["3d", "twin", "simulation", "threejs", "interactive", "model"],
    icon: Compass,
  },
  {
    id: "landing",
    href: "/landing",
    label: "Public Editorial Showcase",
    description: "Public landing presentation with animated SVG energy centerpiece and hospital narrative",
    category: "Experience",
    keywords: ["landing", "public", "showcase", "story", "editorial"],
    icon: Sparkles,
  },
];

interface GlobalCommandSearchProps {
  open: boolean;
  onClose: () => void;
}

export function GlobalCommandSearch({ open, onClose }: GlobalCommandSearchProps) {
  const [, setLocation] = useLocation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter items matching query
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEARCH_ITEMS;

    return SEARCH_ITEMS.filter((item) => {
      const matchLabel = item.label.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      const matchKeywords = item.keywords.some((k) => k.toLowerCase().includes(q));
      return matchLabel || matchDesc || matchCategory || matchKeywords;
    });
  }, [query]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  // Autofocus input on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [open]);

  // Keyboard navigation within the modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredItems.length ? (prev + 1) % filteredItems.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filteredItems.length ? (prev - 1 + filteredItems.length) % filteredItems.length : 0
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex].href);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement;
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedIndex]);

  const handleSelect = (href: string) => {
    setLocation(href);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-3 sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="global-search-title"
    >
      {/* Dimmed & Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity animate-in fade-in duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Solid Opaque Modal Box */}
      <div
        onKeyDown={handleKeyDown}
        className={cn(
          "relative w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border transition-all duration-200 animate-in fade-in zoom-in-95 flex flex-col",
          isDark
            ? "bg-[#151C18] border-[#29332C] text-[#F4F0E8] shadow-[0_20px_60px_rgba(0,0,0,0.85)]"
            : "bg-[#FFFFFF] border-[#D8D1C5] text-[#252522] shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
        )}
        style={{
          maxHeight: "min(580px, 85vh)",
        }}
      >
        {/* Header Search Input */}
        <div
          className={cn(
            "flex items-center gap-3 px-4 py-3.5 border-b",
            isDark ? "border-[#29332C] bg-[#111713]" : "border-[#D8D1C5] bg-[#F4F0E8]/60"
          )}
        >
          <Search
            size={19}
            className={cn("shrink-0", isDark ? "text-[#8ACF3F]" : "text-[#6F7F5F]")}
          />
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="search-results-list"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search SolarGrid pages, telemetry, circuits…"
            className={cn(
              "w-full bg-transparent text-sm font-medium focus:outline-none placeholder:text-xs",
              isDark
                ? "text-[#F4F0E8] placeholder-[#767D74]"
                : "text-[#252522] placeholder-[#8A8A80]"
            )}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search input"
              className={cn(
                "p-1 rounded-md transition-colors",
                isDark ? "text-[#A8ADA5] hover:text-[#F4F0E8]" : "text-[#68685F] hover:text-[#252522]"
              )}
            >
              <X size={15} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className={cn(
              "px-2 py-0.5 rounded text-[11px] font-mono border transition-colors",
              isDark
                ? "border-[#29332C] bg-[#1A241E] text-[#A8ADA5] hover:text-[#F4F0E8]"
                : "border-[#D8D1C5] bg-[#EAE3D6] text-[#68685F] hover:text-[#252522]"
            )}
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div
          ref={listRef}
          id="search-results-list"
          role="listbox"
          className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-transparent"
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;

              return (
                <div
                  key={item.id}
                  data-index={index}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(item.href)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-150 select-none",
                    isSelected
                      ? isDark
                        ? "bg-[#1F2922] border border-[#38463D] shadow-sm"
                        : "bg-[#EDE8DE] border border-[#C5BCAD] shadow-xs"
                      : "border border-transparent hover:bg-transparent"
                  )}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border transition-colors",
                        isSelected
                          ? isDark
                            ? "bg-[#18231B] border-[#8ACF3F]/50 text-[#8ACF3F]"
                            : "bg-[#FFFFFF] border-[#6F7F5F]/50 text-[#6F7F5F]"
                          : isDark
                          ? "bg-[#111713] border-[#29332C] text-[#A8ADA5]"
                          : "bg-[#F4F0E8] border-[#D8D1C5] text-[#68685F]"
                      )}
                    >
                      <Icon size={17} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "font-sans text-xs sm:text-sm font-bold truncate leading-tight",
                            isSelected
                              ? isDark
                                ? "text-[#F4F0E8]"
                                : "text-[#252522]"
                              : isDark
                              ? "text-[#D2D7D0]"
                              : "text-[#3A3935]"
                          )}
                        >
                          {item.label}
                        </span>
                        <span
                          className={cn(
                            "font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-semibold shrink-0",
                            isDark
                              ? "bg-[#101713] text-[#8ACF3F] border border-[#29332C]"
                              : "bg-[#EAE3D6] text-[#6F7F5F] border border-[#D8D1C5]"
                          )}
                        >
                          {item.category}
                        </span>
                      </div>
                      <p
                        className={cn(
                          "text-[11px] truncate mt-0.5 leading-normal",
                          isDark ? "text-[#A8ADA5]" : "text-[#68685F]"
                        )}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 pl-3">
                    <ArrowRight
                      size={15}
                      className={cn(
                        "transition-all duration-150",
                        isSelected
                          ? isDark
                            ? "text-[#8ACF3F] translate-x-1"
                            : "text-[#6F7F5F] translate-x-1"
                          : "text-transparent"
                      )}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 px-4 text-center">
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-3 border",
                  isDark
                    ? "bg-[#111713] border-[#29332C] text-[#A8ADA5]"
                    : "bg-[#F4F0E8] border-[#D8D1C5] text-[#68685F]"
                )}
              >
                <Search size={22} />
              </div>
              <h3
                className={cn(
                  "text-sm font-bold",
                  isDark ? "text-[#F4F0E8]" : "text-[#252522]"
                )}
              >
                No matching results found
              </h3>
              <p
                className={cn(
                  "text-xs mt-1 max-w-xs mx-auto",
                  isDark ? "text-[#A8ADA5]" : "text-[#68685F]"
                )}
              >
                No routes or telemetry match &ldquo;<span className="font-semibold">{query}</span>&rdquo;. Try searching for &ldquo;solar&rdquo;, &ldquo;battery&rdquo;, or &ldquo;ICU&rdquo;.
              </p>
            </div>
          )}
        </div>

        {/* Footer with Keyboard Guide */}
        <div
          className={cn(
            "px-4 py-2.5 border-t flex flex-wrap items-center justify-between text-[11px] font-mono",
            isDark ? "border-[#29332C] bg-[#111713] text-[#767D74]" : "border-[#D8D1C5] bg-[#F4F0E8] text-[#68685F]"
          )}
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd
                className={cn(
                  "px-1.5 py-0.5 rounded text-[10px] font-bold border",
                  isDark ? "bg-[#151C18] border-[#29332C]" : "bg-[#FFFFFF] border-[#D8D1C5]"
                )}
              >
                <ArrowUp size={10} className="inline mr-0.5" />
                <ArrowDown size={10} className="inline" />
              </kbd>{" "}
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd
                className={cn(
                  "px-1.5 py-0.5 rounded text-[10px] font-bold border",
                  isDark ? "bg-[#151C18] border-[#29332C]" : "bg-[#FFFFFF] border-[#D8D1C5]"
                )}
              >
                <CornerDownLeft size={10} className="inline" />
              </kbd>{" "}
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd
                className={cn(
                  "px-1.5 py-0.5 rounded text-[10px] font-bold border",
                  isDark ? "bg-[#151C18] border-[#29332C]" : "bg-[#FFFFFF] border-[#D8D1C5]"
                )}
              >
                ESC
              </kbd>{" "}
              Close
            </span>
          </div>

          <span className="hidden sm:inline-flex text-[10px] font-medium">
            SolarGrid Intelligence
          </span>
        </div>
      </div>
    </div>
  );
}
