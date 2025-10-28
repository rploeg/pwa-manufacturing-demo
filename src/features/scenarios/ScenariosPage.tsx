import { useState } from 'react';
import { Filter, History, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { scenarioTemplates } from './scenarioTemplates';
import { ScenarioCard } from './ScenarioCard';
import { ScenarioRunner } from './ScenarioRunner';
import type { ScenarioTemplate } from '@/data/types';

export function ScenariosPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<ScenarioTemplate | null>(
    null
  );
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredTemplates =
    filterCategory === 'all'
      ? scenarioTemplates
      : scenarioTemplates.filter((t) => t.category === filterCategory);

  const categories = [
    { value: 'all', label: 'All Scenarios' },
    { value: 'analysis', label: 'Analysis' },
    { value: 'downtime', label: 'Downtime' },
    { value: 'quality', label: 'Quality' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'safety', label: 'Safety' },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Guided Scenarios</h1>
        <p className="text-muted-foreground">
          Pre-configured workflows powered by multi-agent AI to solve common
          manufacturing challenges
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={filterCategory === cat.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterCategory(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Scenario Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {filteredTemplates.map((template) => (
          <ScenarioCard
            key={template.id}
            template={template}
            onStart={(id) => {
              const template = scenarioTemplates.find((t) => t.id === id);
              if (template) setSelectedTemplate(template);
            }}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Play className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No scenarios found for this category.</p>
        </div>
      )}

      {/* Recent Runs Section */}
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5" />
          <h2 className="text-xl font-bold">Recent Scenario Runs</h2>
        </div>
        <div className="border rounded-lg p-8 text-center text-muted-foreground">
          <p>No scenario runs yet. Start a scenario above to see your history here.</p>
        </div>
      </div>

      {/* Scenario Runner Modal */}
      {selectedTemplate && (
        <ScenarioRunner
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
        />
      )}
    </div>
  );
}
