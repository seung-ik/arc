'use client';

import styled from 'styled-components';

interface GameStatCardProps {
  data: {
    name: string;
    eloPoint: number;
    percentile: string;
    tier: string;
  };
}

const Card = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const GameIcon = styled.div`
  font-size: 24px;
  margin-bottom: 4px;
`;

const GameName = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.textBlack};
  margin: 0;
  text-align: center;
`;

const EloScore = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.textBlack};
`;

const Percentile = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.textGray};
  text-align: center;
`;

// 종목별 아이콘 매핑
const getGameIcon = (gameName: string): string => {
  const name = gameName.toLowerCase();

  if (name.includes('테니스')) return '🎾';
  if (name.includes('배드민턴')) return '🏸';
  if (name.includes('탁구') || name.includes('table')) return '🏓';
  if (name.includes('당구') || name.includes('billiards')) return '🎱';
  if (name.includes('체스')) return '♟️';
  if (name.includes('바둑') || name.includes('go')) return '⚫';

  return '🏆'; // 기본 아이콘
};

export default function GameStatCard({ data }: GameStatCardProps) {
  const { name, eloPoint, percentile, tier } = data;

  return (
    <Card>
      <GameIcon>{getGameIcon(name)}</GameIcon>
      <GameName>{name}</GameName>

      <EloScore>{eloPoint.toLocaleString()}</EloScore>
      <Percentile>
        상위 {percentile}% ({tier})
      </Percentile>
    </Card>
  );
}
