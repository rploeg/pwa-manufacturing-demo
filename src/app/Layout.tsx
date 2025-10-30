import { Outlet } from 'react-router-dom';
import { useMediaQuery } from '@/utils/hooks/useMediaQuery';
import { BottomNav } from '@/components/navigation/BottomNav';
import { DesktopNav } from '@/components/navigation/DesktopNav';
import { TabletNav } from '@/components/navigation/TabletNav';
import { TopBar } from '@/components/navigation/TopBar';
import { OfflineIndicator } from '@/components/ui/offline-indicator';

export function Layout() {
  const isPhone = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      {/* Top app bar (all devices) */}
      <TopBar />

      {/* Offline indicator */}
      <OfflineIndicator />

      {/* Main content area with navigation */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop: persistent left sidebar */}
        {isDesktop && (
          <aside className="w-64 border-r bg-background">
            <DesktopNav />
          </aside>
        )}

        {/* Tablet: collapsible left rail */}
        {isTablet && (
          <aside className="w-20 border-r bg-background">
            <TabletNav />
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Phone: bottom navigation */}
      {isPhone && <BottomNav />}
    </div>
  );
}
