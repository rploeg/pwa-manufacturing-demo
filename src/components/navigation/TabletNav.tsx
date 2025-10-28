import { NavLink } from 'react-router-dom';
import {
  Home,
  MessageSquare,
  Network,
  ClipboardCheck,
  Wrench,
  Brain,
  Mic,
  BookOpen,
  Settings,
  RefreshCw,
  Shield,
  Trophy,
  Calendar,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import * as Tooltip from '@radix-ui/react-tooltip';

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/chat', icon: MessageSquare, label: 'Agents' },
  { path: '/twin', icon: Network, label: 'Digital Twin' },
  { path: '/quality', icon: ClipboardCheck, label: 'Quality' },
  { path: '/maintenance', icon: Wrench, label: 'Maintenance' },
  { path: '/predictive', icon: Brain, label: 'Predictive' },
  { path: '/handover', icon: Mic, label: 'Handover' },
  { path: '/knowledge', icon: BookOpen, label: 'Knowledge' },
  { path: '/changeover', icon: RefreshCw, label: 'Changeover' },
  { path: '/safety', icon: Shield, label: 'Safety' },
  { path: '/oee-coaching', icon: Trophy, label: 'OEE Coaching' },
  { path: '/planning', icon: Calendar, label: 'Planning' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function TabletNav() {
  return (
    <Tooltip.Provider delayDuration={300}>
      <nav className="h-full flex flex-col py-4 items-center">
        <div className="mb-6">
          <div className="w-10 h-10 rounded-lg bg-versuni-primary flex items-center justify-center text-white font-bold text-lg">
            V
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {navItems.map((item) => {
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
                    {item.label}
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
