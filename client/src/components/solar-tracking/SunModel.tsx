import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import { sunPosition3D } from "@/lib/solarSimulation";

type SunModelProps = {
  sunAzimuth: number;
  sunAltitude: number;
  visible: boolean;
};

export function SunModel({ sunAzimuth, sunAltitude, visible }: SunModelProps) {
  const sunRef = useRef<Mesh>(null);
  const pos = sunPosition3D(sunAzimuth, sunAltitude);

  useFrame((state) => {
    if (sunRef.current && visible) {
      sunRef.current.position.set(pos.x, pos.y, pos.z);
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.04;
      sunRef.current.scale.setScalar(pulse);
    }
  });

  if (!visible) return null;

  return (
    <group>
      <mesh ref={sunRef} position={[pos.x, pos.y, pos.z]}>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshStandardMaterial
          color="#ffd080"
          emissive="#ffaa33"
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[pos.x, pos.y, pos.z]}>
        <sphereGeometry args={[0.85, 16, 16]} />
        <meshBasicMaterial color="#ffcc55" transparent opacity={0.12} />
      </mesh>
      <pointLight
        position={[pos.x, pos.y, pos.z]}
        intensity={2.2}
        color="#ffe8b0"
        distance={30}
        castShadow
      />
    </group>
  );
}
