'use client';

import styled from 'styled-components';
import { useAuthStore } from '@/stores/authStore';
import { UserElo } from '@/api/useUser';
import GameStatCard from './GameStatCard';

const GridContainer = styled.div`
  padding: 16px;
`;

const GridTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.textBlack};
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

// userElos를 ID를 키로 하는 객체로 변환하는 함수
const convertUserElosToObject = (userElos: UserElo[]) => {
  const userElosObject: Record<
    number,
    {
      name: string;
      eloPoint: number;
      percentile: string;
      tier: string;
    }
  > = {};

  userElos.forEach(userElo => {
    userElosObject[userElo.id] = {
      name: userElo.sportCategory.name,
      eloPoint: userElo.eloPoint,
      percentile: userElo.percentile,
      tier: userElo.tier,
    };
  });

  return userElosObject;
};

export default function GameStatsGrid() {
  const { userElos } = useAuthStore();
  const userElosObject = convertUserElosToObject(userElos);

  return (
    <GridContainer>
      <GridTitle>종목별 ELO</GridTitle>
      <Grid>
        {Object.entries(userElosObject).map(([id, data]) => (
          <GameStatCard key={id} data={data} />
        ))}
      </Grid>
    </GridContainer>
  );
}
