'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { WepinProvider } from '@/contexts/WepinContext';
import PrefetchProvider from './PrefetchProvider';
import AuthSyncer from './AuthSyncer';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <WepinProvider>
        <PrefetchProvider>
          <AuthSyncer />
          {children}
        </PrefetchProvider>
      </WepinProvider>
    </QueryClientProvider>
  );
}
