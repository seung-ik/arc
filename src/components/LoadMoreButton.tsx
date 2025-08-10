import React from 'react';
import styled from 'styled-components';

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

const Button = styled.button<{ isLoading?: boolean }>`
  width: 85%;
  padding: 12px 24px;
  background-color: ${props =>
    props.isLoading ? props.theme.colors.gray : props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: ${props => (props.isLoading ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${props =>
      props.isLoading
        ? props.theme.colors.gray
        : props.theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default function LoadMoreButton({
  onClick,
  isLoading = false,
  disabled = false,
  children,
}: LoadMoreButtonProps) {
  const handleClick = () => {
    if (!isLoading && !disabled) {
      onClick();
    }
  };

  const buttonText = children || (isLoading ? '로딩 중...' : '더보기');

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Button
        onClick={handleClick}
        disabled={isLoading || disabled}
        isLoading={isLoading}
      >
        {buttonText}
      </Button>
    </div>
  );
}
