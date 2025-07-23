'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { WepinProvider, useWepin } from '@/contexts/WepinContext';
import { useAuthStore } from '@/stores/authStore';
import { useLoginApi } from '@/api/useAuth';
import { useLogoutAll } from '@/hooks/useLogoutAll';

function AuthSyncer() {
  const { isInitialized, isLoggedIn: isWepinLoggedIn, userInfo } = useWepin();
  const { setUser } = useAuthStore();
  const { mutate: login } = useLoginApi();
  const logoutAll = useLogoutAll();

  useEffect(() => {
    const syncAuth = async () => {
      if (!isInitialized) return;
      if (isWepinLoggedIn && userInfo) {
        login(userInfo, {
          onSuccess: (res: any) => {
            localStorage.setItem('accessToken', res.token);
            setUser({ address: res.user?.address || '', isLoggedIn: true });
          },
          onError: () => {
            logoutAll();
          },
        });
      } else {
        logoutAll();
      }
    };
    syncAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, isWepinLoggedIn, userInfo]);
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
