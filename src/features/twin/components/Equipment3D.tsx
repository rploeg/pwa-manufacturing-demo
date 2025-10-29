import { useRef, useState } from 'react';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import { TwinNode } from '@/data/types';

interface Equipment3DProps {
  node: TwinNode;
  position: [number, number, number];
  onClick: (node: TwinNode) => void;
}

// Helper to get property value
function getProperty(node: TwinNode, key: string): number | string {
  const prop = node.properties.find((p) => p.key === key);
  const value = prop?.value ?? 0;
  return typeof value === 'boolean' ? (value ? 1 : 0) : value;
}

// Helper to determine status from properties
function getStatus(node: TwinNode): 'normal' | 'warning' | 'critical' {
  const status = getProperty(node, 'status');
  if (status === 'critical') return 'critical';
  if (status === 'warning') return 'warning';
  return 'normal';
}

export function FillerMachine({ node, position, onClick }: Equipment3DProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const status = getStatus(node);

  // Pulse animation for critical status
  useFrame((state) => {
    if (meshRef.current && status === 'critical') {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.05);
    }
  });

  const getColor = () => {
    switch (status) {
      case 'critical':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'normal':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <group position={position}>
      {/* Base platform */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[2, 0.4, 2]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>

      {/* Main body - tall cylinder for filler */}
      <mesh
        ref={meshRef}
        position={[0, 1.5, 0]}
        onClick={() => onClick(node)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[0.6, 0.8, 2.5, 16]} />
        <meshStandardMaterial
          color={getColor()}
          emissive={getColor()}
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </mesh>

      {/* Filling nozzles */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI) / 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.4, 1.2, Math.sin(angle) * 0.4]}>
            <cylinderGeometry args={[0.05, 0.05, 0.6]} />
            <meshStandardMaterial color="#9ca3af" />
          </mesh>
        );
      })}

      {/* Top cap */}
      <mesh position={[0, 2.8, 0]}>
        <cylinderGeometry args={[0.5, 0.6, 0.2]} />
        <meshStandardMaterial color="#374151" />
      </mesh>

      {/* Label */}
      <Text position={[0, 3.2, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        {node.name}
      </Text>

      {/* Status tooltip on hover */}
      {hovered && (
        <Html position={[0, 3.5, 0]} center>
          <div className="bg-black/90 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
            <div className="font-semibold">{node.name}</div>
            <div className="text-xs opacity-80">
              {getProperty(node, 'temperature')}°C | {getProperty(node, 'speed')} units/min
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

export function CapperMachine({ node, position, onClick }: Equipment3DProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const status = getStatus(node);

  useFrame((state) => {
    if (meshRef.current && status === 'critical') {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.05);
    }
  });

  const getColor = () => {
    switch (status) {
      case 'critical':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'normal':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.8, 0.4, 1.8]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>

      {/* Main body - shorter, wider */}
      <mesh
        ref={meshRef}
        position={[0, 1.2, 0]}
        onClick={() => onClick(node)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1.2, 1.6, 1.2]} />
        <meshStandardMaterial
          color={getColor()}
          emissive={getColor()}
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </mesh>

      {/* Capping head */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.4]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>

      {/* Label */}
      <Text position={[0, 2.8, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        {node.name}
      </Text>

      {hovered && (
        <Html position={[0, 3.2, 0]} center>
          <div className="bg-black/90 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
            <div className="font-semibold">{node.name}</div>
            <div className="text-xs opacity-80">
              {getProperty(node, 'temperature')}°C | {getProperty(node, 'pressure')} bar
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

export function LabelerMachine({ node, position, onClick }: Equipment3DProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const status = getStatus(node);

  useFrame((state) => {
    if (meshRef.current && status === 'critical') {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.05);
    }
  });

  const getColor = () => {
    switch (status) {
      case 'critical':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'normal':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[2.5, 0.4, 1.5]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>

      {/* Main body - horizontal elongated */}
      <mesh
        ref={meshRef}
        position={[0, 1.0, 0]}
        onClick={() => onClick(node)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[2.2, 1.2, 1.0]} />
        <meshStandardMaterial
          color={getColor()}
          emissive={getColor()}
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </mesh>

      {/* Label roll */}
      <mesh position={[-0.8, 1.0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.6]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>

      {/* Application roller */}
      <mesh position={[0.3, 0.7, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>

      {/* Label */}
      <Text position={[0, 2.0, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        {node.name}
      </Text>

      {hovered && (
        <Html position={[0, 2.4, 0]} center>
          <div className="bg-black/90 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
            <div className="font-semibold">{node.name}</div>
            <div className="text-xs opacity-80">
              {getProperty(node, 'temperature')}°C | {getProperty(node, 'speed')} units/min
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

export function PackerMachine({ node, position, onClick }: Equipment3DProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const status = getStatus(node);

  useFrame((state) => {
    if (meshRef.current && status === 'critical') {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.05);
    }
  });

  const getColor = () => {
    switch (status) {
      case 'critical':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'normal':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[2.0, 0.4, 2.0]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>

      {/* Main body */}
      <mesh
        ref={meshRef}
        position={[0, 1.3, 0]}
        onClick={() => onClick(node)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1.6, 1.8, 1.6]} />
        <meshStandardMaterial
          color={getColor()}
          emissive={getColor()}
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </mesh>

      {/* Conveyor extension */}
      <mesh position={[1.5, 0.6, 0]}>
        <boxGeometry args={[1.0, 0.3, 1.0]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>

      {/* Label */}
      <Text position={[0, 2.6, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        {node.name}
      </Text>

      {hovered && (
        <Html position={[0, 3.0, 0]} center>
          <div className="bg-black/90 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
            <div className="font-semibold">{node.name}</div>
            <div className="text-xs opacity-80">{getProperty(node, 'speed')} units/min</div>
          </div>
        </Html>
      )}
    </group>
  );
}
