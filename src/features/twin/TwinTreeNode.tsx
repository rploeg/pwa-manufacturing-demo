import { ChevronRight, ChevronDown, Factory, Cpu, Activity } from 'lucide-react';
import type { TwinNode } from '@/data/types';

interface TwinTreeNodeProps {
  node: TwinNode;
  level: number;
  selectedId: string | null;
  expandedIds: Set<string>;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
}

export function TwinTreeNode({
  node,
  level,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
}: TwinTreeNodeProps) {
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const hasChildren = node.children && node.children.length > 0;

  const getIcon = () => {
    switch (node.type) {
      case 'site':
        return <Factory className="w-4 h-4" />;
      case 'line':
        return <Cpu className="w-4 h-4" />;
      case 'machine':
      case 'sensor':
        return <Activity className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div>
      <button
        onClick={() => onSelect(node.id)}
        className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-muted rounded-md transition-colors ${
          isSelected ? 'bg-primary/10 text-primary font-semibold' : ''
        }`}
        style={{ paddingLeft: `${level * 1 + 0.75}rem` }}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
            className="p-0.5 hover:bg-muted-foreground/20 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}
        {!hasChildren && <span className="w-5" />}
        {getIcon()}
        <span className="flex-1 text-sm">{node.name}</span>
        <span className="text-xs text-muted-foreground capitalize">{node.type}</span>
      </button>

      {isExpanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <TwinTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
