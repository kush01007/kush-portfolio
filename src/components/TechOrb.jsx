import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

const TechOrb = ({
  icon: Icon,
  label,
  position = [0, 0, 0],
  radius = 1,
  rotationSpeed = 0.12,
}) => {
  const orbRef = useRef(null);

  useFrame((_, delta) => {
    if (!orbRef.current) return;

    orbRef.current.rotation.y += delta * rotationSpeed;
    orbRef.current.rotation.x += delta * rotationSpeed * 0.28;
  });

  return (
    <group position={position}>
      <mesh ref={orbRef}>
        <sphereGeometry args={[radius, 36, 36]} />
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
          <sphereGeometry args={[radius, 18, 18]} />
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
          <Icon size={48} />
          <span className="mt-1 text-[10px] font-medium tracking-wide text-white/65">
            {label}
          </span>
        </div>
      </Html>
    </group>
  );
};

export default TechOrb;
