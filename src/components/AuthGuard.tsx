'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWepin } from '@/contexts/WepinContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const router = useRouter();
  const { isInitialized, isLoggedIn } = useWepin();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isInitialized) {
      return; // SDK 초기화 대기
    }

    if (requireAuth && !isLoggedIn) {
      // 로그인이 필요한 페이지인데 로그인되지 않은 경우
      router.push('/login');
    } else if (!requireAuth && isLoggedIn) {
      // 로그인 페이지인데 이미 로그인된 경우
      router.push('/elo');
    } else {
      setIsChecking(false);
    }
  }, [isInitialized, isLoggedIn, requireAuth, router]);

  // SDK 초기화 중이거나 인증 상태 확인 중
  if (!isInitialized || isChecking) {
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

  return <>{children}</>;
}
