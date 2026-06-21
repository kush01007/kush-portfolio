import { useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { FaGithub, FaNodeJs } from "react-icons/fa";
import {
  SiExpress,
  SiJavascript,
  SiMongodb,
  SiReact,
  SiTailwindcss,
  SiVercel,
} from "react-icons/si";
import { DoubleSide } from "three";
import TechOrb from "./TechOrb";
import { techOrbs } from "../data/portfolioData";

const technologyIcons = {
  React: SiReact,
  JavaScript: SiJavascript,
  Tailwind: SiTailwindcss,
  Node: FaNodeJs,
  Express: SiExpress,
  MongoDB: SiMongodb,
  GitHub: FaGithub,
  Vercel: SiVercel,
};

const orbitRings = [
  { radius: 2.15, tilt: -0.06, opacity: 0.15 },
  { radius: 3.15, tilt: 0.055, opacity: 0.11 },
  { radius: 4.2, tilt: -0.04, opacity: 0.08 },
];

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
  const canvasWidth = useThree((state) => state.size.width);
  const compact = canvasWidth < 640;

  return (
    <>
      <color attach="background" args={["#05080D"]} />
      <fog attach="fog" args={["#05080D", 8, 24]} />

      <PerspectiveCamera
        makeDefault
        position={[0, compact ? 1.5 : 1.2, compact ? 11 : 9.5]}
        fov={42}
      />

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

      {orbitRings.map((ring) => (
        <mesh
          key={ring.radius}
          rotation={[Math.PI / 2 - ring.tilt, 0, 0]}
        >
          <ringGeometry
            args={[ring.radius - 0.012, ring.radius + 0.012, 160]}
          />
          <meshBasicMaterial
            color="#9DB7D5"
            transparent
            opacity={ring.opacity}
            depthWrite={false}
            side={DoubleSide}
          />
        </mesh>
      ))}

      {techOrbs.map((technology) => {
        const Icon = technologyIcons[technology.icon];

        return (
          <TechOrb
            key={technology.name}
            icon={Icon}
            label={technology.name}
            position={[0, technology.yOffset, 0]}
            size={technology.size * (compact ? 0.82 : 1)}
            rotationSpeed={technology.rotationSpeed}
            orbitRadius={technology.radius}
            orbitAngle={technology.startAngle}
            revolutionSpeed={technology.orbitSpeed}
            floatAmplitude={technology.floatAmount}
            orbitTilt={technology.orbitTilt}
          />
        );
      })}

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
