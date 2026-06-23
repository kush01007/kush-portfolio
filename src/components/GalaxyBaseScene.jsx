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
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  CanvasTexture,
  LinearFilter,
  SRGBColorSpace,
} from "three";
import TechOrb from "./TechOrb";
import { techOrbs, technologyShowcase } from "../data/portfolioData";

const galaxyPaths = [
  { radius: 1.72, depth: 0.84, tilt: 0.018, opacity: 0.07, width: 0.3 },
  { radius: 2.24, depth: 0.95, tilt: -0.052, opacity: 0.17, width: 0.52 },
  { radius: 2.73, depth: 0.88, tilt: 0.038, opacity: 0.075, width: 0.32 },
  { radius: 3.28, depth: 1.02, tilt: 0.058, opacity: 0.145, width: 0.48 },
  { radius: 3.74, depth: 0.91, tilt: -0.032, opacity: 0.065, width: 0.3 },
  { radius: 4.22, depth: 1.04, tilt: -0.045, opacity: 0.125, width: 0.44 },
  { radius: 4.68, depth: 0.9, tilt: 0.03, opacity: 0.06, width: 0.3 },
  { radius: 5.06, depth: 0.98, tilt: -0.018, opacity: 0.09, width: 0.38 },
];

const coreRingRadii = [
  0.16, 0.27, 0.4, 0.54, 0.7, 0.88, 1.08, 1.29, 1.51,
];

const highlightedArcs = [
  { pathIndex: 1, start: 3.52, end: 4.34, opacity: 0.48, width: 0.78 },
  { pathIndex: 3, start: 4.46, end: 5.28, opacity: 0.42, width: 0.72 },
  { pathIndex: 5, start: 5.72, end: 6.42, opacity: 0.4, width: 0.7 },
  { pathIndex: 5, start: 1.12, end: 1.92, opacity: 0.34, width: 0.66 },
  { pathIndex: 7, start: 2.02, end: 2.74, opacity: 0.3, width: 0.62 },
];

