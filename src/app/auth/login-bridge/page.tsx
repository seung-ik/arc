'use client';

import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 20px;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 600;
`;

export default function LoginBridgePage() {
  return (
    <Container>
      <LoginCard>
        <Title>로그인 브리지</Title>
      </LoginCard>
    </Container>
  );
}
