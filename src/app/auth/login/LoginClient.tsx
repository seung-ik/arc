'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useWepin } from '@/contexts/WepinContext';
import { ROUTES } from '@/constants/routes';
import FullPageLoading from '@/components/FullPageLoading';
import { useLoginApi } from '@/api/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { useLogoutAll } from '@/hooks/useLogoutAll';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: ${props => props.theme.spacing.lg};
`;

const LoginButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textWhite};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 112, 243, 0.3);
  }

  &:disabled {
    background: ${props => props.theme.colors.textLightGray};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export default function LoginClient() {
  const router = useRouter();
  const { isInitialized, loginByWepin } = useWepin();
  const { mutate: login } = useLoginApi();
  const { setUser } = useAuthStore();
  const logoutAll = useLogoutAll();

  const handleGoogleLogin = async () => {
    if (!isInitialized) {
      alert('Wepin SDK가 초기화되지 않았습니다.');
      return;
    }

    try {
      // Wepin SDK를 통한 구글 로그인 및 지갑 생성
      const data = await loginByWepin();

      if (data) {
        const params = {
          idToken: data.idToken,
          email: data.wepinUser.userInfo.email,
          accounts: data.accounts,
        };

        login(params, {
          onSuccess: ({ data, success, message }) => {
            if (success === true) {
              // API 요청 시 헤더에 사용할 토큰 저장
              localStorage.setItem('ACCESS_TOKEN', data.accessToken);

              // userStore에 사용자 정보 저장
              setUser({
                availableToken: data.user.availableToken,
                email: data.user.email,
                id: data.user.id,
                nickname: data.user.nickname ?? '',
                profileImageUrl: data.user.profileImageUrl ?? '',
                tokenAmount: data.user.tokenAmount ?? '',
                walletAddress: data.user.walletAddress ?? '',
                isLoggedIn: true,
              });

              router.push(ROUTES.elo.root);
            } else {
              alert(message);
            }
          },
          onError: err => {
            console.error('Login failed:', err);
          },
        });
      }
    } catch (error) {
      logoutAll();
      console.error('Wepin login failed:', error);
    }
  };

  if (!isInitialized) {
    return <FullPageLoading />;
  }

  return (
    <LoginContainer>
      <LoginButton onClick={handleGoogleLogin}>
        구글 계정으로 시작하기
      </LoginButton>
    </LoginContainer>
  );
}
