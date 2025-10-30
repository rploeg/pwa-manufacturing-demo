import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Sparkles, Clock } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SearchResult {
  title: string;
  description: string;
  path: string;
  category: string;
  icon?: React.ReactNode;
}

// All searchable pages and scenarios
const searchableContent: SearchResult[] = [
  // Core
  { title: 'Home Dashboard', description: 'Overview of factory operations', path: '/home', category: 'Core' },
  { title: 'AI Agents', description: 'Multi-agent chat interface', path: '/chat', category: 'Core' },
  { title: 'AI Manufacturing Scenarios', description: 'Explore AI-powered manufacturing solutions', path: '/ai-scenarios', category: 'Core', icon: <Sparkles className="w-4 h-4" /> },
  
  // Operations
  { title: 'Digital Twin', description: '3D factory visualization and monitoring', path: '/twin', category: 'Operations' },
  { title: 'Work Instructions', description: 'Interactive standard operating procedures', path: '/work-instructions', category: 'Operations' },
  { title: 'Shift Handover', description: 'Digital shift transition management', path: '/shift-handover', category: 'Operations' },
  { title: 'Safety & Compliance', description: 'Track incidents and monitor compliance', path: '/safety', category: 'Operations' },
  
  // Production
  { title: 'Production Planning', description: 'Optimize schedules and capacity', path: '/planning', category: 'Production' },
  { title: 'Changeover Optimization', description: 'SMED analysis with AI recommendations', path: '/changeover', category: 'Production' },
  { title: 'Quality Management', description: 'Real-time quality monitoring', path: '/quality', category: 'Production' },
  { title: 'Traceability', description: 'End-to-end product tracking', path: '/traceability', category: 'Production' },
  { title: 'Yield Prediction', description: 'AI-powered yield forecasting', path: '/yield-prediction', category: 'Production' },
  
  // Maintenance
  { title: 'Maintenance Management', description: 'Schedule and track maintenance', path: '/maintenance', category: 'Maintenance' },
  { title: 'Predictive Maintenance', description: 'AI-powered failure prediction', path: '/predictive', category: 'Maintenance' },
  { title: 'Maintenance Cost Optimization', description: 'Optimize spare parts and costs', path: '/maintenance-cost', category: 'Maintenance' },
  { title: 'Root Cause Analysis', description: 'AI-assisted problem solving', path: '/rca', category: 'Maintenance' },
  { title: 'Tool Management', description: 'Track and manage production tools', path: '/tools', category: 'Maintenance' },
  
  // Performance
  { title: 'Performance Dashboard', description: 'Real-time OEE and KPIs', path: '/performance', category: 'Performance' },
  { title: 'OEE Coaching', description: 'Benchmark and improve OEE', path: '/oee-coaching', category: 'Performance' },
  { title: 'Line Balancing', description: 'Optimize workstation distribution', path: '/line-balancing', category: 'Performance' },
  { title: 'Energy Management', description: 'Monitor and optimize energy usage', path: '/energy', category: 'Performance' },
  { title: 'AI Optimization', description: 'Multi-objective manufacturing optimization', path: '/optimization', category: 'Performance' },
  
  // People
  { title: 'Skills Matrix', description: 'Track employee certifications', path: '/skills', category: 'People' },
  
  // AI & Insights
  { title: 'Knowledge Base', description: 'AI-powered document search', path: '/knowledge', category: 'AI & Insights' },
  
  // System
  { title: 'Edge Devices', description: 'Monitor connected devices', path: '/edge-devices', category: 'System' },
  { title: 'Settings', description: 'App configuration and preferences', path: '/settings', category: 'System' },
];

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }
    
    const lowercaseQuery = query.toLowerCase();
    const filtered = searchableContent.filter(
      (item) =>
        item.title.toLowerCase().includes(lowercaseQuery) ||
        item.description.toLowerCase().includes(lowercaseQuery) ||
        item.category.toLowerCase().includes(lowercaseQuery)
    );
    
    setResults(filtered);
    setSelectedIndex(0);
  }, [query]);
  
  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && results.length > 0) {
      handleSelect(results[selectedIndex].path);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in"
        onClick={onClose}
      />
      
      {/* Search Modal */}
      <div className="fixed inset-x-4 top-20 z-50 max-w-2xl mx-auto animate-in slide-in-from-top-4">
        <div className="glass glass-hover rounded-xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for pages, features, scenarios..."
              className="flex-1 bg-transparent outline-none text-lg placeholder:text-muted-foreground"
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono bg-muted rounded">
              ESC
            </kbd>
          </div>
          
          {/* Results */}
          {query && (
            <div className="max-h-[60vh] overflow-y-auto">
              {results.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No results found for "{query}"</p>
                  <p className="text-sm mt-1">Try searching for features, pages, or keywords</p>
                </div>
              ) : (
                <div className="p-2">
                  {results.map((result, index) => (
                    <button
                      key={result.path}
                      onClick={() => handleSelect(result.path)}
                      className={cn(
                        'w-full flex items-center gap-4 p-3 rounded-lg transition-all group',
                        index === selectedIndex
                          ? 'bg-primary/10 border-l-2 border-primary'
                          : 'hover:bg-muted/50'
                      )}
                    >
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          {result.icon}
                          <span className="font-semibold">{result.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {result.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {result.description}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Footer hint */}
          {!query && (
            <div className="p-4 border-t bg-muted/30">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Tip: Press</span>
                <kbd className="px-2 py-1 text-xs font-mono bg-background rounded border">Ctrl+K</kbd>
                <span>to search anytime</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
