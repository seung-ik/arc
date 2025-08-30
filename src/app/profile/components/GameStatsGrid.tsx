'use client';

import styled from 'styled-components';
import { UserElo } from '@/api/useUser';
import GameStatCard from './GameStatCard';
import { SportOption, useCommunityStore } from '@/stores/communityStore';

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
const convertUserElosToObject = (
  userElos: UserElo[],
  sportOptions: SportOption[]
) => {
  const userElosObject: Record<
    number,
    {
      name: string;
      eloPoint: number | null;
      percentile: string | null;
      tier: string | null;
      sportId?: number;
    }
  > = {};

  console.log(sportOptions);

  // 먼저 sportOptions의 모든 스포츠를 기본값으로 초기화
  sportOptions.forEach(sportOption => {
    userElosObject[sportOption.value] = {
      name: sportOption.label,
      eloPoint: null,
      percentile: null,
      tier: null,
      sportId: sportOption.value,
    };
  });

  // userElos에 있는 데이터로 덮어쓰기
  if (userElos && userElos.length > 0) {
    userElos.forEach(userElo => {
      if (userElo && userElo.sportCategory) {
        userElosObject[userElo.sportCategory.id] = {
          name: userElo.sportCategory.name,
          eloPoint: userElo.eloPoint,
          percentile: userElo.percentile,
          tier: userElo.tier,
          sportId: userElo.sportCategory.id,
        };
      }
    });
  }

  return userElosObject;
};

interface GameStatsGridProps {
  userElos: UserElo[];
}

export default function GameStatsGrid({ userElos }: GameStatsGridProps) {
  const { sportOptions, communityTabs } = useCommunityStore();
  const userElosObject = convertUserElosToObject(userElos, sportOptions);
  console.log(sportOptions, communityTabs);

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
