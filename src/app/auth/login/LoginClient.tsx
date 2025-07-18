'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useWepin } from '@/contexts/WepinContext';
import { ROUTES } from '@/constants/routes';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: ${props => props.theme.spacing.lg};
`;

const LoginCard = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.base};
  color: ${props => props.theme.colors.textGray};
  margin-bottom: ${props => props.theme.spacing.xl};
  line-height: 1.6;
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

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default function LoginClient() {
  const router = useRouter();
  const { isInitialized, login } = useWepin();

  const handleGoogleLogin = async () => {
    if (!isInitialized) {
      alert('Wepin SDK가 초기화되지 않았습니다.');
      return;
    }

    try {
      // Wepin SDK를 통한 구글 로그인 및 지갑 생성
      const data = await login();
      console.log(data);

      // 로그인 성공 시 메인 페이지로 이동
      router.push(ROUTES.elo.root);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (!isInitialized) {
    return (
      <LoginContainer>
        <LoginCard>
          <LoadingSpinner />
          <Subtitle>Wepin SDK 초기화 중...</Subtitle>
        </LoginCard>
      </LoginContainer>
    );
  }

  return (
    <LoginContainer>
      <LoginButton onClick={handleGoogleLogin}>
        구글 계정으로 시작하기
      </LoginButton>
    </LoginContainer>
  );
}
