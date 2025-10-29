import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { TwinNode } from '@/data/types';
import { Mesh, Vector3 } from 'three';
import * as THREE from 'three';
import { FillerMachine, CapperMachine, LabelerMachine, PackerMachine } from './Equipment3D';

interface MaterialFlowProps {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  delay?: number;
}

function MaterialFlow({ start, end, color, delay = 0 }: MaterialFlowProps) {
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
  );
}

interface TwinVisualization3DProps {
  nodes: TwinNode[];
  onNodeClick: (node: TwinNode) => void;
}

export function TwinVisualization3D({ nodes, onNodeClick }: TwinVisualization3DProps) {
  const controlsRef = useRef(null);

  // Organize equipment by type and position
  const equipmentLayout = useMemo(() => {
    const layout: { [key: string]: { position: [number, number, number]; node: TwinNode } } = {};

    nodes.forEach((node) => {
      if (node.type === 'machine') {
        const name = node.name.toLowerCase();

        if (name.includes('filler')) {
          const index = name.includes('1') ? 0 : name.includes('2') ? 1 : 2;
          layout[node.id] = {
            position: [-6 + index * 6, 0, -4],
            node,
          };
        } else if (name.includes('capper')) {
          const index = name.includes('1') ? 0 : name.includes('2') ? 1 : 2;
          layout[node.id] = {
            position: [-6 + index * 6, 0, 0],
            node,
          };
        } else if (name.includes('labeler')) {
          const index = name.includes('1') ? 0 : name.includes('2') ? 1 : 2;
          layout[node.id] = {
            position: [-6 + index * 6, 0, 4],
            node,
          };
        } else if (name.includes('packer')) {
          const index = name.includes('1') ? 0 : 1;
          layout[node.id] = {
            position: [-3 + index * 6, 0, 8],
            node,
          };
        }
      }
    });

    return layout;
  }, [nodes]);

  // Define material flow paths through the production line
  const flowPaths = useMemo(() => {
    return [
      // Path from Filler-1 to Capper-1
      {
        start: [-6, 0.5, -4] as [number, number, number],
        end: [-6, 0.5, 0] as [number, number, number],
        color: '#3b82f6',
      },
      // Path from Filler-2 to Capper-2
      {
        start: [0, 0.5, -4] as [number, number, number],
        end: [0, 0.5, 0] as [number, number, number],
        color: '#8b5cf6',
      },
      // Path from Filler-3 to Capper-3
      {
        start: [6, 0.5, -4] as [number, number, number],
        end: [6, 0.5, 0] as [number, number, number],
        color: '#ec4899',
      },
      // Path from Capper-1 to Labeler-1
      {
        start: [-6, 0.5, 0] as [number, number, number],
        end: [-6, 0.5, 4] as [number, number, number],
        color: '#3b82f6',
      },
      // Path from Capper-2 to Labeler-2
      {
        start: [0, 0.5, 0] as [number, number, number],
        end: [0, 0.5, 4] as [number, number, number],
        color: '#8b5cf6',
      },
      // Path from Capper-3 to Labeler-3
      {
        start: [6, 0.5, 0] as [number, number, number],
        end: [6, 0.5, 4] as [number, number, number],
        color: '#ec4899',
      },
      // Path from Labeler-1 to Packer-1
      {
        start: [-6, 0.5, 4] as [number, number, number],
        end: [-3, 0.5, 8] as [number, number, number],
        color: '#3b82f6',
      },
      // Path from Labeler-2 to Packer-1
      {
        start: [0, 0.5, 4] as [number, number, number],
        end: [-3, 0.5, 8] as [number, number, number],
        color: '#8b5cf6',
      },
      // Path from Labeler-3 to Packer-2
      {
        start: [6, 0.5, 4] as [number, number, number],
        end: [3, 0.5, 8] as [number, number, number],
        color: '#ec4899',
      },
    ];
  }, []);

  const renderEquipment = (
    id: string,
    layout: { position: [number, number, number]; node: TwinNode }
  ) => {
    const { position, node } = layout;
    const name = node.name.toLowerCase();

    if (name.includes('filler')) {
      return <FillerMachine key={id} node={node} position={position} onClick={onNodeClick} />;
    } else if (name.includes('capper')) {
      return <CapperMachine key={id} node={node} position={position} onClick={onNodeClick} />;
    } else if (name.includes('labeler')) {
      return <LabelerMachine key={id} node={node} position={position} onClick={onNodeClick} />;
    } else if (name.includes('packer')) {
      return <PackerMachine key={id} node={node} position={position} onClick={onNodeClick} />;
    }
    return null;
  };

  return (
    <div className="w-full h-[600px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl overflow-hidden border border-slate-700">
      <Canvas>
        <PerspectiveCamera makeDefault position={[15, 12, 15]} fov={60} />
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={40}
          maxPolarAngle={Math.PI / 2.1}
          target={[0, 0, 2]}
        />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 10]} intensity={1} />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#4f46e5" />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#06b6d4" />

        {/* Background color */}
        <color attach="background" args={['#0f172a']} />

        {/* Simple grid using lines */}
        <gridHelper args={[40, 20, '#475569', '#334155']} position={[0, 0, 0]} />

        {/* Floor plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#1e293b" opacity={0.8} transparent />
        </mesh>

        {/* Render all equipment */}
        {Object.entries(equipmentLayout).map(([id, layout]) => renderEquipment(id, layout))}

        {/* Material flow animations */}
        {flowPaths.map((path, index) => (
          <MaterialFlow
            key={index}
            start={path.start}
            end={path.end}
            color={path.color}
            delay={index * 0.5}
          />
        ))}

        {/* Production line markers */}
        <group>
          {/* Input zone marker */}
          <mesh position={[0, 0.01, -6]}>
            <planeGeometry args={[14, 2]} />
            <meshStandardMaterial
              color="#3b82f6"
              opacity={0.2}
              transparent
              emissive="#3b82f6"
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* Output zone marker */}
          <mesh position={[0, 0.01, 10]}>
            <planeGeometry args={[10, 2]} />
            <meshStandardMaterial
              color="#10b981"
              opacity={0.2}
              transparent
              emissive="#10b981"
              emissiveIntensity={0.2}
            />
          </mesh>
        </group>
      </Canvas>
    </div>
  );
}
