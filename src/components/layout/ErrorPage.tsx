'use client';

import React from 'react';
import styled from 'styled-components';

interface ErrorPageProps {
  message?: string;
  onBackClick?: () => void;
  showBackButton?: boolean;
  backButtonText?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
  text-align: center;
`;

const ErrorMessage = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  color: ${props => props.theme.colors.textGray};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const BackButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textWhite};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.typography.fontSizes.base};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }
`;

const ErrorPage: React.FC<ErrorPageProps> = ({
  message = '오류가 발생했습니다.',
  onBackClick,
  showBackButton = true,
  backButtonText = '돌아가기',
}) => {
  return (
    <Container>
      <ErrorMessage>{message}</ErrorMessage>
      {showBackButton && onBackClick && (
        <BackButton onClick={onBackClick}>{backButtonText}</BackButton>
      )}
    </Container>
  );
};

export default ErrorPage;
