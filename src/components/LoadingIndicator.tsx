'use client';

import React from 'react';
import styled from 'styled-components';

interface LoadingIndicatorProps {
  message?: string;
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 18px;
  color: #666;
`;

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = '로딩 중...',
}) => <Wrapper>{message}</Wrapper>;

export default LoadingIndicator;
