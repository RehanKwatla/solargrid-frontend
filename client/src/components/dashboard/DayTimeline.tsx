import { dayTimeline } from "@/data/mockData";
import { cn } from "@/lib/utils";

export function DayTimeline() {
  return (
    <div className="flex gap-0 overflow-x-auto py-2">
      {dayTimeline.map((node, index) => (
        <div key={node.time} className="flex-1 min-w-[72px] text-center relative group">
          {/* Connector line */}
          {index < dayTimeline.length - 1 && (
            <div className="absolute top-[7px] left-[calc(50%+5px)] right-[-50%] h-[1px] bg-border z-0" />
          )}
          
          <div 
            className={cn(
              "w-2.5 h-2.5 rounded-full mx-auto mb-2.5 relative z-10 transition-colors",
              node.active ? "bg-[var(--accent)] shadow-[0_0_6px_color-mix(in_oklab,var(--accent)_40%,transparent)]" : "bg-border group-hover:bg-border-strong"
            )} 
          />
          <p className="font-mono text-[9px] font-medium tracking-wide text-text-tertiary">{node.time}</p>
          <p className="text-[10px] text-text-secondary mt-0.5 font-medium">{node.label}</p>
        </div>
      ))}
    </div>
  );
}
