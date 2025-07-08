'use client';

import styled from 'styled-components';
import { GAME_TYPES, GameType, GameStat } from '@/constants/gameTypes';
import GameStatCard from './GameStatCard';

interface GameStatsGridProps {
  gameStats: Record<GameType, GameStat>;
}

const GridContainer = styled.div`
  padding: 16px;
`;

const GridTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.textBlack};
  margin: 0 0 16px 0;
  padding-left: 4px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
`;

export default function GameStatsGrid({ gameStats }: GameStatsGridProps) {
  return (
    <GridContainer>
      <GridTitle>종목별 ELO</GridTitle>
      <Grid>
        {Object.values(GAME_TYPES).map((gameType) => (
          <GameStatCard key={gameType} gameType={gameType} gameStat={gameStats[gameType]} />
        ))}
      </Grid>
    </GridContainer>
  );
}
