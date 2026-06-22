import { memo, useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import CustomShaderMaterial from "three-custom-shader-material";
import {
  AdditiveBlending,
  BackSide,
  Color,
  MeshPhysicalMaterial,
} from "three";
import TechIcon3D from "./TechIcon3D";

const glassVertexShader = `
  varying vec3 vGlassPosition;

  void main() {
    vGlassPosition = position;
  }
`;

const glassFragmentShader = `
  varying vec3 vGlassPosition;

  void main() {
    vec3 glassPoint = normalize(vGlassPosition);
    float broadBand = sin(glassPoint.x * 8.0 + glassPoint.y * 5.0);
    float crossBand = sin(glassPoint.z * 11.0 - glassPoint.y * 4.0);
    float glossVariation = smoothstep(0.24, 0.92, broadBand * crossBand);
    float fineVariation = sin((glassPoint.x + glassPoint.z) * 24.0) * 0.5 + 0.5;

    csm_Roughness = mix(0.024, 0.115, glossVariation * 0.72 + fineVariation * 0.08);
    csm_Clearcoat = 1.0;
    csm_ClearcoatRoughness = mix(0.016, 0.085, glossVariation);
    csm_Transmission = 0.96;
    csm_Thickness = 0.62;
  }
`;

const glassShaderCacheKey = () => "reference-glass-shell-v1";

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
    float fresnel = pow(1.0 - abs(dot(vWorldNormal, vViewDirection)), 3.15);
    float edge = smoothstep(0.08, 0.95, fresnel);
    gl_FragColor = vec4(uColor * (0.75 + edge * 0.55), edge * uIntensity);
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
  const glassMaterialRef = useRef(null);
  const innerMaterialRef = useRef(null);
  const rimMaterialRef = useRef(null);
  const draggingRef = useRef(false);
  const dragMovedRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const invalidate = useThree((state) => state.invalidate);
  const has3DModel = Boolean(model3D);
  const sphereSegments = lowDetail ? 28 : 48;
  const contactSegments = lowDetail ? 28 : 48;
  const rimUniforms = useMemo(
    () => ({
      uColor: { value: new Color("#D8EEFF") },
      uIntensity: { value: 0.38 },
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

    if (glassMaterialRef.current) {
      const targetGlow = 0.045;
      const targetOpacity = 0.16;

      glassMaterialRef.current.emissiveIntensity +=
        (targetGlow - glassMaterialRef.current.emissiveIntensity) * ease;
      glassMaterialRef.current.opacity +=
        (targetOpacity - glassMaterialRef.current.opacity) * ease;
    }

    if (innerMaterialRef.current) {
      const targetInnerGlow = 0.025;
      innerMaterialRef.current.emissiveIntensity +=
        (targetInnerGlow - innerMaterialRef.current.emissiveIntensity) * ease;
    }

    if (rimMaterialRef.current) {
      const targetRim = 0.36;
      const currentRim = rimMaterialRef.current.uniforms.uIntensity.value;
      rimMaterialRef.current.uniforms.uIntensity.value +=
        (targetRim - currentRim) * ease;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <group ref={orbRef}>
        <mesh>
          <sphereGeometry args={[size * 0.82, sphereSegments, sphereSegments]} />
          <meshPhysicalMaterial
            ref={innerMaterialRef}
            color="#010305"
            emissive="#06111A"
            emissiveIntensity={0.025}
            transparent
            opacity={0.74}
            transmission={0.08}
            thickness={size * 0.45}
            roughness={0.12}
            metalness={0.08}
            clearcoat={0.9}
            clearcoatRoughness={0.12}
            side={BackSide}
            envMapIntensity={0.72}
            depthWrite={false}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[size * 0.955, sphereSegments, sphereSegments]} />
          <meshPhysicalMaterial
            color="#07121B"
            transparent
            opacity={0.055}
            transmission={0.9}
            thickness={size * 0.38}
            ior={1.34}
            roughness={0.08}
            metalness={0.01}
            side={BackSide}
            envMapIntensity={1.1}
            depthWrite={false}
          />
        </mesh>

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
          <CustomShaderMaterial
            ref={glassMaterialRef}
            baseMaterial={MeshPhysicalMaterial}
            vertexShader={glassVertexShader}
            fragmentShader={glassFragmentShader}
            cacheKey={glassShaderCacheKey}
            color="#E2F1FC"
            emissive="#071520"
            emissiveIntensity={0.045}
            transparent
            opacity={0.16}
            transmission={0.96}
            thickness={size * 0.62}
            ior={1.46}
            roughness={0.024}
            metalness={0}
            clearcoat={1}
            clearcoatRoughness={0.018}
            attenuationColor="#0A1B29"
            attenuationDistance={4.8}
            envMapIntensity={2.05}
            depthWrite={false}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[size * 1.014, sphereSegments, sphereSegments]} />
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

      <group position={[0, -size * 1.015, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[size * 0.52, contactSegments]} />
          <meshBasicMaterial
            color="#69B9F4"
            transparent
            opacity={0.04}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, 0.012, 0]}>
          <sphereGeometry args={[size * 0.028, 12, 12]} />
          <meshBasicMaterial color="#DDF3FF" toneMapped={false} />
        </mesh>
        <pointLight
          position={[0, 0.1, 0]}
          color="#79C2F8"
          intensity={0.42}
          distance={size * 2.4}
          decay={2}
        />
      </group>

      <Html
        center
        position={[0, -size * 0.46, size * 0.32]}
        distanceFactor={7.2}
        style={{ pointerEvents: "none" }}
      >
        <span
          className="whitespace-nowrap text-[10px] font-medium tracking-wide text-white/90 drop-shadow-[0_1px_5px_rgba(0,0,0,0.95)] transition-all duration-300"
          style={{
            opacity: isDimmed ? 0.24 : isActive ? 1 : 0.82,
            transform: `scale(${isActive ? 1.04 : 1})`,
          }}
        >
          {label}
        </span>
      </Html>
    </group>
  );
};

export default memo(TechOrb);
