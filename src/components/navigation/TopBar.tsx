import { Bell, User, Search, AlertCircle, CheckCircle, Clock, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/useAuth';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { agentService } from '@/data/clients/agent';
import { Markdown } from '@/components/ui/markdown';
import { useFeatureFlags, type UserRole } from '@/contexts/FeatureFlagsContext';
import { realtimeService, type RealtimeUpdate } from '@/services/realtimeService';
import { LanguageSelector } from '@/components/LanguageSelector';
import { GlobalSearch } from '@/components/ui/global-search';
import { BookmarksPanel } from '@/components/ui/bookmarks-panel';

interface Notification {
  id: string | number;
  type: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

export function TopBar() {
  const { user } = useAuth();
  const { currentRole, setRole, applyRoleDefaults, flags, updateFlags } = useFeatureFlags();
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResponse, setSearchResponse] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'critical',
      title: 'Line-B Downtime Alert',
      message: 'Filler-3 seal mechanism jam detected',
      time: '5 min ago',
      unread: true,
    },
    {
      id: 2,
      type: 'warning',
      title: 'Quality Alert',
      message: 'Line-A defect rate above threshold (3.2%)',
      time: '15 min ago',
      unread: true,
    },
    {
      id: 3,
      type: 'info',
      title: 'Maintenance Reminder',
      message: 'PM-003 due in 1 hour',
      time: '1 hour ago',
      unread: false,
    },
  ]);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = realtimeService.subscribe((update: RealtimeUpdate) => {
      const newNotification: Notification = {
        id: update.id,
        type: update.severity,
        title: update.title,
        message: update.message,
        time: 'Just now',
        unread: true,
      };

      setNotifications((prev) => [newNotification, ...prev].slice(0, 10)); // Keep last 10
    });

    return unsubscribe;
  }, []);

  // Global search keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowGlobalSearch(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleDarkMode = () => {
    updateFlags({ ...flags, darkMode: !flags.darkMode });
  };

  const handleRoleChange = (role: UserRole) => {
    setRole(role);
    applyRoleDefaults();
    // Optionally show a toast notification
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResponse('');

    try {
      const stream = agentService.streamOrchestrator({
        messages: [
          {
            role: 'user',
            content: searchQuery,
            timestamp: new Date(),
            id: Date.now().toString(),
          },
        ],
        maxTokens: 500,
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        if (!chunk.done) {
          fullResponse += chunk.delta;
          setSearchResponse(fullResponse);
        }
      }
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResponse('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSearching) {
      handleSearch();
    }
  };

  return (
    <header className="h-14 border-b bg-background flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-versuni-primary flex items-center justify-center text-white font-bold">
            C
          </div>
          <span className="font-semibold text-lg">Contoso Factory</span>
        </div>
        <div className="md:hidden">
          <span className="font-semibold">Contoso</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Language Selector */}
        <LanguageSelector />

        {/* Bookmarks */}
        <BookmarksPanel />

        {/* Global Search Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowGlobalSearch(true)}
          title="Search (Ctrl+K)"
          className="hidden md:flex"
        >
          <Search className="w-5 h-5" />
        </Button>

        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          title={flags.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {flags.darkMode ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>

        {/* Search Dialog */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => setShowSearchDialog(true)}
        >
          <Search className="w-5 h-5" />
        </Button>

        <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
          <DialogContent className="max-w-2xl max-h-[600px] flex flex-col">
            <DialogHeader>
              <DialogTitle>🔍 Ask AI Assistant</DialogTitle>
            </DialogHeader>
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything about production, quality, maintenance..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSearching}
              />
              <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
                {isSearching ? 'Searching...' : 'Ask'}
              </Button>
            </div>
            {searchResponse && (
              <div className="flex-1 overflow-y-auto border rounded-lg p-4 bg-muted/30">
                <Markdown>{searchResponse}</Markdown>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
                <div className="flex items-start gap-2 w-full">
                  {notification.type === 'critical' && (
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  )}
                  {notification.type === 'warning' && (
                    <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  )}
                  {notification.type === 'info' && (
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-sm">{notification.title}</span>
                      {notification.unread && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{notification.message}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {notification.time}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center justify-center text-sm text-versuni-primary">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Account Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {user && (
              <>
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      {user.username}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Current Role
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={currentRole}
              onValueChange={(value) => handleRoleChange(value as UserRole)}
            >
              <DropdownMenuRadioItem value="frontline">Frontline Worker</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="factory-manager">Factory Manager</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="ot-engineer">OT Engineer</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="it-engineer">IT Engineer</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className="w-4 h-4 mr-2" />
              Notification Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {user && (
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground capitalize">
              {currentRole.replace('-', ' ')}
            </span>
          </div>
        )}
      </div>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={showGlobalSearch} onClose={() => setShowGlobalSearch(false)} />
    </header>
  );
}
