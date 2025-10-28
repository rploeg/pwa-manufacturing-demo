import {
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  Users,
  Wrench,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ScenarioTemplate } from '@/data/types';

const iconMap = {
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Wrench,
  Users,
  Activity,
};

const categoryColors = {
  analysis: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  downtime: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  quality: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  maintenance: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  safety: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

interface ScenarioCardProps {
  template: ScenarioTemplate;
  onStart: (templateId: string) => void;
}

export function ScenarioCard({ template, onStart }: ScenarioCardProps) {
  const Icon = iconMap[template.icon as keyof typeof iconMap] || Activity;
  const colorClass = categoryColors[template.category];

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />~{template.estimatedDuration} min
              </span>
              <span className="capitalize">{template.category}</span>
              <span>{template.steps.length} steps</span>
            </div>
            <Button onClick={() => onStart(template.id)} size="sm" className="gap-1">
              Start
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
