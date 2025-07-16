'use client';

import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { useWepin } from '@/contexts/WepinContext';
import { ROUTES } from '@/constants/routes';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: ${(props) => props.theme.spacing.lg};
`;

const LoginCard = styled.div`
  background: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.theme.spacing.xl};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const Logo = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes['4xl']};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const Title = styled.h1`
  font-size: ${(props) => props.theme.typography.fontSizes['2xl']};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.textBlack};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  color: ${(props) => props.theme.colors.textGray};
  margin-bottom: ${(props) => props.theme.spacing.xl};
  line-height: 1.6;
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

const ErrorMessage = styled.div`
  color: ${(props) => props.theme.colors.error};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  margin-top: ${(props) => props.theme.spacing.md};
  padding: ${(props) => props.theme.spacing.sm};
  background: ${(props) => props.theme.colors.backgroundGray};
  border-radius: ${(props) => props.theme.borderRadius.sm};
`;

const SuccessMessage = styled.div`
  color: ${(props) => props.theme.colors.success};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  margin-top: ${(props) => props.theme.spacing.md};
  padding: ${(props) => props.theme.spacing.sm};
  background: ${(props) => props.theme.colors.backgroundGray};
  border-radius: ${(props) => props.theme.borderRadius.sm};
`;

const Features = styled.div`
  margin-top: ${(props) => props.theme.spacing.xl};
  padding-top: ${(props) => props.theme.spacing.lg};
  border-top: 1px solid ${(props) => props.theme.colors.border};
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  margin-bottom: ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  color: ${(props) => props.theme.colors.textGray};
`;

const FeatureIcon = styled.div`
  color: ${(props) => props.theme.colors.primary};
  font-weight: bold;
`;

const GoogleLoginContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

export default function LoginClient() {
  const router = useRouter();
  const { isInitialized, isLoggedIn } = useWepin();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    console.log('Google OAuth Success:', credentialResponse);

    if (credentialResponse.credential) {
      const token = credentialResponse.credential;

      // ID Token을 콘솔에 출력 (개발용)
      console.log('ID Token:', token, credentialResponse);

      // TODO: 여기서 Wepin SDK로 ID Token을 전달할 예정
      // await wepinSDK.loginWithIdToken(token);

      // 임시로 3초 후 메인 페이지로 이동
      setTimeout(() => {
        router.push(ROUTES.elo.root);
      }, 3000);
    }
  };

  const handleGoogleError = () => {};

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
      <GoogleLoginContainer>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme="filled_blue"
          size="large"
          text="signin_with"
        />
      </GoogleLoginContainer>
    </LoginContainer>
  );
}
