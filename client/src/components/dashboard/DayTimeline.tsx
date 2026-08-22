import { dayTimeline } from "@/data/mockData";
import { cn } from "@/lib/utils";

export function DayTimeline() {
  return (
    <div className="flex gap-0 overflow-x-auto py-2">
      {dayTimeline.map((node, index) => (
        <div key={node.time} className="flex-1 min-w-[72px] text-center relative group">
          {/* Connector line */}
          {index < dayTimeline.length - 1 && (
            <div className="absolute top-1.5 left-1/2 right-[-50%] h-[1px] bg-border z-0" />
          )}
          
          <div 
            className={cn(
              "w-2.5 h-2.5 rounded-full mx-auto mb-3 relative z-10 transition-colors",
              node.active ? "bg-accent shadow-[0_0_8px_rgba(140,198,63,0.5)]" : "bg-border group-hover:bg-border/80"
            )} 
          />
          <p className="text-[10px] font-semibold text-text-secondary">{node.time}</p>
          <p className="text-[11px] text-text-secondary mt-0.5">{node.label}</p>
        </div>
      ))}
    </div>
  );
}
