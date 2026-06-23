import { memo, useEffect, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { ExtrudeGeometry } from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

const ExtrudedSvgIcon = ({
  src,
  color,
  size,
  lowDetail = false,
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

  const emissiveIntensity = isDimmed ? 0.12 : 0.72;

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
          opacity={isDimmed ? 0.47 : 1}
          depthTest
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};

const TechIcon3D = ({ src, color, ...props }) => {
  return <ExtrudedSvgIcon src={src} color={color} {...props} />;
};

export default memo(TechIcon3D);
