import { dayTimeline } from "@/data/mockData";
import { cn } from "@/lib/utils";

export function DayTimeline() {
  return (
    <div className="timeline-track">
      {dayTimeline.map((node) => (
        <div key={node.time} className="timeline-node">
          <div className={cn("timeline-dot", node.active && "timeline-dot-active")} />
          <p className="timeline-time">{node.time}</p>
          <p className="timeline-label">{node.label}</p>
        </div>
      ))}
    </div>
  );
}
