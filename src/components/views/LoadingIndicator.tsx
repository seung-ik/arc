'use client';

import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingIndicatorProps {
  message?: string;
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 20px;
`;

const Message = styled.div`
  font-size: 18px;
  color: #666;
  font-weight: 500;
`;

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = '로딩 중...',
}) => (
  <Wrapper>
    <Spinner />
    <Message>{message}</Message>
  </Wrapper>
);

export default LoadingIndicator;
