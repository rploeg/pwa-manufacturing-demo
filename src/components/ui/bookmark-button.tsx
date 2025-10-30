import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookmarks } from '@/stores/bookmarkStore';
import { useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';

interface BookmarkButtonProps {
  title: string;
  category?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  showLabel?: boolean;
}

export function BookmarkButton({ 
  title, 
  category, 
  size = 'default',
  variant = 'ghost',
  showLabel = false 
}: BookmarkButtonProps) {
  const location = useLocation();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const bookmarked = isBookmarked(location.pathname);

  const handleToggle = () => {
    if (bookmarked) {
      removeBookmark(location.pathname);
    } else {
      addBookmark({
        path: location.pathname,
        title,
        category,
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      className={cn(
        'transition-all',
        bookmarked && 'text-yellow-500 hover:text-yellow-600'
      )}
      title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <Star
        className={cn(
          'w-4 h-4',
          bookmarked && 'fill-current'
        )}
      />
      {showLabel && (
        <span className="ml-2">{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
      )}
    </Button>
  );
}
