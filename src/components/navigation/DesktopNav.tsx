import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  MessageSquare,
  Network,
  ClipboardCheck,
  Wrench,
  Brain,
  BookOpen,
  Settings,
  RefreshCw,
  Shield,
  Trophy,
  Calendar,
  Award,
  FileText,
  Hammer,
  Server,
  Clock,
  AlertCircle,
  Zap,
  Package,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Clipboard,
  Box,
  Cog,
  TrendingUp,
  Users,
  Cpu,
  DollarSign,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useFeatureFlags } from '@/contexts/FeatureFlagsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import type { FeatureFlags } from '@/contexts/FeatureFlagsContext';

interface NavItem {
  path: string;
  icon: typeof Home;
  labelKey: string;
  featureFlag?: keyof FeatureFlags;
}

interface NavGroup {
  id: string;
  labelKey: string;
  icon: typeof Home;
  items: NavItem[];
}

// Root-level navigation items (always visible, no grouping)
const rootNavItems: NavItem[] = [
  { path: '/home', icon: Home, labelKey: 'nav.home' },
  { path: '/chat', icon: MessageSquare, labelKey: 'nav.agents', featureFlag: 'multiAgent' },
];

// Grouped navigation following manufacturing value chain
const navGroups: NavGroup[] = [
  {
    id: 'operations',
    labelKey: 'nav.group.operations',
    icon: Clipboard,
    items: [
      { path: '/twin', icon: Network, labelKey: 'nav.digitalTwin', featureFlag: 'digitalTwin3D' },
      {
        path: '/work-instructions',
        icon: FileText,
        labelKey: 'nav.workInstructions',
        featureFlag: 'workInstructions',
      },
      {
        path: '/shift-handover',
        icon: Clock,
        labelKey: 'nav.shiftHandover',
        featureFlag: 'shiftHandover',
      },
      { path: '/safety', icon: Shield, labelKey: 'nav.safety', featureFlag: 'safetyAnalytics' },
    ],
  },
  {
    id: 'production',
    labelKey: 'nav.group.production',
    icon: Box,
    items: [
      {
        path: '/planning',
        icon: Calendar,
        labelKey: 'nav.planning',
        featureFlag: 'productionPlanning',
      },
      {
        path: '/changeover',
        icon: RefreshCw,
        labelKey: 'nav.changeover',
        featureFlag: 'smedChangeover',
      },
      {
        path: '/quality',
        icon: ClipboardCheck,
        labelKey: 'nav.quality',
        featureFlag: 'qualityInsights',
      },
      {
        path: '/traceability',
        icon: Package,
        labelKey: 'nav.traceability',
        featureFlag: 'traceability',
      },
      {
        path: '/yield-prediction',
        icon: TrendingUp,
        labelKey: 'nav.yieldPrediction',
        featureFlag: 'yieldPrediction',
      },
    ],
  },
  {
    id: 'maintenance',
    labelKey: 'nav.group.maintenance',
    icon: Wrench,
    items: [
      {
        path: '/maintenance',
        icon: Wrench,
        labelKey: 'nav.maintenance',
        featureFlag: 'predictiveMaintenance',
      },
      {
        path: '/predictive',
        icon: Brain,
        labelKey: 'nav.predictive',
        featureFlag: 'predictiveMaintenance',
      },
      {
        path: '/maintenance-cost',
        icon: DollarSign,
        labelKey: 'nav.maintenanceCost',
        featureFlag: 'maintenanceCostOptimization',
      },
      {
        path: '/rca',
        icon: AlertCircle,
        labelKey: 'nav.rootCause',
        featureFlag: 'rootCauseAnalysis',
      },
      { path: '/tools', icon: Hammer, labelKey: 'nav.tools', featureFlag: 'toolManagement' },
    ],
  },
  {
    id: 'performance',
    labelKey: 'nav.group.performance',
    icon: TrendingUp,
    items: [
      {
        path: '/performance',
        icon: Trophy,
        labelKey: 'nav.performance',
        featureFlag: 'performanceDashboard',
      },
      {
        path: '/oee-coaching',
        icon: Trophy,
        labelKey: 'nav.oeeCoaching',
        featureFlag: 'oeeCoaching',
      },
      {
        path: '/line-balancing',
        icon: Users,
        labelKey: 'nav.lineBalancing',
        featureFlag: 'lineBalancing',
      },
      { path: '/energy', icon: Zap, labelKey: 'nav.energy', featureFlag: 'energyManagement' },
      {
        path: '/optimization',
        icon: Sparkles,
        labelKey: 'nav.optimization',
        featureFlag: 'aiAssistant',
      },
    ],
  },
  {
    id: 'people',
    labelKey: 'nav.group.people',
    icon: Users,
    items: [
      { path: '/skills', icon: Award, labelKey: 'nav.skillsMatrix', featureFlag: 'skillsMatrix' },
    ],
  },
  {
    id: 'ai',
    labelKey: 'nav.group.ai',
    icon: Cpu,
    items: [
      { path: '/knowledge', icon: BookOpen, labelKey: 'nav.knowledge', featureFlag: 'aiAssistant' },
      {
        path: '/ai-scenarios',
        icon: Sparkles,
        labelKey: 'nav.aiScenarios',
        featureFlag: 'aiAssistant',
      },
    ],
  },
  {
    id: 'system',
    labelKey: 'nav.group.system',
    icon: Cog,
    items: [
      {
        path: '/edge-devices',
        icon: Server,
        labelKey: 'nav.edgeDevices',
        featureFlag: 'edgeDevices',
      },
      { path: '/settings', icon: Settings, labelKey: 'nav.settings' },
    ],
  },
];

