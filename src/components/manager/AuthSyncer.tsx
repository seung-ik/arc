'use client';

import { useEffect } from 'react';
import { useWepin } from '@/contexts/WepinContext';
import { useLogoutAll } from '@/hooks/useLogoutAll';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useProfileApi } from '@/api/useUser';
import { ROUTES } from '@/constants/routes';

export default function AuthSyncer() {
  const {
    isInitialized,
    isLoggedIn: isWepinLoggedIn,
    userInfo: wepinUserInfo,
  } = useWepin();
  const { refetch: refetchProfile } = useProfileApi();
  const router = useRouter();

  const pathname = usePathname();
  const { handleLogout } = useLogoutAll();
  const { isLoggedIn, userProfile } = useAuthStore();

  useEffect(() => {
    const syncAuth = async () => {
      const token = localStorage.getItem('ACCESS_TOKEN');
      if (!isInitialized) return;
      if (wepinUserInfo && token) {
        refetchProfile()
          .then(({ data }) => {
            if (data?.user?.email !== wepinUserInfo?.email) {
              handleLogout();
            } else {
              console.log('위핀, 토큰 정보 일치합니다.');
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
    };
    syncAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWepinLoggedIn, isInitialized, wepinUserInfo]);

  useEffect(() => {
    const token = localStorage.getItem('ACCESS_TOKEN');

    // 토큰없이 들어갈수있는 페이지가 아니면 로그아웃
    if (!token && !(pathname.includes('auth') || pathname === '/')) {
      handleLogout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (isLoggedIn && !userProfile.nickname) {
      router.push(ROUTES.auth.nickname);
    }
  }, [isLoggedIn, userProfile.nickname, router]);

  return null;
}
