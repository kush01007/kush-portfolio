import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Environment,
  Line,
  Lightformer,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  Vignette,
} from "@react-three/postprocessing";
import { Mouse, MousePointer2 } from "lucide-react";
import { BlendFunction } from "postprocessing";
import { ACESFilmicToneMapping, AdditiveBlending } from "three";
import TechOrb from "./TechOrb";
import { techOrbs, technologyShowcase } from "../data/portfolioData";

const galaxyPaths = [
  { radius: 1.62, depth: 0.94, tilt: 0.025, opacity: 0.07, width: 0.32 },
  { radius: 2.15, depth: 1, tilt: -0.06, opacity: 0.2, width: 0.62 },
  { radius: 2.58, depth: 0.9, tilt: 0.045, opacity: 0.075, width: 0.36, dashed: true },
  { radius: 3.15, depth: 1, tilt: 0.055, opacity: 0.16, width: 0.54 },
  { radius: 3.62, depth: 0.93, tilt: -0.025, opacity: 0.06, width: 0.34, dashed: true },
  { radius: 4.2, depth: 1, tilt: -0.04, opacity: 0.13, width: 0.48 },
  { radius: 4.62, depth: 0.88, tilt: 0.035, opacity: 0.055, width: 0.32 },
];

const coreRingRadii = [0.18, 0.3, 0.44, 0.6, 0.78, 0.98, 1.2, 1.42];

const sceneCompositions = {
  mobile: {
    camera: [0, 4.2, 12.8],
    target: [0, -0.15, 0],
    fov: 46,
    rigPosition: [0, -0.3, 0],
    rigRotation: [0, -0.04, 0.015],
    rigScale: 0.96,
  },
  tablet: {
    camera: [0, 4.8, 11.8],
    target: [0, -0.35, 0],
    fov: 42,
    rigPosition: [0.1, -0.45, 0],
    rigRotation: [0, -0.055, 0.012],
    rigScale: 1.04,
  },
  desktop: {
    camera: [0.15, 5.25, 10.8],
    target: [0.15, -0.55, 0],
    fov: 38,
    rigPosition: [0.15, -0.55, 0],
    rigRotation: [0, -0.065, 0.01],
    rigScale: 1.12,
  },
};

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const updateMatch = () => setMatches(mediaQuery.matches);

    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);
    return () => mediaQuery.removeEventListener("change", updateMatch);
  }, [query]);

  return matches;
};

const createOrbitPoints = ({
  radius,
  depth = 1,
  tilt = 0,
  segments = 220,
}) =>
  Array.from({ length: segments + 1 }, (_, index) => {
    const angle = (index / segments) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const flatDepth = Math.sin(angle) * radius * depth;

    return [
      x,
      flatDepth * Math.sin(tilt),
      flatDepth * Math.cos(tilt),
    ];
  });

const pointOnOrbit = ({ radius, depth = 1, tilt = 0 }, angle) => {
  const flatDepth = Math.sin(angle) * radius * depth;

  return [
    Math.cos(angle) * radius,
    flatDepth * Math.sin(tilt),
    flatDepth * Math.cos(tilt),
  ];
};

const seededValue = (index, seed) => {
  const value = Math.sin(index * 12.9898 + seed * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

const StarField = ({
  count,
  seed,
  minDepth,
  maxDepth,
  size,
  opacity,
  color,
}) => {
  const positions = useMemo(() => {
    const points = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const offset = index * 3;

      points[offset] = (seededValue(index, seed) - 0.5) * 18;
      points[offset + 1] = (seededValue(index, seed + 1) - 0.5) * 7;
      points[offset + 2] =
        minDepth + seededValue(index, seed + 2) * (maxDepth - minDepth);
    }

    return points;
  }, [count, maxDepth, minDepth, seed]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </points>
  );
};

const CentralGalaxyCore = () => {
  const innerPaths = useMemo(
    () =>
      coreRingRadii.map((radius, index) => ({
        radius,
        points: createOrbitPoints({
          radius,
          depth: 0.78 + index * 0.018,
          tilt: index % 2 === 0 ? -0.018 : 0.02,
          segments: 120,
        }),
        opacity: 0.18 - index * 0.012,
      })),
    [],
  );

  return (
    <group position={[0, 0.018, 0]}>
      {innerPaths.map((path) => (
        <Line
          key={path.radius}
          points={path.points}
          color="#7CB8EE"
          lineWidth={0.42}
          transparent
          opacity={path.opacity}
          depthWrite={false}
        />
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.018, 0]}>
        <circleGeometry args={[0.66, 64]} />
        <meshBasicMaterial
          color="#173E63"
          transparent
          opacity={0.055}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.055, 20, 20]} />
        <meshBasicMaterial color="#E9F6FF" toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshBasicMaterial
          color="#70B9F4"
          transparent
          opacity={0.16}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        position={[0, 0.16, 0]}
        color="#76BEFF"
        intensity={3.4}
        distance={2.2}
        decay={2}
      />
    </group>
  );
};

