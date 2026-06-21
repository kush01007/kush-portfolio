import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

const TechOrb = ({
  icon: Icon,
  label,
  position = [0, 0, 0],
  size = 1,
  rotationSpeed = 0.12,
  orbitRadius = 2.25,
  orbitAngle = 0,
  revolutionSpeed = 0.09,
  floatAmplitude = 0.07,
  orbitTilt = 0,
}) => {
  const groupRef = useRef(null);
  const orbRef = useRef(null);

  useFrame((state, delta) => {
    if (!groupRef.current || !orbRef.current) return;

    const elapsed = state.clock.elapsedTime;
    const angle = orbitAngle + elapsed * revolutionSpeed;
    const orbitDepth = Math.sin(angle) * orbitRadius;

    groupRef.current.position.x =
      position[0] + Math.cos(angle) * orbitRadius;
    groupRef.current.position.z =
      position[2] + orbitDepth * Math.cos(orbitTilt);
    groupRef.current.position.y =
      position[1] +
      orbitDepth * Math.sin(orbitTilt) +
      Math.sin(elapsed * 0.42 + orbitAngle) * floatAmplitude;

    orbRef.current.rotation.y += delta * rotationSpeed;
    orbRef.current.rotation.x += delta * rotationSpeed * 0.28;
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={orbRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshPhysicalMaterial
          color="#0B1118"
          emissive="#10283D"
          emissiveIntensity={0.3}
          transparent
          opacity={0.76}
          transmission={0.66}
          thickness={1.45}
          ior={1.42}
          roughness={0.12}
          metalness={0.08}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />

        <mesh scale={0.985}>
          <sphereGeometry args={[size, 16, 16]} />
          <meshBasicMaterial
            color="#9DB7D5"
            wireframe
            transparent
            opacity={0.045}
            depthWrite={false}
          />
        </mesh>
      </mesh>

      <Html center distanceFactor={7.5} style={{ pointerEvents: "none" }}>
        <div className="flex flex-col items-center text-[#BFDDF8] drop-shadow-[0_0_12px_rgba(157,183,213,0.7)]">
          <Icon size={Math.max(23, Math.round(size * 48))} />
          <span className="mt-1 whitespace-nowrap text-[9px] font-medium tracking-wide text-white/65">
            {label}
          </span>
        </div>
      </Html>
    </group>
  );
};

export default TechOrb;
