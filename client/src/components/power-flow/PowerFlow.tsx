import { operatingState, assets } from "@/data/mockData";
import { useTelemetry } from "@/contexts/SolarTrackingContext";
import { cn } from "@/lib/utils";

/** Clean Modern Power Flow Graphic */
export function PowerFlow() {
  const t = useTelemetry();
  const solarActive = t.solarKw > 0;
  const batteryCharging = t.batteryKw > 0;
  const gridImporting = t.gridKw > 0 && t.gridConnected;

  return (
    <div className="w-full">
      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-col items-center w-full max-w-4xl mx-auto">
        
        {/* Top Nodes */}
        <div className="flex w-full justify-between px-10">
          <SourceNode 
            assetId={assets.pv01.id}
            label="Solar Array" 
            value={`${t.solarKw.toFixed(1)} kW`} 
            active={solarActive} 
            colorClass="text-accent border-accent/40 bg-accent/5"
          />
          <SourceNode 
            assetId={assets.grid01.id}
            label="Grid Inlet" 
            value={`${t.gridKw.toFixed(1)} kW`} 
            active={gridImporting} 
            colorClass="text-accent border-accent/40 bg-accent/5"
          />
        </div>

        {/* Vertical Flow Lines Down to Bus */}
        <div className="flex w-full justify-between px-32 relative h-12">
           <div className={cn("w-[2px] h-full mx-auto", solarActive ? "bg-accent" : "bg-border")}></div>
           <div className={cn("w-[2px] h-full mx-auto", gridImporting ? "bg-accent" : "bg-border")}></div>
        </div>

        {/* Energy Bus */}
        <div className="w-full border-y border-border bg-surface-soft flex justify-between items-center px-6 py-4 z-10 relative">
          <span className="font-mono text-xs font-medium uppercase tracking-[.08em] text-foreground">Energy Bus</span>
          <span className="inline-flex items-center border border-healthy/30 bg-healthy/10 px-2 py-1 font-mono text-[9px] font-medium uppercase tracking-[.06em] text-healthy">
            {operatingState.mode}
          </span>
        </div>

        {/* Vertical Flow Lines Down to Branches */}
        <div className="flex w-full justify-between px-16 relative h-12">
           <div className={cn("w-[2px] h-full mx-auto", solarActive ? "bg-accent" : "bg-border")}></div>
           <div className={cn("w-[2px] h-full mx-auto", solarActive ? "bg-healthy" : "bg-border")}></div>
           <div className={cn("w-[2px] h-full mx-auto", batteryCharging ? "bg-healthy" : "bg-border")}></div>
        </div>

        {/* Bottom Nodes */}
        <div className="flex w-full justify-between">
          <BranchNode 
            assetId={assets.loadT1.id}
            label="Critical Load" 
            value={`${t.criticalLoadKw.toFixed(1)} kW`} 
            active={true}
            colorClass="text-accent border-accent/40 bg-accent/5"
          />
          <BranchNode 
            assetId="FACILITY"
            label="Facility Load" 
            value={`${(t.loadKw - t.criticalLoadKw).toFixed(1)} kW`}
            active={true}
            colorClass="text-healthy border-healthy/40 bg-healthy/5"
          />
          <BranchNode 
            assetId={assets.bess01.id}
            label="Battery Bank" 
            value={`${t.batterySoc}%`}
            sub={batteryCharging ? `+${t.batteryKw} kW` : `${t.batteryKw} kW`}
            active={batteryCharging}
            colorClass="text-healthy border-healthy/40 bg-healthy/5"
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col gap-3">
        <MobileNode assetId={assets.pv01.id} label="Solar Array" value={`${t.solarKw.toFixed(1)} kW`} active={solarActive} colorClass="text-accent" />
        <MobileNode assetId={assets.grid01.id} label="Grid Inlet" value={`${t.gridKw.toFixed(1)} kW`} active={gridImporting} colorClass="text-accent" />
        
        <div className="w-full text-center py-1">
           <span className="text-border">↓</span>
        </div>
        
        <div className="w-full border-y border-border bg-surface-soft p-3 text-center">
           <span className="font-mono text-xs font-medium uppercase tracking-[.08em] text-foreground">Energy Bus</span>
        </div>
        
        <div className="w-full text-center py-1">
           <span className="text-border">↓</span>
        </div>
        
        <MobileNode assetId={assets.loadT1.id} label="Critical Load" value={`${t.criticalLoadKw.toFixed(1)} kW`} active={true} colorClass="text-accent" />
        <MobileNode assetId="FACILITY" label="Facility Load" value={`${(t.loadKw - t.criticalLoadKw).toFixed(1)} kW`} active={true} colorClass="text-healthy" />
        <MobileNode assetId={assets.bess01.id} label="Battery Bank" value={`${t.batterySoc}%`} active={batteryCharging} colorClass="text-healthy" />
      </div>

    </div>
  );
}

function SourceNode({ assetId, label, value, active, colorClass }: any) {
  return (
    <div className={cn("border bg-surface p-4 w-48 text-center transition-colors", active ? colorClass : "border-border opacity-80")}>
      <div className="inline-flex items-center border border-border bg-surface-soft px-2 py-0.5 font-mono text-[9px] font-medium text-text-secondary mb-2">{assetId}</div>
      <div className="text-sm font-semibold text-foreground mb-1">{label}</div>
      <div className={cn("text-2xl font-bold", active ? "text-current" : "text-foreground")}>{value}</div>
    </div>
  );
}

function BranchNode({ assetId, label, value, sub, active, colorClass }: any) {
  return (
    <div className={cn("border bg-surface p-4 w-48 text-center transition-colors", active ? colorClass : "border-border opacity-80")}>
      <div className="inline-flex items-center border border-border bg-surface-soft px-2 py-0.5 font-mono text-[9px] font-medium text-text-secondary mb-2">{assetId}</div>
      <div className="text-sm font-semibold text-foreground mb-1">{label}</div>
      <div className={cn("text-2xl font-bold", active ? "text-current" : "text-foreground")}>{value}</div>
      {sub && <div className="text-[10px] font-medium mt-1 text-text-secondary">{sub}</div>}
    </div>
  );
}

function MobileNode({ assetId, label, value, active, colorClass }: any) {
  return (
    <div className={cn("flex justify-between items-center border bg-surface p-4 transition-colors", active ? "border-border" : "border-border opacity-80")}>
      <div>
        <div className="inline-flex items-center border border-border bg-surface-soft px-2 py-0.5 font-mono text-[9px] font-medium text-text-secondary mb-1">{assetId}</div>
        <div className="text-sm font-semibold text-foreground">{label}</div>
      </div>
      <div className={cn("text-xl font-bold", active ? colorClass : 'text-foreground')}>{value}</div>
    </div>
  );
}
