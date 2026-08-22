import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

type SolarPanelModelProps = {
  panelAzimuth: number;
  panelTilt: number;
};

const PANEL_W = 3.2;
const PANEL_D = 0.06;
const PANEL_H = 1.8;

function CellGrid() {
  const rows = 4;
  const cols = 7;
  const cellW = PANEL_W / cols - 0.04;
  const cellH = PANEL_H / rows - 0.04;

  return (
    <group position={[0, PANEL_D / 2 + 0.01, 0]}>
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => (
          <mesh
            key={`${row}-${col}`}
            position={[
              -PANEL_W / 2 + cellW / 2 + 0.02 + col * (cellW + 0.04),
              0,
              -PANEL_H / 2 + cellH / 2 + 0.02 + row * (cellH + 0.04),
            ]}
          >
            <boxGeometry args={[cellW, 0.012, cellH]} />
            <meshStandardMaterial color="#1a2744" metalness={0.6} roughness={0.35} />
          </mesh>
        ))
      )}
    </group>
  );
}

export function SolarPanelModel({ panelAzimuth, panelTilt }: SolarPanelModelProps) {
  const trackerRef = useRef<Group>(null);
  const tiltRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (trackerRef.current) {
      const target = (panelAzimuth * Math.PI) / 180;
      trackerRef.current.rotation.y += (target - trackerRef.current.rotation.y) * Math.min(delta * 4, 1);
    }
    if (tiltRef.current) {
      const target = (-panelTilt * Math.PI) / 180;
      tiltRef.current.rotation.x += (target - tiltRef.current.rotation.x) * Math.min(delta * 4, 1);
    }
  });

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <circleGeometry args={[8, 48]} />
        <meshStandardMaterial color="#5f7645" roughness={0.95} />
      </mesh>

      {/* Base */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.7, 0.16, 16]} />
        <meshStandardMaterial color="#3a4240" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Central pole */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.14, 2.0, 12]} />
        <meshStandardMaterial color="#5a6360" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Azimuth rotation group */}
      <group ref={trackerRef} position={[0, 2.05, 0]}>
        {/* Horizontal arm */}
        <mesh position={[0, 0, 0.35]} castShadow>
          <boxGeometry args={[0.14, 0.14, 0.9]} />
          <meshStandardMaterial color="#6a7370" metalness={0.55} roughness={0.45} />
        </mesh>

        {/* Tilt mechanism */}
        <group ref={tiltRef} position={[0, 0.08, 0.75]}>
          {/* Bracket */}
          <mesh position={[0, -0.06, 0]} castShadow>
            <boxGeometry args={[0.22, 0.12, 0.22]} />
            <meshStandardMaterial color="#78817e" metalness={0.5} roughness={0.5} />
          </mesh>

          {/* Panel frame */}
          <mesh castShadow>
            <boxGeometry args={[PANEL_W + 0.12, PANEL_D, PANEL_H + 0.12]} />
            <meshStandardMaterial color="#2a3330" metalness={0.6} roughness={0.4} />
          </mesh>

          {/* Panel surface */}
          <mesh position={[0, PANEL_D / 2, 0]} castShadow>
            <boxGeometry args={[PANEL_W, PANEL_D * 0.5, PANEL_H]} />
            <meshStandardMaterial
              color="#243656"
              metalness={0.75}
              roughness={0.25}
              emissive="#0a1628"
              emissiveIntensity={0.15}
            />
          </mesh>

          <CellGrid />
        </group>
      </group>
    </group>
  );
}
