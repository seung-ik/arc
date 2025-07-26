'use client';

import styled from 'styled-components';
const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  max-width: 768px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  background: rgb(255, 255, 255);
`;

const ContentWrapper = styled.div`
  flex: 1;
`;

export default function TokenHistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutContainer>
      <ContentWrapper>{children}</ContentWrapper>
    </LayoutContainer>
  );
}
