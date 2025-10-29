import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { Router } from './Router';
import { env } from '@/data/config';
import { useEffect } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Initialize MSW for mocking if enabled
if (env.useMocks) {
  import('../mocks/browser').then(({ worker }) => {
    worker.start({
      onUnhandledRequest: 'bypass',
    });
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  useEffect(() => {
    // Add viewport meta tag with safe-area-inset for mobile notches
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content =
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
        {env.env === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
      </LanguageProvider>
    </QueryClientProvider>
  );
}
