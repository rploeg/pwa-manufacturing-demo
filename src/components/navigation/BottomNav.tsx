import { NavLink } from 'react-router-dom';
import {
  Home,
  MessageSquare,
  Network,
  Settings,
  Calendar,
  Trophy,
  Clock,
  Package,
} from 'lucide-react';
import { cn } from '@/utils/cn';
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
  { path: '/twin', icon: Network, labelKey: 'nav.digitalTwin', featureFlag: 'digitalTwin3D' },
  {
    path: '/planning',
    icon: Calendar,
    labelKey: 'nav.planning',
    featureFlag: 'productionPlanning',
  },
  { path: '/settings', icon: Settings, labelKey: 'nav.settings' },
];

export function BottomNav() {
  const { isFeatureEnabled } = useFeatureFlags();
  const { t } = useLanguage();

  const visibleNavItems = navItems.filter(
    (item) => !item.featureFlag || isFeatureEnabled(item.featureFlag)
  );

  return (
    <nav className="border-t bg-background safe-area-bottom">
      <div className="flex justify-around items-center h-16 px-2">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg touch-target flex-1 max-w-[80px] transition-colors',
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('w-5 h-5', isActive && 'stroke-[2.5]')} />
                  <span className="text-xs font-medium">
                    {t(item.labelKey, item.labelKey.split('.')[1])}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
