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
} from 'lucide-react';
import { cn } from '@/utils/cn';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useFeatureFlags } from '@/contexts/FeatureFlagsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import type { FeatureFlags } from '@/contexts/FeatureFlagsContext';

const navItems: Array<{
  path: string;
  icon: typeof Home;
  labelKey: string;
  featureFlag?: keyof FeatureFlags;
}> = [
  { path: '/home', icon: Home, labelKey: 'nav.home' },
  { path: '/chat', icon: MessageSquare, labelKey: 'nav.agents', featureFlag: 'multiAgent' },
  { path: '/twin', icon: Network, labelKey: 'nav.digitalTwin', featureFlag: 'digitalTwin3D' },
  {
    path: '/work-instructions',
    icon: FileText,
    labelKey: 'nav.workInstructions',
    featureFlag: 'workInstructions',
  },
  { path: '/tools', icon: Hammer, labelKey: 'nav.tools', featureFlag: 'toolManagement' },
  { path: '/skills', icon: Award, labelKey: 'nav.skillsMatrix', featureFlag: 'skillsMatrix' },
  {
    path: '/shift-handover',
    icon: Clock,
    labelKey: 'nav.shiftHandover',
    featureFlag: 'shiftHandover',
  },
  {
    path: '/performance',
    icon: Trophy,
    labelKey: 'nav.performance',
    featureFlag: 'performanceDashboard',
  },
  {
    path: '/traceability',
    icon: Package,
    labelKey: 'nav.traceability',
    featureFlag: 'traceability',
  },
  {
    path: '/quality',
    icon: ClipboardCheck,
    labelKey: 'nav.quality',
    featureFlag: 'qualityInsights',
  },
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
  { path: '/rca', icon: AlertCircle, labelKey: 'nav.rootCause', featureFlag: 'rootCauseAnalysis' },
  { path: '/energy', icon: Zap, labelKey: 'nav.energy', featureFlag: 'energyManagement' },
  { path: '/knowledge', icon: BookOpen, labelKey: 'nav.knowledge', featureFlag: 'aiAssistant' },
  {
    path: '/changeover',
    icon: RefreshCw,
    labelKey: 'nav.changeover',
    featureFlag: 'smedChangeover',
  },
  { path: '/safety', icon: Shield, labelKey: 'nav.safety', featureFlag: 'safetyAnalytics' },
  { path: '/oee-coaching', icon: Trophy, labelKey: 'nav.oeeCoaching', featureFlag: 'oeeCoaching' },
  {
    path: '/planning',
    icon: Calendar,
    labelKey: 'nav.planning',
    featureFlag: 'productionPlanning',
  },
  { path: '/edge-devices', icon: Server, labelKey: 'nav.edgeDevices', featureFlag: 'edgeDevices' },
  { path: '/settings', icon: Settings, labelKey: 'nav.settings' },
];

export function TabletNav() {
  const { isFeatureEnabled } = useFeatureFlags();
  const { t } = useLanguage();

  const visibleNavItems = navItems.filter(
    (item) => !item.featureFlag || isFeatureEnabled(item.featureFlag)
  );

  return (
    <Tooltip.Provider delayDuration={300}>
      <nav className="h-full flex flex-col py-4 items-center">
        <div className="mb-6">
          <div className="w-10 h-10 rounded-lg bg-versuni-primary flex items-center justify-center text-white font-bold text-lg">
            V
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Tooltip.Root key={item.path}>
                <Tooltip.Trigger asChild>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-center w-12 h-12 rounded-lg transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <Icon className={cn('w-5 h-5', isActive && 'stroke-[2.5]')} />
                    )}
                  </NavLink>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="right"
                    sideOffset={8}
                    className="bg-popover text-popover-foreground px-3 py-2 rounded-md shadow-md text-sm"
                  >
                    {t(item.labelKey, item.labelKey.split('.')[1])}
                    <Tooltip.Arrow className="fill-popover" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            );
          })}
        </div>
      </nav>
    </Tooltip.Provider>
  );
}
