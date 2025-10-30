import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Bookmark {
  path: string;
  title: string;
  icon?: string;
  category?: string;
  addedAt: number;
}

interface BookmarkStore {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, 'addedAt'>) => void;
  removeBookmark: (path: string) => void;
  isBookmarked: (path: string) => boolean;
  clearBookmarks: () => void;
}

export const useBookmarks = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      
      addBookmark: (bookmark) => {
        const exists = get().bookmarks.some((b) => b.path === bookmark.path);
        if (!exists) {
          set((state) => ({
            bookmarks: [
              ...state.bookmarks,
              { ...bookmark, addedAt: Date.now() },
            ],
          }));
        }
      },
      
      removeBookmark: (path) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.path !== path),
        }));
      },
      
      isBookmarked: (path) => {
        return get().bookmarks.some((b) => b.path === path);
      },
      
      clearBookmarks: () => {
        set({ bookmarks: [] });
      },
    }),
    {
      name: 'contoso-bookmarks',
    }
  )
);
