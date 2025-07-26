'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useWepin, WepinProvider } from '@/contexts/WepinContext';
import { useLogoutAll } from '@/hooks/useLogoutAll';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

function AuthSyncer() {
  const { isInitialized, isLoggedIn: isWepinLoggedIn } = useWepin();

  const pathname = usePathname();
  const logoutAll = useLogoutAll();

  useEffect(() => {
    const syncAuth = async () => {
      const token = localStorage.getItem('ACCESS_TOKEN');
      if (!isInitialized) return;
      if (isWepinLoggedIn && !token) {
        // logoutAll();
      } else {
        // TODO: me 호출 > 위핀내 정보랑 me 호출해서 다르면 로그아웃 시켜야 될거같음?
      }
    };
    syncAuth();
  }, [isWepinLoggedIn, isInitialized]);

  useEffect(() => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (!token && pathname !== ROUTES.auth.login) {
      logoutAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}

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
        <AuthSyncer />
        {children}
      </WepinProvider>
    </QueryClientProvider>
  );
}
