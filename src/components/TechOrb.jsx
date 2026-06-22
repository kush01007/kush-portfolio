import { memo, useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Billboard, Html, MeshTransmissionMaterial } from "@react-three/drei";
import { AdditiveBlending, Color } from "three";
import TechIcon3D from "./TechIcon3D";

const rimVertexShader = `
  varying vec3 vWorldNormal;
  varying vec3 vViewDirection;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vViewDirection = normalize(cameraPosition - worldPosition.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const rimFragmentShader = `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vWorldNormal;
  varying vec3 vViewDirection;

  void main() {
    float fresnel = pow(1.0 - abs(dot(vWorldNormal, vViewDirection)), 5.6);
    float edge = smoothstep(0.18, 0.96, fresnel);
    gl_FragColor = vec4(uColor * (0.82 + edge * 0.26), edge * uIntensity);
  }
`;

const TechOrb = ({
  label,
  model3D,
  modelPath,
  modelColor,
  position = [0, 0, 0],
  size = 1,
  rotationSpeed = 0.12,
  orbitRadius = 2.25,
  orbitAngle = 0,
  revolutionSpeed = 0.09,
  floatAmplitude = 0.07,
  orbitTilt = 0,
  motionEnabled = true,
  lowDetail = false,
  isActive = false,
  isDimmed = false,
  onHoverChange,
  onSelect,
  onDragChange,
}) => {
  const groupRef = useRef(null);
  const orbRef = useRef(null);
  const rimMaterialRef = useRef(null);
  const draggingRef = useRef(false);
  const dragMovedRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const invalidate = useThree((state) => state.invalidate);
  const has3DModel = Boolean(model3D);
  const sphereSegments = lowDetail ? 24 : 44;
  const glassBackground = useMemo(() => new Color("#010407"), []);
  const rimUniforms = useMemo(
    () => ({
      uColor: { value: new Color("#CBE3F5") },
      uIntensity: { value: 0.29 },
    }),
    [],
  );
  const innerRimUniforms = useMemo(
    () => ({
      uColor: { value: new Color("#7199BC") },
      uIntensity: { value: 0.13 },
    }),
    [],
  );

  const finishDrag = (event) => {
    if (!draggingRef.current) return;

    event.stopPropagation();
    draggingRef.current = false;
    document.body.style.cursor = "pointer";
    onDragChange?.(false);

    if (event.target.hasPointerCapture?.(event.pointerId)) {
      event.target.releasePointerCapture(event.pointerId);
    }
  };

  useEffect(() => {
    return () => {
      document.body.style.cursor = "";
    };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || !orbRef.current) return;

    const elapsed = state.clock.elapsedTime;
    const motionDelta = Math.min(delta, 1 / 30);
    const angle =
      orbitAngle + (motionEnabled ? elapsed * revolutionSpeed : 0);
    const orbitDepth = Math.sin(angle) * orbitRadius;

    groupRef.current.position.x =
      position[0] + Math.cos(angle) * orbitRadius;
    groupRef.current.position.z =
      position[2] + orbitDepth * Math.cos(orbitTilt);
    groupRef.current.position.y =
      position[1] +
      orbitDepth * Math.sin(orbitTilt) +
      (motionEnabled
        ? Math.sin(elapsed * 0.42 + orbitAngle) * floatAmplitude
        : 0);

    if (motionEnabled && !draggingRef.current) {
      orbRef.current.rotation.y += motionDelta * rotationSpeed;
      orbRef.current.rotation.x += motionDelta * rotationSpeed * 0.28;
    }

    const ease = 1 - Math.exp(-motionDelta * 7);
    const targetScale = 1;
    const nextScale = groupRef.current.scale.x +
      (targetScale - groupRef.current.scale.x) * ease;
    groupRef.current.scale.setScalar(nextScale);

    if (rimMaterialRef.current) {
      const targetRim = 0.29;
      const currentRim = rimMaterialRef.current.uniforms.uIntensity.value;
      rimMaterialRef.current.uniforms.uIntensity.value +=
        (targetRim - currentRim) * ease;
    }

  });

  return (
    <group ref={groupRef} position={position}>
      <group ref={orbRef}>
        <mesh
          onPointerOver={(event) => {
            event.stopPropagation();
            document.body.style.cursor = draggingRef.current
              ? "grabbing"
              : "grab";
            onHoverChange?.(true);
          }}
          onPointerOut={(event) => {
            event.stopPropagation();
            if (draggingRef.current) return;
            document.body.style.cursor = "";
            onHoverChange?.(false);
          }}
          onPointerDown={(event) => {
            event.stopPropagation();
            draggingRef.current = true;
            dragMovedRef.current = false;
            lastPointerRef.current = {
              x: event.clientX,
              y: event.clientY,
            };
            event.target.setPointerCapture?.(event.pointerId);
            document.body.style.cursor = "grabbing";
            onHoverChange?.(true);
            onDragChange?.(true);
          }}
          onPointerMove={(event) => {
            if (!draggingRef.current || !orbRef.current) return;

            event.stopPropagation();
            const deltaX = event.clientX - lastPointerRef.current.x;
            const deltaY = event.clientY - lastPointerRef.current.y;

            if (Math.abs(deltaX) + Math.abs(deltaY) > 1) {
              dragMovedRef.current = true;
            }

            orbRef.current.rotation.y += deltaX * 0.012;
            orbRef.current.rotation.x += deltaY * 0.012;
            invalidate();
            lastPointerRef.current = {
              x: event.clientX,
              y: event.clientY,
            };
          }}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          onClick={(event) => {
            event.stopPropagation();

            if (dragMovedRef.current) {
              dragMovedRef.current = false;
              return;
            }

            onSelect?.();
          }}
        >
          <sphereGeometry args={[size, sphereSegments, sphereSegments]} />
          <MeshTransmissionMaterial
            background={glassBackground}
            backside={!lowDetail}
            backsideThickness={size * 0.28}
            backsideEnvMapIntensity={1.15}
            samples={lowDetail ? 2 : 3}
            resolution={lowDetail ? 48 : 72}
            backsideResolution={lowDetail ? 32 : 56}
            color="#B8CAD7"
            transmission={1}
            thickness={size * 0.46}
            ior={1.4}
            roughness={0.035}
            chromaticAberration={0.004}
            anisotropicBlur={0.018}
            distortion={0.006}
            distortionScale={0.3}
            temporalDistortion={0}
            metalness={0}
            clearcoat={1}
            clearcoatRoughness={0.025}
            attenuationColor="#263A49"
            attenuationDistance={1.65}
            envMapIntensity={1.75}
            specularIntensity={1}
            specularColor="#FFFFFF"
            depthWrite={false}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[size * 0.992, sphereSegments, sphereSegments]} />
          <shaderMaterial
            vertexShader={rimVertexShader}
            fragmentShader={rimFragmentShader}
            uniforms={innerRimUniforms}
            transparent
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[size * 1.006, sphereSegments, sphereSegments]} />
          <shaderMaterial
            ref={rimMaterialRef}
            vertexShader={rimVertexShader}
            fragmentShader={rimFragmentShader}
            uniforms={rimUniforms}
            transparent
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

      </group>

      <group position={[0, -size * 0.965, size * 0.08]}>
        <mesh renderOrder={4}>
          <sphereGeometry args={[size * 0.018, 10, 10]} />
          <meshBasicMaterial color="#8CD3FF" toneMapped={false} />
        </mesh>
        <pointLight
          color="#64B9FA"
          intensity={0.52}
          distance={size * 1.4}
          decay={2}
        />
      </group>

      {has3DModel && (
        <Billboard follow position={[0, 0, 0]}>
          <TechIcon3D
            model={model3D}
            src={modelPath}
            color={modelColor}
            size={size}
            lowDetail={lowDetail}
            isActive={isActive}
            isDimmed={isDimmed}
          />
        </Billboard>
      )}

      <Html
        center
        position={[0, -size * 0.58, 0]}
        distanceFactor={7.2}
        style={{ pointerEvents: "none" }}
      >
        <span
          className="whitespace-nowrap text-[11px] font-medium tracking-wide text-white drop-shadow-[0_1px_5px_rgba(0,0,0,0.95)] transition-opacity duration-300"
          style={{
            opacity: isDimmed ? 0.24 : 1,
          }}
        >
          {label}
        </span>
      </Html>
    </group>
  );
};

export default memo(TechOrb);
