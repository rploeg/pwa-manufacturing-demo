import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, ListChecks, Network, Settings } from 'lucide-react';
import { cn } from '@/utils/cn';

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/chat', icon: MessageSquare, label: 'Agents' },
  { path: '/scenarios', icon: ListChecks, label: 'Scenarios' },
  { path: '/twin', icon: Network, label: 'Twin' },
  { path: '/settings', icon: Settings, label: 'More' },
];

export function BottomNav() {
  return (
    <nav className="border-t bg-background safe-area-bottom">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
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
                  <span className="text-xs font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
