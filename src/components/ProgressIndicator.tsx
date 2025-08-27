import styled from 'styled-components';
import React from 'react';

interface ProgressIndicatorProps {
  progress: number;
  color: string;
  children: React.ReactNode;
}

const ProgressContainer = styled.div<{ $progress: number; $color: string }>`
  min-width: 80px;
  min-height: 30px;
  border-radius: 20px;
  background: conic-gradient(
    ${props => props.$color} 0deg ${props => props.$progress}deg,
    ${props => props.theme.colors.backgroundGray} ${props => props.$progress}deg
      360deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 8px 16px;

  &::before {
    content: '';
    position: absolute;
    top: 4px;
    left: 4px;
    right: 4px;
    bottom: 4px;
    border-radius: 18px;
    background: ${props => props.theme.colors.background};
  }
`;

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  color,
  children,
}) => {
  return (
    <ProgressContainer $progress={progress} $color={color}>
      {children}
    </ProgressContainer>
  );
};

export default ProgressIndicator;
