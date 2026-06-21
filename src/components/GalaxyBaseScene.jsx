import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { SiReact } from "react-icons/si";
import TechOrb from "./TechOrb";

const StarField = () => {
  const positions = useMemo(() => {
    const starCount = 140;
    const points = new Float32Array(starCount * 3);

    for (let index = 0; index < starCount; index += 1) {
      const offset = index * 3;
      const angle = index * 2.399;
      const radius = 2.5 + ((index * 37) % 100) / 9;

      points[offset] = Math.cos(angle) * radius;
      points[offset + 1] = Math.sin(index * 1.73) * 3.6;
      points[offset + 2] = Math.sin(angle) * radius - 2;
    }

    return points;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#9DB7D5"
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
};

const BaseScene = () => {
  return (
    <>
      <color attach="background" args={["#05080D"]} />
      <fog attach="fog" args={["#05080D", 8, 24]} />

      <PerspectiveCamera makeDefault position={[0, 1.1, 8]} fov={42} />

      <ambientLight intensity={0.45} color="#B9C9D9" />
      <pointLight
        position={[3.5, 3, 4]}
        intensity={18}
        color="#7FA4C8"
        distance={15}
      />
      <pointLight
        position={[-3, -1.5, 3]}
        intensity={8}
        color="#9DB7D5"
        distance={10}
      />

      <StarField />
      <TechOrb icon={SiReact} label="React" position={[0, 0, 0]} />

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.06}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.35}
        minPolarAngle={Math.PI * 0.28}
        maxPolarAngle={Math.PI * 0.72}
      />
    </>
  );
};

const GalaxyBaseScene = () => {
  return (
    <div className="relative mt-5 h-[280px] overflow-hidden rounded-xl border border-white/10 bg-[#05080D] lg:h-[380px]">
      <div className="pointer-events-none absolute left-5 top-4 z-10 flex items-center gap-2.5 text-xs font-medium text-white/85 sm:left-6 sm:text-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-[#6AAEFF] shadow-[0_0_10px_rgba(106,174,255,0.75)]" />
        Technologies I Work With
      </div>

      <div className="absolute inset-0">
        <Canvas
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        >
          <BaseScene />
        </Canvas>
      </div>
    </div>
  );
};

export default GalaxyBaseScene;
