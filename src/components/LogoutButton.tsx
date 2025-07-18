'use client';

import styled from 'styled-components';
import { useWepin } from '@/contexts/WepinContext';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

const LogoutButtonStyled = styled.button`
  background: ${props => props.theme.colors.error};
  color: ${props => props.theme.colors.textWhite};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #c82333;
  }

  &:disabled {
    background: ${props => props.theme.colors.textLightGray};
    cursor: not-allowed;
  }
`;

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const { logout } = useWepin();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push(ROUTES.auth.login);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <LogoutButtonStyled onClick={handleLogout} className={className}>
      로그아웃
    </LogoutButtonStyled>
  );
}
