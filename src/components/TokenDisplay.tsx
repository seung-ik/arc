'use client';

import styled from 'styled-components';

interface TokenDisplayProps {
  tokens: number;
  harvestableTokens?: number;
  onHarvestAll?: () => void;
  harvestButtonText?: string;
  onViewHistory?: () => void;
}

const TokenContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 14px;
  margin: 0;
  color: ${(props) => props.theme.colors.textWhite};
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
`;

const TokenInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const TokenLabel = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  opacity: 0.9;
`;

const TokenAmount = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const TokenIcon = styled.span`
  font-size: 16px;
`;

const HarvestSection = styled.div`
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border-radius: 12px;
  padding: 14px;
  margin: 0;
  color: ${(props) => props.theme.colors.textWhite};
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
`;

const HarvestInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const HarvestButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 4px 10px;
  color: white;
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const HistoryButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 4px 10px;
  color: white;
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const TokenRow = styled.div`
  display: flex;
  gap: 16px;
  margin: 16px;
`;

const TokenColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  max-width: 400px;
  width: 100%;
  align-self: center;
`;

export default function TokenDisplay({
  tokens,
  harvestableTokens = 0,
  onHarvestAll,
  harvestButtonText = '수확하기',
  onViewHistory,
}: TokenDisplayProps) {
  return (
    <TokenColumn>
      <TokenContainer>
        <TokenInfo>
          <TokenLabel>보유 토큰</TokenLabel>
          <TokenAmount>
            <TokenIcon>🪙</TokenIcon>
            {tokens.toLocaleString()}
          </TokenAmount>
        </TokenInfo>
        {onViewHistory && <HistoryButton onClick={onViewHistory}>내역보기</HistoryButton>}
      </TokenContainer>

      <HarvestSection>
        <HarvestInfo>
          <TokenLabel>수확 가능한 토큰</TokenLabel>
          <TokenAmount>
            <TokenIcon>🌾</TokenIcon>
            {harvestableTokens.toLocaleString()}
          </TokenAmount>
        </HarvestInfo>
        <HarvestButton onClick={onHarvestAll} disabled={harvestableTokens === 0}>
          {harvestButtonText}
        </HarvestButton>
      </HarvestSection>
    </TokenColumn>
  );
}
