'use client';

import React from 'react';
import styled from 'styled-components';
import LoadingIndicator from '../views/LoadingIndicator';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(1px);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FullPageLoading: React.FC<{ message?: string }> = ({ message }) => (
  <Container>
    <LoadingIndicator message={message} />
  </Container>
);

export default FullPageLoading;
