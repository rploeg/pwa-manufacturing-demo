import { ReactNode } from 'react';
import { Card } from './card';
import { Button } from './button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <Card className={`p-12 text-center ${className}`}>
      {icon && <div className="flex justify-center mb-4 opacity-50">{icon}</div>}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">{description}</p>}
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </Card>
  );
}

// Pre-built empty states
export function NoDataEmpty({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <EmptyState
      title="No data available"
      description="There's no data to display at the moment. Try refreshing or check back later."
      action={onRefresh ? { label: 'Refresh', onClick: onRefresh } : undefined}
    />
  );
}

export function NoResultsEmpty({ query, onClear }: { query?: string; onClear?: () => void }) {
  return (
    <EmptyState
      title="No results found"
      description={query ? `No results found for "${query}". Try adjusting your search.` : 'No results found. Try adjusting your filters.'}
      action={onClear ? { label: 'Clear filters', onClick: onClear } : undefined}
    />
  );
}

export function NoItemsEmpty({ title, description, onCreate }: { title: string; description: string; onCreate?: () => void }) {
  return (
    <EmptyState
      title={title}
      description={description}
      action={onCreate ? { label: 'Create new', onClick: onCreate } : undefined}
    />
  );
}