const sceneCompositions = {
  mobile: {
    camera: [6.4, 3.7, 7.8],
    target: [0, -0.28, 0],
    fov: 43,
    rigPosition: [0, 0.08, 0],
    rigRotation: [0, -0.04, 0.015],
    rigScale: 1.08,
  },
  tablet: {
    camera: [7.85, 4.8, 8.85],
    target: [0, -0.35, 0],
    fov: 42,
    rigPosition: [0.1, -0.12, 0],
    rigRotation: [0, -0.055, 0.012],
    rigScale: 1.04,
  },
  desktop: {
    camera: [7.95, 5.25, 8.15],
    target: [0.8, -0.55, 0],
    fov: 38,
    rigPosition: [0.8, 0, 0],
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

const createOrbitArcPoints = (path, start, end, segments = 72) =>
  Array.from({ length: segments + 1 }, (_, index) => {
    const angle = start + (index / segments) * (end - start);
    const flatDepth = Math.sin(angle) * path.radius * path.depth;

    return [
      Math.cos(angle) * path.radius,
      flatDepth * Math.sin(path.tilt),
      flatDepth * Math.cos(path.tilt),
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

const createGlowTexture = ({
  inner = "rgba(235,248,255,1)",
  middle = "rgba(110,184,247,0.42)",
  outer = "rgba(70,145,215,0)",
} = {}) => {
  const canvas = document.createElement("canvas");
  canvas.width = 160;
  canvas.height = 160;

  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(80, 80, 0, 80, 80, 78);

  gradient.addColorStop(0, inner);
  gradient.addColorStop(0.16, "rgba(210,240,255,0.92)");
  gradient.addColorStop(0.34, middle);
  gradient.addColorStop(1, outer);

  context.fillStyle = gradient;
  context.fillRect(0, 0, 160, 160);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;

  return texture;
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

const OrbitGlitter = ({ count, seed, size, opacity }) => {
  const positions = useMemo(() => {
    const points = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const offset = index * 3;
      const useCore = seededValue(index, seed + 7) < 0.58;
      const path = useCore
        ? {
            radius:
              coreRingRadii[
                Math.floor(
                  seededValue(index, seed + 11) * coreRingRadii.length,
                )
              ],
            depth: 0.8,
            tilt: 0.012,
          }
        : galaxyPaths[
            Math.floor(
              seededValue(index, seed + 13) * galaxyPaths.length,
            )
          ];
      const angle = seededValue(index, seed + 17) * Math.PI * 2;
      const position = pointOnOrbit(path, angle);
      const radialJitter = (seededValue(index, seed + 19) - 0.5) * 0.055;

      points[offset] = position[0] * (1 + radialJitter);
      points[offset + 1] =
        position[1] + (seededValue(index, seed + 23) - 0.5) * 0.035;
      points[offset + 2] = position[2] * (1 + radialJitter);
    }

    return points;
  }, [count, seed]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#DDF2FF"
        size={size}
        sizeAttenuation
        transparent
        opacity={opacity}
        blending={AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
};

const CentralGalaxyCore = () => {
  const coreGlow = useMemo(() => createGlowTexture(), []);
  const softHalo = useMemo(
    () =>
      createGlowTexture({
        inner: "rgba(155,211,255,0.42)",
        middle: "rgba(80,156,230,0.16)",
        outer: "rgba(30,85,145,0)",
      }),
    [],
  );
  const coreSparkles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => {
        const angle = seededValue(index, 61) * Math.PI * 2;
        const radius = 0.12 + seededValue(index, 63) * 0.62;
        return {
          position: [
            Math.cos(angle) * radius,
            (seededValue(index, 67) - 0.5) * 0.08,
            Math.sin(angle) * radius * 0.48,
          ],
          size: 0.008 + seededValue(index, 71) * 0.014,
          opacity: 0.35 + seededValue(index, 73) * 0.45,
        };
      }),
    [],
  );
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
          opacity={0.035}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <sprite scale={[1.45, 1.45, 1]}>
        <spriteMaterial
          map={softHalo}
          color="#83C8FF"
          transparent
          opacity={0.38}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>

      <sprite scale={[0.58, 0.58, 1]}>
        <spriteMaterial
          map={coreGlow}
          color="#DDF5FF"
          transparent
          opacity={0.95}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>

      {coreSparkles.map((sparkle, index) => (
        <sprite
          key={index}
          position={sparkle.position}
          scale={[sparkle.size, sparkle.size, 1]}
        >
          <spriteMaterial
            map={coreGlow}
            color="#DDF5FF"
            transparent
            opacity={sparkle.opacity}
            blending={AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </sprite>
      ))}

      <mesh>
        <sphereGeometry args={[0.038, 18, 18]} />
        <meshBasicMaterial color="#F3FBFF" toneMapped={false} />
      </mesh>

      <pointLight
        position={[0, 0.16, 0]}
        color="#76BEFF"
        intensity={5.8}
        distance={3.2}
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

  const highlightPaths = useMemo(
    () =>
      highlightedArcs.map((highlight) => ({
        ...highlight,
        points: createOrbitArcPoints(
          galaxyPaths[highlight.pathIndex],
          highlight.start,
          highlight.end,
        ),
      })),
    [],
  );

  const markers = useMemo(
    () => [
      { position: pointOnOrbit(galaxyPaths[1], 0.3), size: 0.018 },
      { position: pointOnOrbit(galaxyPaths[1], 3.68), size: 0.014 },
      { position: pointOnOrbit(galaxyPaths[2], 4.24), size: 0.012 },
      { position: pointOnOrbit(galaxyPaths[3], 0.84), size: 0.019 },
      { position: pointOnOrbit(galaxyPaths[3], 2.58), size: 0.012 },
      { position: pointOnOrbit(galaxyPaths[4], 5.3), size: 0.014 },
      { position: pointOnOrbit(galaxyPaths[5], 0.5), size: 0.022 },
      { position: pointOnOrbit(galaxyPaths[5], 2.94), size: 0.016 },
      { position: pointOnOrbit(galaxyPaths[6], 5.52), size: 0.012 },
      { position: pointOnOrbit(galaxyPaths[7], 1.34), size: 0.017 },
      { position: pointOnOrbit(galaxyPaths[7], 3.3), size: 0.011 },
    ],
    [],
  );

  return (
    <group position={[0, -0.13, 0]}>
      {paths.map((path) => (
        <Line
          key={`${path.radius}-${path.tilt}`}
          points={path.points}
          color="#74ADE0"
          lineWidth={path.width}
          transparent
          opacity={path.opacity}
          depthWrite={false}
        />
      ))}

      {highlightPaths.map((path, index) => (
        <group key={`${path.pathIndex}-${index}`}>
          <Line
            points={path.points}
            color="#4B9FDF"
            lineWidth={path.width * 3.1}
            transparent
            opacity={0.055}
            blending={AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
          <Line
            points={path.points}
            color="#9AD5FF"
            lineWidth={path.width}
            transparent
            opacity={path.opacity}
            blending={AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </group>
      ))}

      {markers.map((marker, index) => (
        <mesh key={index} position={marker.position}>
          <sphereGeometry args={[marker.size * 0.44, 8, 8]} />
          <meshBasicMaterial color="#EAF7FF" toneMapped={false} />
        </mesh>
      ))}

      <OrbitGlitter count={78} seed={29} size={0.012} opacity={0.42} />
      <OrbitGlitter count={32} seed={47} size={0.019} opacity={0.72} />

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
  const orbScale = mobile ? 0.92 : tablet ? 0.82 : 0.9;
  const orbitScale = mobile ? 1.12 : tablet ? 0.96 : 1.14;
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
          intensity={1.15}
          color="#F4FAFF"
          position={[-0.4, 4.8, 4.2]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[5.8, 0.82, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.3}
          color="#E5F3FF"
          position={[-4.4, 1.25, 3.4]}
          rotation={[0, Math.PI / 3, 0]}
          scale={[0.72, 4.6, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.9}
          color="#DDEEFF"
          position={[4.3, -0.8, 2.8]}
          rotation={[0, -Math.PI / 3, 0]}
          scale={[0.58, 3.1, 1]}
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
      />

      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom
          intensity={mobile ? 0.22 : tablet ? 0.3 : 0.36}
          luminanceThreshold={0.82}
          luminanceSmoothing={0.18}
          mipmapBlur
          radius={0.4}
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
  const tabletViewport = useMediaQuery("(min-width:640px) and (max-width:1023px)");
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
      className="relative h-[640px] overflow-hidden rounded-[18px] border border-white/10 bg-[#020508] shadow-[inset_0_1px_0_rgba(255,255,255,0.025),0_28px_100px_rgba(0,0,0,0.35)] sm:h-[740px] sm:rounded-[22px] lg:h-[calc(100svh-3rem)] lg:min-h-[700px] lg:max-h-[880px]"
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

      <div className="absolute inset-x-0 bottom-[86px] top-[250px] sm:bottom-0 sm:top-[260px] lg:inset-0">
        <Canvas
            dpr={compactViewport || tabletViewport ? 1 : [1, 1.35]}
            frameloop={reducedMotion ? "demand" : tabletViewport ? "demand" : "always"}
            performance={{ min: tabletViewport ? 0.28 : 0.45 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: compactViewport || tabletViewport ? "low-power" : "high-performance",
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
