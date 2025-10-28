import { NavLink } from 'react-router-dom';
import {
  Home,
  MessageSquare,
  ListChecks,
  Network,
  ClipboardCheck,
  Wrench,
  Brain,
  Mic,
  BookOpen,
  Settings,
} from 'lucide-react';
import { cn } from '@/utils/cn';

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/chat', icon: MessageSquare, label: 'Agents' },
  { path: '/scenarios', icon: ListChecks, label: 'Scenarios' },
  { path: '/twin', icon: Network, label: 'Digital Twin' },
  { path: '/quality', icon: ClipboardCheck, label: 'Quality' },
  { path: '/maintenance', icon: Wrench, label: 'Maintenance' },
  { path: '/predictive', icon: Brain, label: 'Predictive' },
  { path: '/handover', icon: Mic, label: 'Handover' },
  { path: '/knowledge', icon: BookOpen, label: 'Knowledge' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function DesktopNav() {
  return (
    <nav className="h-full flex flex-col py-4">
      <div className="px-4 mb-6">
        <h1 className="text-xl font-bold text-versuni-primary">Versuni</h1>
        <p className="text-xs text-muted-foreground">Frontline Assistant</p>
      </div>

      <div className="flex-1 space-y-1 px-2">
        {navItems.map((item) => {
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
                  <span className="text-sm">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
