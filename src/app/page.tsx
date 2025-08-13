'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useWepin } from '@/contexts/WepinContext';
import { ROUTES } from '@/constants/routes';

export default function Home() {
  const router = useRouter();
  const { isInitialized, isLoggedIn } = useWepin();
  const pathname = usePathname();

  useEffect(() => {
    if (!isInitialized) {
      return; // SDK 초기화 대기
    }
    if (!isLoggedIn && !pathname.includes('auth')) {
      router.push(ROUTES.auth.login);
    } else if (isLoggedIn) {
      router.push(ROUTES.elo.root);
    }
  }, [isInitialized, isLoggedIn, pathname, router]);

  // 로딩 중 표시
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666',
      }}
    >
      로딩 중...
    </div>
  );
}
