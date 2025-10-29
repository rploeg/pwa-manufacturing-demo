import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export function TwinVisualization3DTest() {
  return (
    <div className="w-full h-[600px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl overflow-hidden border border-slate-700">
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        {/* Simple test cube */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="orange" />
        </mesh>

        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </Canvas>
    </div>
  );
}
