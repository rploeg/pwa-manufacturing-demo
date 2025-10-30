import { Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useBookmarks } from '@/stores/bookmarkStore';
import { useNavigate } from 'react-router-dom';

export function BookmarksPanel() {
  const { bookmarks, removeBookmark } = useBookmarks();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Star className="w-5 h-5" />
          {bookmarks.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[10px] text-primary-foreground flex items-center justify-center">
              {bookmarks.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Bookmarks</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {bookmarks.length === 0 ? (
          <div className="px-2 py-8 text-center text-sm text-muted-foreground">
            <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No bookmarks yet</p>
            <p className="text-xs mt-1">Click the star icon on any page to bookmark it</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {bookmarks.map((bookmark) => (
              <DropdownMenuItem
                key={bookmark.path}
                className="flex items-center justify-between gap-2 cursor-pointer"
                onSelect={() => handleNavigate(bookmark.path)}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{bookmark.title}</div>
                  {bookmark.category && (
                    <div className="text-xs text-muted-foreground">{bookmark.category}</div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeBookmark(bookmark.path);
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
