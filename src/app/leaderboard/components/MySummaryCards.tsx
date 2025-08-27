'use client';

import { useAuthStore } from '@/stores/authStore';
import { useLeaderboardStore } from '@/stores/leaderboardStore';
import styled from 'styled-components';

const CardsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.lg};

  @media (max-width: 360px) {
    gap: ${props => props.theme.spacing.xs};
  }
`;

const InfoCard = styled.div`
  background: ${props => props.theme.colors.secondary};

  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: ${props => props.theme.spacing.sm};
  min-height: 72px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const InfoCardButton = styled(InfoCard)`
  cursor: pointer;
  transition:
    transform 0.1s ease,
    box-shadow 0.1s ease;

  &:active {
    transform: translateY(1px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  margin-bottom: 2px;
`;

const DotIcon = styled.div<{ $color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.$color};
`;

const CardValue = styled.div`
  font-size: clamp(0.95rem, 3.5vw, 1.125rem);
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
`;

const CardLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.primary};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
`;

const SubText = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.primary};
`;

export default function MySummaryCards() {
  const { userElos } = useAuthStore();
  const { currentSport } = useLeaderboardStore();

  // Ensure currentSport is not null before accessing its id
  const currentTabElo = userElos.find(
    el => el.sportCategory.id === currentSport.id
  );

  console.log(currentTabElo);

  // Optionally, remove or comment out the debug log if not needed
  // console.log(userElos, currentSport);

  return (
    <CardsRow>
      <InfoCard>
        <CardHeader>
          <DotIcon $color="#23424A" />
          <CardLabel>현재 ELO</CardLabel>
        </CardHeader>
        <CardValue>{currentTabElo?.eloPoint}</CardValue>
        <SubText>최근 +12 · 40경기</SubText>
      </InfoCard>

      <InfoCard>
        <CardHeader>
          <DotIcon $color="#23424A" />
          <CardLabel>내 순위</CardLabel>
        </CardHeader>
        <CardValue>{currentTabElo?.tier}</CardValue>
        <SubText>상위 {currentTabElo?.percentile}%</SubText>
      </InfoCard>

      <InfoCardButton>
        <CardHeader>
          <DotIcon $color="#23424A" />
          <CardLabel>내 활동</CardLabel>
        </CardHeader>
        <CardValue>전적/NFT</CardValue>
        <SubText>탭하여 상세 보기</SubText>
      </InfoCardButton>
    </CardsRow>
  );
}