const GalaxyOrbitSystem = () => {
  const paths = useMemo(
    () =>
      galaxyPaths.map((path) => ({
        ...path,
        points: createOrbitPoints(path),
      })),
    [],
  );

  const markers = useMemo(
    () => [
      { position: pointOnOrbit(galaxyPaths[1], 0.28), size: 0.022 },
      { position: pointOnOrbit(galaxyPaths[1], 3.72), size: 0.017 },
      { position: pointOnOrbit(galaxyPaths[3], 0.86), size: 0.02 },
      { position: pointOnOrbit(galaxyPaths[3], 2.62), size: 0.014 },
      { position: pointOnOrbit(galaxyPaths[5], 0.48), size: 0.025 },
      { position: pointOnOrbit(galaxyPaths[5], 2.96), size: 0.018 },
      { position: pointOnOrbit(galaxyPaths[6], 5.52), size: 0.014 },
    ],
    [],
  );

  return (
    <group>
      {paths.map((path) => (
        <Line
          key={`${path.radius}-${path.tilt}`}
          points={path.points}
          color="#74ADE0"
          lineWidth={path.width}
          transparent
          opacity={path.opacity}
          dashed={path.dashed}
          dashSize={0.075}
          gapSize={0.055}
          depthWrite={false}
        />
      ))}

      {markers.map((marker, index) => (
        <mesh key={index} position={marker.position}>
          <sphereGeometry args={[marker.size, 10, 10]} />
          <meshBasicMaterial
            color="#BDE3FF"
            toneMapped={false}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}

      <CentralGalaxyCore />
    </group>
  );
};

const BaseScene = ({
  activeTech,
  reducedMotion,
  onHoverTech,
  onSelectTech,
}) => {
  const canvasWidth = useThree((state) => state.size.width);
  const [draggingOrb, setDraggingOrb] = useState(false);
  const mobile = canvasWidth < 640;
  const tablet = canvasWidth >= 640 && canvasWidth < 1024;
  const orbScale = mobile ? 0.69 : tablet ? 0.82 : 0.9;
  const orbitScale = mobile ? 0.68 : tablet ? 0.85 : 1;
  const composition = mobile
    ? sceneCompositions.mobile
    : tablet
      ? sceneCompositions.tablet
      : sceneCompositions.desktop;

  return (
    <>
      <fog attach="fog" args={["#05080D", 8, 24]} />

      <PerspectiveCamera
        makeDefault
        position={composition.camera}
        fov={composition.fov}
        near={0.1}
        far={80}
      />

      <ambientLight intensity={0.08} color="#AFC4D8" />
      <pointLight
        position={[3.5, 3, 4]}
        intensity={2.35}
        color="#B6D1E8"
        distance={14}
        decay={2}
      />
      <pointLight
        position={[-3, -1.5, 3]}
        intensity={1.05}
        color="#9DB7D5"
        distance={10}
        decay={2}
      />
      <pointLight
        position={[0, 1.4, -4.5]}
        intensity={1.45}
        color="#4D9FE3"
        distance={11}
        decay={2}
      />

      <Environment resolution={mobile ? 64 : 128}>
        <Lightformer
          form="rect"
          intensity={1.45}
          color="#F4FAFF"
          position={[-0.4, 4.8, 4.2]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[5.4, 0.46, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.7}
          color="#E5F3FF"
          position={[-4.4, 1.25, 3.4]}
          rotation={[0, Math.PI / 3, 0]}
          scale={[0.38, 4.4, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.15}
          color="#DDEEFF"
          position={[4.3, -0.8, 2.8]}
          rotation={[0, -Math.PI / 3, 0]}
          scale={[0.3, 2.8, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.9}
          color="#68B7F2"
          position={[0.25, -3.6, 3.2]}
          rotation={[-Math.PI / 2.4, 0, 0]}
          scale={[2.8, 0.22, 1]}
        />
      </Environment>

      <StarField
        count={mobile ? 50 : tablet ? 85 : 120}
        seed={3}
        minDepth={-11}
        maxDepth={-1.5}
        size={0.027}
        opacity={0.34}
        color="#9DB7D5"
      />
      <StarField
        count={mobile ? 18 : tablet ? 30 : 45}
        seed={11}
        minDepth={-0.8}
        maxDepth={4}
        size={0.042}
        opacity={0.3}
        color="#E1EBF5"
      />

      <group
        position={composition.rigPosition}
        rotation={composition.rigRotation}
        scale={composition.rigScale}
      >
        <group scale={orbitScale}>
          <GalaxyOrbitSystem />
        </group>

        {techOrbs.map((technology) => {
          const isActive = activeTech?.name === technology.name;

          return (
            <TechOrb
              key={technology.name}
              label={technology.orbLabel || technology.name}
              model3D={technology.model3D}
              modelPath={technology.modelPath}
              modelColor={technology.modelColor}
              position={[0, technology.yOffset, 0]}
              size={technology.size * orbScale}
              rotationSpeed={technology.rotationSpeed}
              orbitRadius={technology.radius * orbitScale}
              orbitAngle={technology.startAngle}
              revolutionSpeed={technology.orbitSpeed}
              floatAmplitude={technology.floatAmount}
              orbitTilt={technology.orbitTilt}
              motionEnabled={!reducedMotion}
              lowDetail={mobile}
              isActive={isActive}
              isDimmed={false}
              onHoverChange={(hovered) =>
                onHoverTech(hovered ? technology : null)
              }
              onSelect={() => onSelectTech(technology)}
              onDragChange={setDraggingOrb}
            />
          );
        })}
      </group>

      <OrbitControls
        makeDefault
        enabled={!draggingOrb}
        enableDamping={!reducedMotion}
        dampingFactor={0.06}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.35}
        target={composition.target}
        minPolarAngle={Math.PI * 0.22}
        maxPolarAngle={Math.PI * 0.62}
        minAzimuthAngle={-Math.PI * 0.42}
        maxAzimuthAngle={Math.PI * 0.42}
      />

      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom
          intensity={mobile ? 0.2 : tablet ? 0.25 : 0.28}
          luminanceThreshold={0.88}
          luminanceSmoothing={0.14}
          mipmapBlur
          radius={0.3}
        />
        <Vignette
          eskil={false}
          offset={0.18}
          darkness={0.46}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  );
};

const GalaxyBaseScene = () => {
  const [hoveredTech, setHoveredTech] = useState(null);
  const [selectedTech, setSelectedTech] = useState(null);
  const compactViewport = useMediaQuery("(max-width: 639px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const focusedTech = hoveredTech || selectedTech;
  const displayedTech = focusedTech || techOrbs[0];
  const isPinned =
    !hoveredTech && selectedTech?.name === displayedTech.name;

  const handleSelectTech = (technology) => {
    setSelectedTech((current) =>
      current?.name === technology.name ? null : technology,
    );
  };

  return (
    <div
      className="relative h-[700px] overflow-hidden rounded-[18px] border border-white/10 bg-[#020508] shadow-[inset_0_1px_0_rgba(255,255,255,0.025),0_28px_100px_rgba(0,0,0,0.35)] sm:h-[760px] sm:rounded-[22px] lg:h-[calc(100svh-3rem)] lg:min-h-[700px] lg:max-h-[880px]"
      role="region"
      aria-labelledby="technology-galaxy-title"
      aria-describedby="technology-galaxy-description"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_59%_52%,rgba(35,74,111,0.13)_0%,rgba(12,29,45,0.05)_32%,transparent_68%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(157,183,213,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(157,183,213,0.025)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div
        id="technology-galaxy-title"
        className="pointer-events-none absolute left-7 top-8 z-20 w-[calc(100%-3.5rem)] sm:left-10 sm:top-10 sm:w-[340px] lg:left-12 lg:top-10 lg:w-[300px] xl:left-12 xl:top-11"
      >
        <div className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.34em] text-[#84C9FF] sm:text-[11px]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#66B6FF] shadow-[0_0_12px_rgba(102,182,255,0.9)]" />
          {technologyShowcase.eyebrow}
        </div>

        <h2 className="mt-4 font-light tracking-[-0.035em] text-white sm:mt-5">
          <span className="block text-[42px] leading-[0.98] sm:text-[50px] lg:text-[52px]">
            {technologyShowcase.heading}
          </span>
          <span className="mt-2 block text-[42px] leading-[0.98] text-[#80BFFF] sm:text-[50px] lg:text-[52px]">
            {technologyShowcase.headingAccent}
          </span>
        </h2>

        <p className="mt-5 max-w-[260px] text-[13px] leading-6 text-white/55 sm:mt-6 sm:text-sm sm:leading-7">
          {technologyShowcase.description}
        </p>
      </div>

      <p id="technology-galaxy-description" className="sr-only">
        Interactive 3D visualization of React, JavaScript, Tailwind CSS, Node.js,
        Express.js, MongoDB, GitHub, and Vercel. Drag to explore the scene.
      </p>

      <div className="pointer-events-none absolute right-8 top-10 z-20 hidden items-center gap-3 text-xs text-white/55 lg:flex xl:right-12 xl:top-12">
        <MousePointer2 size={20} strokeWidth={1.35} />
        <span>{technologyShowcase.dragHint}</span>
      </div>

      <div
        aria-live="polite"
        aria-atomic="true"
        className={`pointer-events-none absolute bottom-4 left-4 right-4 z-20 rounded-xl border bg-[#03070B]/90 px-4 py-3 shadow-[0_18px_55px_rgba(0,0,0,0.42)] backdrop-blur-xl transition-[border-color,box-shadow] duration-300 sm:bottom-7 sm:left-auto sm:right-7 sm:w-[200px] sm:px-5 sm:py-4 lg:bottom-9 lg:right-8 xl:bottom-10 xl:right-10 ${
          isPinned
            ? "border-[#80BFFF]/25 shadow-[0_18px_60px_rgba(52,116,170,0.12)]"
            : "border-white/10"
        }`}
      >
        <div
          key={displayedTech.name}
          className="tech-card-reveal flex items-end justify-between gap-4 sm:block"
        >
          <div>
            <p className="text-base font-medium text-[#80BFFF] sm:text-xl">
              {displayedTech.displayName || displayedTech.name}
            </p>
            <p className="mt-0.5 text-[11px] text-white/55 sm:mt-1 sm:text-sm">
              {displayedTech.category}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 pb-0.5 text-[10px] text-[#72B9F7] sm:mt-4 sm:pb-0 sm:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#68B6F7] shadow-[0_0_8px_rgba(104,182,247,0.8)]" />
            {displayedTech.discipline || technologyShowcase.detailLabel}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-12 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-5 text-xs text-white/45 lg:flex">
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-white/25" />
        <Mouse size={20} strokeWidth={1.25} />
        <span>{technologyShowcase.scrollHint}</span>
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-white/25" />
      </div>

      <div className="absolute inset-x-0 bottom-[86px] top-[250px] sm:bottom-0 sm:top-[260px] lg:inset-0 lg:left-[220px]">
        <Canvas
          dpr={compactViewport ? 1 : [1, 1.35]}
          frameloop={reducedMotion ? "demand" : "always"}
          performance={{ min: 0.55 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: ACESFilmicToneMapping,
            toneMappingExposure: 0.82,
          }}
          style={{ touchAction: "none" }}
          onPointerMissed={() => {
            setHoveredTech(null);
            setSelectedTech(null);
          }}
          aria-hidden="true"
        >
          <Suspense fallback={null}>
            <BaseScene
              activeTech={focusedTech}
              reducedMotion={reducedMotion}
              onHoverTech={setHoveredTech}
              onSelectTech={handleSelectTech}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default GalaxyBaseScene;
