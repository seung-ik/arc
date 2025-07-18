'use client';

import styled from 'styled-components';
import {
  GameType,
  GameStat,
  GAME_NAMES,
  GAME_ICONS,
} from '@/constants/gameTypes';

interface GameStatCardProps {
  gameType: GameType;
  gameStat: GameStat;
}

const Card = styled.div<{ $isActive: boolean }>`
  background: ${props =>
    props.$isActive
      ? props.theme.colors.background
      : props.theme.colors.backgroundGray};
  border: 1px solid
    ${props =>
      props.$isActive
        ? props.theme.colors.border
        : props.theme.colors.borderLight};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  opacity: ${props => (props.$isActive ? 1 : 0.6)};

  &:hover {
    transform: ${props => (props.$isActive ? 'translateY(-2px)' : 'none')};
    box-shadow: ${props =>
      props.$isActive ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none'};
  }
`;

const GameIcon = styled.div`
  font-size: 24px;
  margin-bottom: 4px;
`;

const GameName = styled.h3<{ $isActive: boolean }>`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props =>
    props.$isActive
      ? props.theme.colors.textBlack
      : props.theme.colors.textLightGray};
  margin: 0;
  text-align: center;
`;

const EloScore = styled.div<{ $isActive: boolean }>`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props =>
    props.$isActive
      ? props.theme.colors.textBlack
      : props.theme.colors.textLightGray};
`;

const Percentile = styled.div<{ $isActive: boolean }>`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props =>
    props.$isActive
      ? props.theme.colors.textGray
      : props.theme.colors.textLightGray};
  text-align: center;
`;

const InactiveText = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.textLightGray};
  text-align: center;
  font-style: italic;
`;

export default function GameStatCard({
  gameType,
  gameStat,
}: GameStatCardProps) {
  const { isActive, elo, percentile } = gameStat;

  return (
    <Card $isActive={isActive}>
      <GameIcon>{GAME_ICONS[gameType]}</GameIcon>
      <GameName $isActive={isActive}>{GAME_NAMES[gameType]}</GameName>

      {isActive ? (
        <>
          <EloScore $isActive={isActive}>{elo.toLocaleString()}</EloScore>
          <Percentile $isActive={isActive}>상위 {percentile}%</Percentile>
        </>
      ) : (
        <>
          <EloScore $isActive={isActive}>---</EloScore>
          <InactiveText>(플레이하지 않음)</InactiveText>
        </>
      )}
    </Card>
  );
}
