'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWepin } from '@/contexts/WepinContext';
import { ROUTES } from '@/constants/routes';

export default function Home() {
  const router = useRouter();
  const { isInitialized, isLoggedIn } = useWepin();

  useEffect(() => {
    if (!isInitialized) {
      return; // SDK 초기화 대기
    }

    if (isLoggedIn) {
      router.push(ROUTES.elo.root);
    } else {
      router.push(ROUTES.auth.login);
    }
  }, [isInitialized, isLoggedIn, router]);

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
