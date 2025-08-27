'use client';

import { useMemo } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useLeaderboardStore } from '@/stores/leaderboardStore';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

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
  background: white;
  border: 1px solid ${props => props.theme.colors.border || '#e5e7eb'};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: ${props => props.theme.spacing.sm};
  min-height: 72px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
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

const InfoCardButton = styled(InfoCard)`
  cursor: pointer;
  background: ${props => props.theme.colors.primary};
  color: white;
  border-color: ${props => props.theme.colors.primary};

  &:hover {
    background: ${props =>
      props.theme.colors.primaryDark || props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  ${CardLabel}, ${CardValue}, ${SubText} {
    color: white;
  }
`;

export default function MySummaryCards() {
  const { userElos } = useAuthStore();
  const { currentSport } = useLeaderboardStore();

  // useMemo로 최적화하고 의존성 명확하게 설정
  const currentTabElo = useMemo(() => {
    if (!currentSport || !userElos || userElos.length === 0) {
      return { eloPoint: '-', tier: '-', percentile: '-' };
    }
    return userElos.find(el => el.sportCategory.id === currentSport.id);
  }, [currentSport, userElos]);

  console.log(currentTabElo, currentSport);

  // Optionally, remove or comment out the debug log if not needed
  // console.log(userElos, currentSport);

  return (
    <CardsRow>
      <InfoCard>
        <CardHeader>
          <DotIcon $color={theme.colors.error} />
          <CardLabel>현재 ELO</CardLabel>
        </CardHeader>
        <CardValue>{currentTabElo?.eloPoint}</CardValue>
        <SubText>최근 +12 · 40경기</SubText>
      </InfoCard>

      <InfoCard>
        <CardHeader>
          <DotIcon $color={theme.colors.secondary} />
          <CardLabel>내 티어</CardLabel>
        </CardHeader>
        <CardValue>{currentTabElo?.tier}</CardValue>
        <SubText>상위 {currentTabElo?.percentile}%</SubText>
      </InfoCard>

      <InfoCard>
        <CardHeader>
          <DotIcon $color={theme.colors.info} />
          <CardLabel>내 활동</CardLabel>
        </CardHeader>
        <CardValue>전적/NFT</CardValue>
        <SubText>탭하여 상세 보기</SubText>
      </InfoCard>
    </CardsRow>
  );
}
