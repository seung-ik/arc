'use client';

import styled from 'styled-components';
import { useWepin } from '@/contexts/WepinContext';

const WepinSection = styled.div`
  background: ${props => props.theme.colors.backgroundGray};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.lg};
  margin: ${props => props.theme.spacing.md} 0;
`;

const SectionTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.textBlack};
  margin-bottom: ${props => props.theme.spacing.md};
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
  transition: background 0.2s;
  width: 100%;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
  }

  &:disabled {
    background: ${props => props.theme.colors.textLightGray};
    cursor: not-allowed;
  }
`;

const LogoutButton = styled(LoginButton)`
  background: ${props => props.theme.colors.error};

  &:hover {
    background: #c82333;
  }
`;

const AccountInfo = styled.div`
  margin-top: ${props => props.theme.spacing.md};
`;

const AccountItem = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const AccountNetwork = styled.div`
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.textBlack};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const AccountAddress = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textGray};
  word-break: break-all;
`;

const StatusText = styled.div`
  color: ${props => props.theme.colors.textGray};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  text-align: center;
  margin: ${props => props.theme.spacing.md} 0;
`;

export default function WepinProfileSection() {
  const { isInitialized, isLoggedIn, accounts, login, logout } = useWepin();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!isInitialized) {
    return (
      <WepinSection>
        <SectionTitle>Wepin 지갑</SectionTitle>
        <StatusText>Wepin SDK 초기화 중...</StatusText>
      </WepinSection>
    );
  }

  return (
    <WepinSection>
      <SectionTitle>Wepin 지갑</SectionTitle>

      {!isLoggedIn ? (
        <LoginButton onClick={handleLogin}>Wepin으로 로그인</LoginButton>
      ) : (
        <>
          <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>

          {accounts.length > 0 && (
            <AccountInfo>
              <AccountNetwork>연결된 계정:</AccountNetwork>
              {accounts.map((account, index) => (
                <AccountItem key={index}>
                  <AccountNetwork>{account.network}</AccountNetwork>
                  <AccountAddress>{account.address}</AccountAddress>
                </AccountItem>
              ))}
            </AccountInfo>
          )}
        </>
      )}
    </WepinSection>
  );
}
