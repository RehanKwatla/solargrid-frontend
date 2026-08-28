import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useSolarTracking } from "@/contexts/SolarTrackingContext";
import { computeSunPosition } from "@/lib/solarSimulation";
import { SolarPanelModel } from "./SolarPanelModel";
import { SunModel } from "./SunModel";
import { cn } from "@/lib/utils";

function Scene() {
  const { simulation } = useSolarTracking();
  const { isDaylight } = computeSunPosition(simulation.timeOfDay);

  return (
    <>
      <color attach="background" args={[isDaylight ? "#afd4e5" : "#101711"]} />
      <fog attach="fog" args={[isDaylight ? "#afd4e5" : "#101711", 18, 42]} />
      <ambientLight intensity={isDaylight ? 0.7 : 0.08} />
      {!isDaylight && (
        <Stars radius={50} depth={20} count={800} factor={3} fade speed={0.4} />
      )}
      <directionalLight
        position={[6, 10, 4]}
        intensity={isDaylight ? 1.25 : 0.05}
        color="#fff2c4"
        castShadow
      />
      <SunModel
        sunAzimuth={simulation.sunAzimuth}
        sunAltitude={simulation.sunAltitude}
        visible={isDaylight}
      />
      <SolarPanelModel
        panelAzimuth={simulation.panelAzimuth}
        panelTilt={simulation.panelTilt}
      />
      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={22}
        maxPolarAngle={Math.PI / 2 + 0.15}
        target={[0, 1.5, 0]}
      />
    </>
  );
}

export function SolarTracking3D() {
  const { simulation, formattedTime } = useSolarTracking();
  const isActive = simulation.trackingStatus === "ACTIVE";

  return (
    <div className="relative h-[min(52vh,420px)] min-h-[280px] w-full overflow-hidden bg-[#a8c8d8] dark:bg-[#1a2e1c]">
      <Canvas
        shadows
        camera={{ position: [7, 5, 7], fov: 42 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* Live status overlay — bottom left */}
      <div className="absolute bottom-3 left-3 pointer-events-none">
        <div className="flex items-center gap-2 border border-[var(--accent-soft)] bg-surface/90 backdrop-blur-sm px-2.5 py-1.5">
          <i
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              isActive ? "bg-[var(--healthy)] animate-pulse" : "bg-[var(--text-tertiary)]"
            )}
          />
          <span className="font-mono text-[9px] uppercase tracking-[.1em] text-[var(--text-secondary)]">
            {formattedTime} · {simulation.trackingStatus}
          </span>
        </div>
      </div>

      {/* Generation overlay — bottom right */}
      <div className="absolute bottom-3 right-3 pointer-events-none">
        <div className="flex items-baseline gap-1 border border-[var(--accent-soft)] bg-surface/90 backdrop-blur-sm px-2.5 py-1.5">
          <span className="text-lg font-semibold tracking-[-.04em] text-[var(--accent)]">
            {simulation.solarGenerationKw}
          </span>
          <span className="font-mono text-[10px] text-[var(--text-secondary)]">kW</span>
        </div>
      </div>
    </div>
  );
}
