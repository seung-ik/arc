'use client';

import styled from 'styled-components';
import LoadingIndicator from './LoadingIndicator';
import React from 'react';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.background};
`;

const Content = styled.div`
  flex: 1;
`;

const FullPageLoading: React.FC = () => (
  <Container>
    <Content>
      <LoadingIndicator />
    </Content>
  </Container>
);

export default FullPageLoading;
