'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useWepin, WepinProvider } from '@/contexts/WepinContext';
import { useLogoutAll } from '@/hooks/useLogoutAll';
import { usePathname } from 'next/navigation';
// import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/authStore';
import { useInitNicknameApi, useProfileApi } from '@/api/useUser';
import PrefetchProvider from './PrefetchProvider';
import NicknameModal from './modals/NicknameModal';

function AuthSyncer() {
  const {
    isInitialized,
    isLoggedIn: isWepinLoggedIn,
    userInfo: wepinUserInfo,
  } = useWepin();
  const { mutate: initNickname } = useInitNicknameApi();
  const { refetch: refetchProfile } = useProfileApi();
  const [showNicknameModal, setShowNicknameModal] = useState(false);

  const pathname = usePathname();
  const logoutAll = useLogoutAll();
  const { isLoggedIn, userProfile, setProfile } = useAuthStore();

  useEffect(() => {
    const syncAuth = async () => {
      const token = localStorage.getItem('ACCESS_TOKEN');
      if (!isInitialized) return;
      if (wepinUserInfo && token) {
        // TODO: me 호출 > 위핀내 정보랑 me 호출해서 다르면 로그아웃 시켜야 될거같음?

        // 프로필 API 호출
        refetchProfile()
          .then(({ data }) => {
            if (data?.user?.email !== wepinUserInfo?.email) {
              logoutAll();
            } else {
              console.log('위핀, 토큰 정보 일치합니다.');
            }
          })
          .catch(error => {
            console.error(error);
            logoutAll();
          });
      }

      // logoutAll();
    };
    syncAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWepinLoggedIn, isInitialized, wepinUserInfo]);

  useEffect(() => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (!token && !pathname.includes('auth')) {
      logoutAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (isLoggedIn && !userProfile.nickname) {
      setShowNicknameModal(true);
    }
  }, [isLoggedIn, userProfile.nickname]);

  const handleNicknameSubmit = (nickname: string) => {
    initNickname(
      { nickname },
      {
        onSuccess: response => {
          setShowNicknameModal(false);
          // 유저 정보 업데이트
          setProfile({
            ...userProfile,
            nickname: response.data.nickname,
          });
        },
        onError: error => {
          console.error('닉네임 설정 실패:', error);
        },
      }
    );
  };

  return (
    <>
      <NicknameModal open={showNicknameModal} onSubmit={handleNicknameSubmit} />
    </>
  );
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
        <PrefetchProvider>
          <AuthSyncer />
          {children}
        </PrefetchProvider>
      </WepinProvider>
    </QueryClientProvider>
  );
}
