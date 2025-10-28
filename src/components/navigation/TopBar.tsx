import { Bell, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/useAuth';

export function TopBar() {
  const { user } = useAuth();

  return (
    <header className="h-14 border-b bg-background flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-versuni-primary flex items-center justify-center text-white font-bold">
            V
          </div>
          <span className="font-semibold text-lg">Versuni Frontline</span>
        </div>
        <div className="md:hidden">
          <span className="font-semibold">Versuni</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Search className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        <Button variant="ghost" size="icon">
          <User className="w-5 h-5" />
        </Button>
        {user && (
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.username}</span>
          </div>
        )}
      </div>
    </header>
  );
}
