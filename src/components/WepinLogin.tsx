'use client';

import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { initializeWepin, getWepinSDK, checkLoginStatus, logout, getAccounts } from '@/lib/wepin';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
  padding: ${(props) => props.theme.spacing.lg};
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
  transition: background 0.2s;
  min-width: 200px;

  &:hover {
    background: ${(props) => props.theme.colors.primaryHover};
  }

  &:disabled {
    background: ${(props) => props.theme.colors.textLightGray};
    cursor: not-allowed;
  }
`;

const LogoutButton = styled(LoginButton)`
  background: ${(props) => props.theme.colors.error};

  &:hover {
    background: #c82333;
  }
`;

const AccountInfo = styled.div`
  background: ${(props) => props.theme.colors.backgroundGray};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.md};
  margin-top: ${(props) => props.theme.spacing.md};
  text-align: center;
  max-width: 400px;
  word-break: break-all;
`;

const StatusText = styled.div`
  color: ${(props) => props.theme.colors.textGray};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

interface Account {
  network: string;
  address: string;
}

export default function WepinLogin() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);

  // Wepin SDK 초기화
  useEffect(() => {
    const initWepin = async () => {
      try {
        setIsLoading(true);
        await initializeWepin();
        setIsInitialized(true);

        // 로그인 상태 확인
        const loginStatus = await checkLoginStatus();
        setIsLoggedIn(loginStatus);

        if (loginStatus) {
          const userAccounts = await getAccounts();
          setAccounts(userAccounts || []);
        }
      } catch (error) {
        console.error('Failed to initialize Wepin:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initWepin();
  }, []);

  // 로그인 처리
  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const sdk = getWepinSDK();
      const userInfo = await sdk.loginWithUI();

      // 로그인 후 계정 정보 가져오기
      const userAccounts = await getAccounts();
      setAccounts(userAccounts || []);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      setAccounts([]);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInitialized) {
    return (
      <LoginContainer>
        <StatusText>Wepin SDK 초기화 중...</StatusText>
      </LoginContainer>
    );
  }

  return (
    <LoginContainer>
      {!isLoggedIn ? (
        <LoginButton onClick={handleLogin} disabled={isLoading}>
          {isLoading ? '로그인 중...' : 'Wepin으로 로그인'}
        </LoginButton>
      ) : (
        <>
          <LogoutButton onClick={handleLogout} disabled={isLoading}>
            {isLoading ? '로그아웃 중...' : '로그아웃'}
          </LogoutButton>

          {accounts.length > 0 && (
            <AccountInfo>
              <StatusText>연결된 계정:</StatusText>
              {accounts.map((account, index) => (
                <div key={index}>
                  <strong>{account.network}:</strong> {account.address}
                </div>
              ))}
            </AccountInfo>
          )}
        </>
      )}
    </LoginContainer>
  );
}
