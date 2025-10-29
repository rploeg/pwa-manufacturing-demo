import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import * as THREE from 'three';

interface MaterialFlowProps {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  delay?: number;
}

export function MaterialFlow({ start, end, color, delay = 0 }: MaterialFlowProps) {
  const particleRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (particleRef.current) {
      // Calculate progress along the path with delay
      const progress = ((state.clock.elapsedTime - delay) % 3) / 3;

      if (progress >= 0) {
        // Interpolate position between start and end
        const startVec = new Vector3(...start);
        const endVec = new Vector3(...end);
        const position = startVec.lerp(endVec, progress);

        particleRef.current.position.copy(position);

        // Fade in/out at start and end
        const opacity = progress < 0.1 ? progress * 10 : progress > 0.9 ? (1 - progress) * 10 : 1;
        const material = particleRef.current.material as THREE.MeshStandardMaterial;
        if (material && 'opacity' in material) {
          material.opacity = opacity;
        }
      } else {
        // Hide particle before delay
        const material = particleRef.current.material as THREE.MeshStandardMaterial;
        if (material && 'opacity' in material) {
          material.opacity = 0;
        }
      }
    }
  });

  return (
    <>
      {/* Moving particle (bottle/product) */}
      <mesh ref={particleRef}>
        <cylinderGeometry args={[0.1, 0.1, 0.3]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={1}
        />
      </mesh>
    </>
  );
}