export function DesktopNav() {
  const { isFeatureEnabled, currentRole } = useFeatureFlags();
  const { t } = useLanguage();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    // Load from localStorage or default to all expanded
    const saved = localStorage.getItem('nav-expanded-groups');
    if (saved) {
      return new Set(JSON.parse(saved));
    }
    return new Set([
      'operations',
      'production',
      'maintenance',
      'performance',
      'people',
      'ai',
      'system',
    ]);
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      // Save to localStorage
      localStorage.setItem('nav-expanded-groups', JSON.stringify([...next]));
      return next;
    });
  };

  // Filter groups to only show items with enabled features
  const visibleGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.featureFlag || isFeatureEnabled(item.featureFlag)),
    }))
    .filter((group) => group.items.length > 0);

  // Filter root items
  const visibleRootItems = rootNavItems.filter(
    (item) => !item.featureFlag || isFeatureEnabled(item.featureFlag)
  );

  return (
    <nav className="h-full flex flex-col py-4">
      <div className="px-4 mb-6">
        <h1 className="text-xl font-bold text-versuni-primary">Contoso Factory</h1>
        <p className="text-xs text-muted-foreground">Frontline Assistant</p>
        <p className="text-xs text-versuni-primary mt-1 font-medium capitalize">
          {currentRole.replace('-', ' ')}
        </p>
      </div>

      <div className="flex-1 px-2 overflow-y-auto">
        <div className="space-y-2">
          {/* Root Navigation Items */}
          <div className="space-y-0.5 mb-4">
            {visibleRootItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={cn('w-5 h-5', isActive && 'stroke-[2.5]')} />
                      <span className="text-sm">
                        {t(item.labelKey, item.labelKey.split('.')[1])}
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Grouped Navigation Items */}
          {visibleGroups.map((group) => {
            const isExpanded = expandedGroups.has(group.id);
            const GroupIcon = group.icon;

            return (
              <div key={group.id}>
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent/50"
                >
                  <GroupIcon className="w-4 h-4" />
                  <span className="flex-1 text-left uppercase tracking-wide">
                    {t(group.labelKey, group.labelKey.split('.').pop() || '')}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {/* Group Items */}
                {isExpanded && (
                  <div className="mt-1 space-y-0.5 ml-2">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          className={({ isActive }) =>
                            cn(
                              'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                              isActive
                                ? 'bg-primary text-primary-foreground font-medium'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            )
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <Icon className={cn('w-4 h-4', isActive && 'stroke-[2.5]')} />
                              <span className="text-sm">
                                {t(item.labelKey, item.labelKey.split('.')[1])}
                              </span>
                            </>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
