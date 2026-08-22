import { Bell, Clock, Menu, Search } from "lucide-react";
import { useLocation } from "wouter";
import { useSolarTracking } from "@/contexts/SolarTrackingContext";
import { facility } from "@/data/mockData";

const titles: Record<string, string> = {
  "/overview": "Control",
  "/energy": "Energy",
  "/intelligence": "Intelligence",
  "/alerts": "Events",
  "/feature-1": "Metering",
};

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const [location] = useLocation();
  const { formattedTime } = useSolarTracking();

  return (
    <header className="sticky top-0 z-20 flex h-[60px] items-center justify-between border-b border-white/[0.06] bg-[#0b1011]/92 px-5 backdrop-blur-xl sm:px-7 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[.08] text-[#8a9692] lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={17} />
        </button>
        <div>
          <p className="hidden text-sm font-medium text-[#e7ece9] sm:block">
            {titles[location] ?? "Control"}
          </p>
          <p className="facility-location sm:hidden">{facility.name}</p>
        </div>
      </div>

      <div className="hidden items-center gap-2 sm:flex">
        <span className="text-sm text-[#8a9692]">{facility.name}</span>
        <span className="text-[#4a5450]">·</span>
        <span className="facility-location">{facility.location}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-1.5 sm:flex">
          <Clock size={12} className="text-[#6d7874]" />
          <span className="font-mono text-[11px] text-[#8a9692]">{formattedTime}</span>
          <span className="system-online ml-1">Live</span>
        </div>
        <button
          className="hidden h-9 items-center gap-2 rounded-lg border border-white/[.08] px-3 font-mono text-[10px] text-[#6d7874] transition hover:border-white/[.14] hover:text-[#e7ece9] md:flex"
          aria-label="Search assets"
        >
          <Search size={14} />
          Search
        </button>
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/[.08] text-[#8a9692] transition hover:text-[#e7ece9]"
          aria-label="Events"
        >
          <Bell size={16} />
          <i className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#c47060]" />
        </button>
      </div>
    </header>
  );
}
