'use client';

import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.background};
  gap: ${(props) => props.theme.spacing.xl};
`;

const Title = styled.h1`
  color: ${(props) => props.theme.colors.textBlack};
  font-size: ${(props) => props.theme.typography.fontSizes['3xl']};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
`;

const Subtitle = styled.p`
  color: ${(props) => props.theme.colors.textGray};
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  font-weight: ${(props) => props.theme.typography.fontWeights.normal};
`;

const ColorExample = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
`;

const ColorBox = styled.div<{ bgColor: string; textColor: string }>`
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.textColor};
  padding: ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  min-width: 120px;
  text-align: center;
`;

export default function ColorsPage() {
  return (
    <Container>
      <Title>Colors Page</Title>
      <Subtitle>테마 색상 예시</Subtitle>
      <ColorExample>
        <ColorBox bgColor="#0070f3" textColor="#ffffff">
          Primary
        </ColorBox>
        <ColorBox bgColor="#6c757d" textColor="#ffffff">
          Secondary
        </ColorBox>
        <ColorBox bgColor="#28a745" textColor="#ffffff">
          Success
        </ColorBox>
        <ColorBox bgColor="#dc3545" textColor="#ffffff">
          Error
        </ColorBox>
        <ColorBox bgColor="#f8f9fa" textColor="#000000">
          Background Gray
        </ColorBox>
        <ColorBox bgColor="#e1e1e1" textColor="#000000">
          Border
        </ColorBox>
      </ColorExample>
    </Container>
  );
}
