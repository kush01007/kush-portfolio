import { memo, useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import {
  CanvasTexture,
  LinearFilter,
  SRGBColorSpace,
  Vector3,
} from "three";
import TechIcon3D from "./TechIcon3D";

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
  const overlayRef = useRef(null);
  const draggingRef = useRef(false);
  const dragMovedRef = useRef(false);
  const spinVelocityRef = useRef({ x: 0, y: 0 });
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const orbWorldPositionRef = useRef(new Vector3());
  const orbWorldScaleRef = useRef(new Vector3());
  const overlayWorldPositionRef = useRef(new Vector3());
  const overlayLocalPositionRef = useRef(new Vector3());
  const invalidate = useThree((state) => state.invalidate);
  const has3DModel = Boolean(model3D);
  const labelTexture = useMemo(() => {
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const context = canvas.getContext("2d");
    let fontSize = 50;

    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = `600 ${fontSize}px Arial, sans-serif`;

    while (context.measureText(label).width > 450 && fontSize > 30) {
      fontSize -= 2;
      context.font = `600 ${fontSize}px Arial, sans-serif`;
    }

    context.shadowColor = "rgba(0, 0, 0, 0.95)";
    context.shadowBlur = 12;
    context.fillStyle = "#FFFFFF";
    context.fillText(label, canvas.width / 2, canvas.height / 2);

    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.premultiplyAlpha = true;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }, [label]);

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

  useEffect(() => () => labelTexture?.dispose(), [labelTexture]);

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

    if (overlayRef.current) {
      groupRef.current.updateWorldMatrix(true, false);
      groupRef.current.getWorldPosition(orbWorldPositionRef.current);
      groupRef.current.getWorldScale(orbWorldScaleRef.current);

      overlayWorldPositionRef.current
        .copy(state.camera.position)
        .sub(orbWorldPositionRef.current)
        .normalize()
        .multiplyScalar(size * orbWorldScaleRef.current.x * 1.2)
        .add(orbWorldPositionRef.current);

      overlayLocalPositionRef.current.copy(overlayWorldPositionRef.current);
      groupRef.current.worldToLocal(overlayLocalPositionRef.current);
      overlayRef.current.position.copy(overlayLocalPositionRef.current);
    }

    if (motionEnabled && !draggingRef.current) {
      const automaticSpinMultiplier = 2.4;
      orbRef.current.rotation.y +=
        motionDelta * rotationSpeed * automaticSpinMultiplier;
      orbRef.current.rotation.x +=
        motionDelta * rotationSpeed * 0.28 * automaticSpinMultiplier;

      orbRef.current.rotation.x += spinVelocityRef.current.x;
      orbRef.current.rotation.y += spinVelocityRef.current.y;
      const inertiaDamping = Math.exp(-motionDelta * 3.2);
      spinVelocityRef.current.x *= inertiaDamping;
      spinVelocityRef.current.y *= inertiaDamping;
    }

    const ease = 1 - Math.exp(-motionDelta * 7);
    const targetScale = 1;
    const nextScale = groupRef.current.scale.x +
      (targetScale - groupRef.current.scale.x) * ease;
    groupRef.current.scale.setScalar(nextScale);

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
            spinVelocityRef.current = { x: 0, y: 0 };
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
            spinVelocityRef.current.x = Math.max(
              -0.035,
              Math.min(0.035, deltaY * 0.0018),
            );
            spinVelocityRef.current.y = Math.max(
              -0.035,
              Math.min(0.035, deltaX * 0.0018),
            );
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
          <icosahedronGeometry args={[size, lowDetail ? 1 : 2]} />
          <meshPhysicalMaterial
            color="#000000"
            roughness={0.1}
            flatShading
            metalness={0.08}
            clearcoat={1}
            clearcoatRoughness={0.04}
            envMapIntensity={1.4}
            specularIntensity={1}
            specularColor="#FFFFFF"
            depthWrite
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
          intensity={0.68}
          distance={size * 1.4}
          decay={2}
        />
      </group>

      {has3DModel && (
        <Billboard ref={overlayRef} follow position={[0, 0, 0]}>
          <group>
            <group position={[0, size * 0.12, 0]}>
              <TechIcon3D
                model={model3D}
                src={modelPath}
                color={modelColor}
                size={size}
                lowDetail={lowDetail}
                isActive={isActive}
                isDimmed={isDimmed}
              />
            </group>

            {labelTexture && (
              <mesh position={[0, -size * 0.42, 0.006]} renderOrder={11}>
                <planeGeometry args={[size * 1.22, size * 0.305]} />
                <meshBasicMaterial
                  map={labelTexture}
                  transparent
                  opacity={isDimmed ? 0.24 : 1}
                  alphaTest={0.04}
                  premultipliedAlpha
                  depthTest
                  depthWrite={false}
                  toneMapped={false}
                />
              </mesh>
            )}
          </group>
        </Billboard>
      )}
    </group>
  );
};

export default memo(TechOrb);
