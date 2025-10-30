import { NavLink } from 'react-router-dom';
import {
  Home,
  Clipboard,
  Box,
  Wrench,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/utils/cn';

// Mobile navigation shows only main groups for better UX
const navItems: Array<{
  path: string;
  icon: typeof Home;
  labelKey: string;
}> = [
  { path: '/home', icon: Home, labelKey: 'Home' },
  { path: '/ai-scenarios', icon: Sparkles, labelKey: 'AI' },
  { path: '/twin', icon: Clipboard, labelKey: 'Operations' },
  { path: '/planning', icon: Box, labelKey: 'Production' },
  { path: '/maintenance', icon: Wrench, labelKey: 'Maintenance' },
  { path: '/performance', icon: TrendingUp, labelKey: 'Performance' },
];

export function BottomNav() {
  return (
    <nav className="border-t bg-background/95 backdrop-blur-lg safe-area-bottom">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg touch-target flex-1 max-w-[80px] transition-all duration-200',
                  isActive
                    ? 'text-primary scale-110'
                    : 'text-muted-foreground hover:text-foreground active:scale-95'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('w-5 h-5 transition-all', isActive && 'stroke-[2.5]')} />
                  <span className={cn('text-[10px] font-medium transition-all', isActive && 'font-semibold')}>
                    {item.labelKey}
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
