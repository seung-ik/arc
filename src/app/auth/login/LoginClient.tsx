'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useWepin } from '@/contexts/WepinContext';
import { ROUTES } from '@/constants/routes';
import FullPageLoading from '@/components/FullPageLoading';
import { useLoginApi } from '@/api/useAuth';

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

  const handleGoogleLogin = async () => {
    if (!isInitialized) {
      alert('Wepin SDK가 초기화되지 않았습니다.');
      return;
    }

    try {
      // Wepin SDK를 통한 구글 로그인 및 지갑 생성
      const data = await loginByWepin();
      console.log(data);
      // data 전체 + 추가 값 합쳐서 파라미터로 전달
      const params = {
        // ...data,
        // extraInfo: '추가 데이터 예시',
        // loginType: 'wepin',
        // timestamp: Date.now(),
        email: '123',
        password: '123',
      };

      login(params, {
        onSuccess: (res: any) => {
          localStorage.setItem('accessToken', res.token);
          router.push(ROUTES.elo.root);
        },
        onError: (err: any) => {
          console.error('Login failed:', err);
        },
      });
    } catch (error) {
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
