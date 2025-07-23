import { useAuthStore } from '@/stores/authStore';
import { useWepin } from '@/contexts/WepinContext';
import { useRouter } from 'next/navigation';
import { useLogoutApi } from '@/api/useAuth';

export function useLogoutAll() {
  const { logout: storeLogout } = useAuthStore();
  const { logout: wepinLogout } = useWepin();
  const { mutateAsync: logoutApi } = useLogoutApi();
  const router = useRouter();

  return async () => {
    try {
      await logoutApi(); // 서버 로그아웃 API 호출
    } catch {
      // 서버 로그아웃 실패는 무시하고 클라이언트 로그아웃 계속 진행
    }
    localStorage.removeItem('accessToken');
    storeLogout();
    await wepinLogout();
    router.push('/auth/login');
  };
}
