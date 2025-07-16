'use client';

import styled from 'styled-components';
import { useState, useEffect } from 'react';
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

const LoginButton = styled.button`
  background: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.textWhite};
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.md} ${(props) => props.theme.spacing.xl};
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.sm};

  &:hover {
    background: ${(props) => props.theme.colors.primaryHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 112, 243, 0.3);
  }

  &:disabled {
    background: ${(props) => props.theme.colors.textLightGray};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const GoogleIcon = styled.div`
  font-size: 20px;
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

export default function LoginClient() {
  const router = useRouter();
  const { isInitialized, isLoggedIn, login } = useWepin();

  const handleGoogleLogin = async () => {
    if (!isInitialized) {
      alert('Wepin SDK가 초기화되지 않았습니다.');
      return;
    }

    try {
      // Wepin SDK를 통한 구글 로그인 및 지갑 생성
      await login();

      // 로그인 성공 시 메인 페이지로 이동
      router.push(ROUTES.elo.root);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
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
      <LoginButton onClick={handleGoogleLogin}>구글 계정으로 시작하기</LoginButton>
    </LoginContainer>
  );
}
