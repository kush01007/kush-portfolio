import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { FaGithub, FaNodeJs } from "react-icons/fa";
import {
  SiExpress,
  SiJavascript,
  SiMongodb,
  SiReact,
  SiTailwindcss,
  SiVercel,
} from "react-icons/si";
import { orbTechnologies } from "../data/portfolioData";

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

const desktopPositions = [
  [-2.5, 0.35, 0.2],
  [-5.2, 1.0, -0.35],
  [-7.3, -0.75, 0.15],
  [-1.0, -1.05, 0.25],
  [0.9, 1.0, -0.35],
  [4.0, 0.75, 0.1],
  [7.2, 0.0, 0.15],
  [3.0, -1.05, 0.2],
];

const mobilePositions = [
  [-2.25, 0.85, 0.1],
  [-0.75, 0.95, -0.3],
  [0.75, 0.85, 0.15],
  [2.25, 0.9, -0.2],
  [-2.25, -0.85, 0.2],
  [-0.75, -0.8, -0.2],
  [0.75, -0.9, 0.15],
  [2.25, -0.8, -0.15],
];

const useScenePreferences = () => {
  const [preferences, setPreferences] = useState({
    compact: false,
    reducedMotion: false,
  });

  useEffect(() => {
    const compactQuery = window.matchMedia("(max-width: 640px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updatePreferences = () => {
      setPreferences({
        compact: compactQuery.matches,
        reducedMotion: compactQuery.matches || motionQuery.matches,
      });
    };

    updatePreferences();
    compactQuery.addEventListener("change", updatePreferences);
    motionQuery.addEventListener("change", updatePreferences);

    return () => {
      compactQuery.removeEventListener("change", updatePreferences);
      motionQuery.removeEventListener("change", updatePreferences);
    };
  }, []);

  return preferences;
};

const TechOrb = ({ technology, position, phase, reducedMotion, compact }) => {
  const meshRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const Icon = technologyIcons[technology.icon];

  useFrame((state, delta) => {
    if (!meshRef.current || reducedMotion) return;

    const elapsed = state.clock.elapsedTime;
    meshRef.current.position.y =
      position[1] + Math.sin(elapsed * 0.42 + phase) * 0.08;
    meshRef.current.rotation.y += delta * (hovered ? 0.35 : 0.08);
    meshRef.current.rotation.x += delta * 0.035;

    const targetScale = hovered ? 1.1 : 1;
    const nextScale = THREE.MathUtils.lerp(
      meshRef.current.scale.x,
      targetScale,
      0.08,
    );
    meshRef.current.scale.setScalar(nextScale);
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={reducedMotion && hovered ? 1.06 : 1}
      onPointerEnter={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
    >
      <sphereGeometry args={[compact ? 0.48 : 0.58, 28, 28]} />
      <meshPhysicalMaterial
        color={hovered ? "#18324D" : "#101D2A"}
        emissive={hovered ? "#173A5B" : "#07111A"}
        emissiveIntensity={hovered ? 0.55 : 0.22}
        roughness={0.14}
        metalness={0.08}
        transmission={0.62}
        thickness={1.25}
        transparent
        opacity={0.82}
        clearcoat={1}
        clearcoatRoughness={0.12}
      />

      <Html center distanceFactor={compact ? 5.3 : 6.2} style={{ pointerEvents: "none" }}>
        <div className="flex flex-col items-center text-[#D7E7F7] drop-shadow-[0_0_9px_rgba(157,183,213,0.55)]">
          <Icon size={compact ? 25 : 31} />
          <span className="mt-1 whitespace-nowrap text-[7px] font-medium tracking-wide text-white/55">
            {technology.name}
          </span>
        </div>
      </Html>
    </mesh>
  );
};

const OrbitalScene = ({ compact, reducedMotion }) => {
  const groupRef = useRef(null);
  const positions = compact ? mobilePositions : desktopPositions;

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    groupRef.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.08) * 0.025 +
      state.pointer.x * 0.025;
    groupRef.current.rotation.x = state.pointer.y * 0.012;
  });

  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[0, 4, 5]} intensity={1.2} color="#BBD7F3" />
      <pointLight position={[-5, 1, 3]} intensity={10} color="#4788C8" distance={10} />
      <pointLight position={[5, -1, 2]} intensity={8} color="#8BAFCF" distance={9} />

      <group ref={groupRef}>
        {orbTechnologies.map((technology, index) => (
          <TechOrb
            key={technology.name}
            technology={technology}
            position={positions[index]}
            phase={index * 0.72}
            reducedMotion={reducedMotion}
            compact={compact}
          />
        ))}
      </group>
    </>
  );
};

const TechOrbScene = () => {
  const { compact, reducedMotion } = useScenePreferences();

  return (
    <div className="relative mt-5 h-[240px] overflow-hidden rounded-xl border border-white/10 bg-[#070C12]/80 sm:h-[270px] lg:h-[300px]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.025)_1px,transparent_1px)] bg-[size:36px_36px]" />
      <div className="pointer-events-none absolute left-1/2 top-[62%] h-20 w-[92%] -translate-x-1/2 rounded-[50%] border border-[#9DB7D5]/10" />
      <div className="pointer-events-none absolute left-1/2 top-[56%] h-28 w-[72%] -translate-x-1/2 rounded-[50%] border border-[#9DB7D5]/[0.07]" />
      <div className="pointer-events-none absolute left-1/2 top-[50%] h-36 w-[48%] -translate-x-1/2 rounded-[50%] border border-[#9DB7D5]/[0.05]" />

      <div className="absolute left-5 top-4 z-10 flex items-center gap-2.5 text-xs font-medium text-white/85 sm:left-6 sm:text-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-[#6AAEFF] shadow-[0_0_10px_rgba(106,174,255,0.75)]" />
        Technologies I Work With
      </div>

      <div
        className="absolute inset-0 pt-7"
        role="img"
        aria-label="Slow floating 3D orbs representing React, JavaScript, Tailwind, Node, Express, MongoDB, GitHub, and Vercel"
      >
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 6], fov: compact ? 42 : 38 }}
          frameloop={reducedMotion ? "demand" : "always"}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <OrbitalScene compact={compact} reducedMotion={reducedMotion} />
        </Canvas>
      </div>
    </div>
  );
};

export default TechOrbScene;
