import { Bell, Clock, Menu, Search, Moon, Sun, User } from "lucide-react";
import { useLocation } from "wouter";
import { useSolarTracking } from "@/contexts/SolarTrackingContext";
import { useTheme } from "@/contexts/ThemeContext";
import { facility } from "@/data/mockData";

const titles: Record<string, string> = {
  "/overview": "Energy overview",
  "/energy": "Energy",
  "/intelligence": "Intelligence",
  "/alerts": "Events",
  "/feature-1": "Metering",
};

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const [location] = useLocation();
  const { formattedTime } = useSolarTracking();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border bg-background/95 backdrop-blur px-5 sm:px-7 lg:px-8 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-surface-soft transition-colors lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>
        <div>
          <div className="hidden items-center gap-2 text-sm text-text-secondary sm:flex">
            <span>SolarGrid</span>
            <span>/</span>
            <span>{facility.name}</span>
          </div>
          <p className="font-sans text-lg font-semibold text-foreground sm:mt-1">
            {titles[location] ?? "Overview"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <div className="hidden items-center gap-2 sm:flex">
          <Clock size={16} className="text-text-secondary" />
          <span className="font-sans text-sm font-medium text-text-primary">
            {formattedTime}
          </span>
          <span className="ml-2 flex items-center gap-1.5 rounded-full bg-surface-soft px-2.5 py-1 text-xs font-medium text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success"></span>
            System Online
          </span>
        </div>
        
        <div className="h-6 w-px bg-border hidden sm:block"></div>

        <div className="flex items-center gap-2">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary hover:bg-surface-soft hover:text-foreground transition-colors"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
          
          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-text-secondary hover:bg-surface-soft hover:text-foreground transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2.5 flex h-2 w-2 rounded-full bg-danger"></span>
          </button>

          {toggleTheme && (
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary hover:bg-surface-soft hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          )}

          <div className="h-6 w-px bg-border mx-1"></div>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-soft text-primary hover:bg-primary/10 transition-colors"
            aria-label="User profile"
          >
            <User size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
