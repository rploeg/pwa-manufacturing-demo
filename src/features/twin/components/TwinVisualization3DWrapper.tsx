import { Suspense, lazy } from 'react';
import { TwinNode } from '@/data/types';
import { Loader2 } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const TwinVisualization3D = lazy(() =>
  import('./TwinVisualization3D').then((module) => ({ default: module.TwinVisualization3D }))
);

interface TwinVisualization3DWrapperProps {
  nodes: TwinNode[];
  onNodeClick: (node: TwinNode) => void;
}

export function TwinVisualization3DWrapper({
  nodes,
  onNodeClick,
}: TwinVisualization3DWrapperProps) {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="w-full h-[600px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-white text-sm">Loading 3D Visualization...</p>
            </div>
          </div>
        }
      >
        <TwinVisualization3D nodes={nodes} onNodeClick={onNodeClick} />
      </Suspense>
    </ErrorBoundary>
  );
}
