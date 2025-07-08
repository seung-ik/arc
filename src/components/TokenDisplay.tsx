'use client';

import styled from 'styled-components';

interface TokenDisplayProps {
  tokens: number;
}

const TokenContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 16px;
  margin: 16px;
  color: ${(props) => props.theme.colors.textWhite};
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
`;

const TokenLabel = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  opacity: 0.9;
  margin-bottom: 4px;
`;

const TokenAmount = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes['2xl']};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TokenIcon = styled.span`
  font-size: 20px;
`;

export default function TokenDisplay({ tokens }: TokenDisplayProps) {
  return (
    <TokenContainer>
      <TokenLabel>보유 토큰</TokenLabel>
      <TokenAmount>
        <TokenIcon>🪙</TokenIcon>
        {tokens.toLocaleString()}
      </TokenAmount>
    </TokenContainer>
  );
}
