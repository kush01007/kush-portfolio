import { memo, useEffect, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { ExtrudeGeometry } from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

const reactRingRotations = [0, Math.PI / 3, -Math.PI / 3];

const ReactIcon3D = ({
  size,
  lowDetail = false,
  isActive = false,
  isDimmed = false,
}) => {
  const emissiveIntensity = isActive ? 1.1 : isDimmed ? 0.28 : 0.72;
  const color = isDimmed ? "#537286" : "#8EDBFF";

  return (
    <group
      scale={size * 0.94}
      renderOrder={3}
    >
      {reactRingRotations.map((rotation) => (
        <mesh
          key={rotation}
          rotation={[0, 0, rotation]}
          scale={[1, 0.42, 1]}
          renderOrder={10}
        >
          <torusGeometry
            args={[0.44, 0.034, lowDetail ? 8 : 12, lowDetail ? 36 : 64]}
          />
          <meshPhysicalMaterial
            color={color}
            emissive="#2E9ED9"
            emissiveIntensity={emissiveIntensity * 0.56}
            roughness={0.26}
            metalness={0.06}
            clearcoat={0.72}
            clearcoatRoughness={0.14}
            envMapIntensity={0.85}
            transparent
            opacity={isDimmed ? 0.42 : 1}
            depthTest={false}
            depthWrite={false}
          />
        </mesh>
      ))}

      <mesh renderOrder={10}>
        <sphereGeometry args={[0.092, lowDetail ? 16 : 24, lowDetail ? 16 : 24]} />
        <meshPhysicalMaterial
          color="#C8EEFF"
          emissive="#4AB7ED"
          emissiveIntensity={emissiveIntensity * 0.62}
          roughness={0.24}
          metalness={0.04}
          clearcoat={0.7}
          envMapIntensity={0.9}
          transparent
          opacity={isDimmed ? 0.42 : 1}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

const ExtrudedSvgIcon = ({
  src,
  color,
  size,
  lowDetail = false,
  isActive = false,
  isDimmed = false,
}) => {
  const svg = useLoader(SVGLoader, src);
  const geometry = useMemo(() => {
    const pieces = svg.paths.flatMap((path) =>
      SVGLoader.createShapes(path).map(
        (shape) =>
          new ExtrudeGeometry(shape, {
            depth: 0.34,
            bevelEnabled: true,
            bevelThickness: 0.065,
            bevelSize: 0.055,
            bevelSegments: 1,
            curveSegments: lowDetail ? 3 : 6,
          }),
      ),
    );
    const merged = mergeGeometries(pieces, false);

    pieces.forEach((piece) => piece.dispose());
    merged.scale(1, -1, 1);
    merged.computeBoundingBox();

    const bounds = merged.boundingBox;
    const width = bounds.max.x - bounds.min.x;
    const height = bounds.max.y - bounds.min.y;
    const normalization = 1 / Math.max(width, height);

    merged.scale(normalization, normalization, normalization);
    merged.center();
    merged.computeVertexNormals();

    return merged;
  }, [lowDetail, svg]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const emissiveIntensity = isActive ? 0.72 : isDimmed ? 0.12 : 0.4;

  return (
    <group scale={size * 0.86} renderOrder={3}>
      <mesh geometry={geometry} renderOrder={10}>
        <meshPhysicalMaterial
          color={isDimmed ? "#526171" : color}
          emissive={color}
          emissiveIntensity={emissiveIntensity * 0.48}
          roughness={0.28}
          metalness={0.06}
          clearcoat={0.72}
          clearcoatRoughness={0.14}
          envMapIntensity={0.9}
          transparent
          opacity={isDimmed ? 0.42 : 1}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

const TechIcon3D = ({ model, src, color, ...props }) => {
  if (model === "react") return <ReactIcon3D {...props} />;
  return <ExtrudedSvgIcon src={src} color={color} {...props} />;
};

export default memo(TechIcon3D);
