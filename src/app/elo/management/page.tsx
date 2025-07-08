'use client';

import styled from 'styled-components';
import { useState, useEffect } from 'react';
import BottomNavigation from '@/components/BottomNavigation';
import { useModal } from '@/hooks/useModal';
import MatchRegistrationModal from '@/components/MatchRegistrationModal';
import MatchManagement from '@/components/MatchManagement';
import EloTabCards from '@/components/EloTabCards';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.background};
  padding-bottom: 80px;
  position: relative;
  align-items: center;
  padding: ${(props) => props.theme.spacing.md};
`;

const Header = styled.div`
  padding: ${(props) => props.theme.spacing.lg};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RegisterButton = styled.button`
  background: #111;
  color: #fff;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.md} ${(props) => props.theme.spacing.xl};
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background 0.2s;
  min-width: 200px;

  &:hover {
    background: #222;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  width: 100%;

  @media (min-width: 1200px) {
    min-width: 1100px;
    max-width: 1100px;
    padding-top: ${(props) => props.theme.spacing.md};
  }
`;

const TabContainer = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  padding: ${(props) => props.theme.spacing.md} 0;
`;

const TabList = styled.div`
  display: flex;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.md};
`;

const TabItem = styled.div`
  flex: 1;
  max-width: 200px;
`;

const TabButton = styled.button<{ $isActive: boolean }>`
  width: 100%;
  background-color: ${(props) => (props.$isActive ? props.theme.colors.primary : 'transparent')};
  color: ${(props) =>
    props.$isActive ? props.theme.colors.textWhite : props.theme.colors.textBlack};
  border: 1px solid
    ${(props) => (props.$isActive ? props.theme.colors.primary : props.theme.colors.border)};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.md};
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) =>
      props.$isActive ? props.theme.colors.primaryHover : props.theme.colors.background};
  }
`;

const SectionTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.textBlack};
  margin: ${(props) => props.theme.spacing.lg} 0 ${(props) => props.theme.spacing.sm} 0;
  padding-left: ${(props) => props.theme.spacing.md};
  letter-spacing: -0.5px;
`;

const LoadingBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${(props) => props.theme.colors.border};
  border-radius: 2px;
  overflow: hidden;
  margin-top: ${(props) => props.theme.spacing.sm};
`;

const LoadingProgress = styled.div`
  height: 100%;
  background: linear-gradient(
    90deg,
    ${(props) => props.theme.colors.primary},
    ${(props) => props.theme.colors.primaryHover}
  );
  border-radius: 2px;
  animation: loading 2s ease-in-out infinite;

  @keyframes loading {
    0% {
      width: 0%;
      margin-left: 0%;
    }
    50% {
      width: 100%;
      margin-left: 0%;
    }
    100% {
      width: 0%;
      margin-left: 100%;
    }
  }
`;

const PendingMatchCard = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.md};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const PendingMatchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const PendingMatchInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
`;

const PendingOpponentId = styled.span`
  font-weight: 600;
  color: ${(props) => props.theme.colors.textBlack};
`;

const PendingSportBadge = styled.span`
  background-color: ${(props) => props.theme.colors.secondary};
  color: white;
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
`;

const PendingStatus = styled.span`
  color: ${(props) => props.theme.colors.primary};
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: 600;
`;

const PendingResult = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const PendingResultBadge = styled.span<{ $isWin: boolean }>`
  background-color: ${(props) => (props.$isWin ? '#28a745' : '#dc3545')};
  color: white;
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: 600;
`;

const PendingDate = styled.span`
  color: ${(props) => props.theme.colors.textGray};
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
`;

interface PendingMatch {
  id: number;
  opponentId: string;
  sport: string;
  result: string;
  date: string;
  isWin: boolean;
  myElo: number;
  opponentElo: number;
  createdAt: number;
}

export default function ManagementPage() {
  const registrationModal = useModal();
  const [pendingMatches, setPendingMatches] = useState<PendingMatch[]>([]);

  // 30초 후 대기 중인 매치 제거
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setPendingMatches(
        (prev) => prev.filter((match) => now - match.createdAt < 30000), // 30초 = 30000ms
      );
    }, 1000); // 1초마다 체크

    return () => clearInterval(interval);
  }, []);

  // 목업 데이터
  const receivedMatches = [
    {
      id: 1,
      opponentId: 'user123',
      sport: '탁구',
      result: '승',
      date: '2024-01-15',
      isWin: true,
      myElo: 1320,
      opponentElo: 1280,
    },
    {
      id: 2,
      opponentId: 'user456',
      sport: '체스',
      result: '패',
      date: '2024-01-14',
      isWin: false,
      myElo: 1310,
      opponentElo: 1350,
    },
  ];

  const handleAccept = (matchId: number) => {
    console.log('Accept match:', matchId);
  };

  const handleReject = (matchId: number, reason?: string) => {
    console.log('Reject match:', matchId, reason);
  };

  const handleMatchRegistration = (matchData: {
    sport: string;
    opponentId: string;
    result: '승' | '패';
  }) => {
    // 새로운 대기 중인 매치 추가
    const newPendingMatch: PendingMatch = {
      id: Date.now(), // 임시 ID
      opponentId: matchData.opponentId,
      sport: matchData.sport,
      result: matchData.result,
      date: new Date().toISOString().split('T')[0],
      isWin: matchData.result === '승',
      myElo: 1300, // 임시 값
      opponentElo: 1300, // 임시 값
      createdAt: Date.now(), // 생성 시간 추가
    };

    setPendingMatches((prev) => [newPendingMatch, ...prev]);
  };

  return (
    <Container>
      <EloTabCards />
      <Header>
        <RegisterButton onClick={registrationModal.openModal}>매치결과 등록</RegisterButton>
      </Header>
      <ContentContainer>
        {pendingMatches.length > 0 && (
          <>
            <SectionTitle>내가 보낸 요청</SectionTitle>
            {pendingMatches.map((match) => (
              <PendingMatchCard key={match.id}>
                <PendingMatchHeader>
                  <PendingMatchInfo>
                    <PendingOpponentId>{match.opponentId}</PendingOpponentId>
                    <PendingSportBadge>{match.sport}</PendingSportBadge>
                  </PendingMatchInfo>
                  <PendingStatus>대기중</PendingStatus>
                </PendingMatchHeader>

                <PendingResult>
                  <PendingResultBadge $isWin={match.isWin}>{match.result}</PendingResultBadge>
                  <PendingDate>{match.date}</PendingDate>
                </PendingResult>

                <LoadingBar>
                  <LoadingProgress />
                </LoadingBar>
              </PendingMatchCard>
            ))}
          </>
        )}

        <SectionTitle>나에게 온 요청</SectionTitle>
        <MatchManagement
          matches={receivedMatches}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      </ContentContainer>
      <MatchRegistrationModal
        isOpen={registrationModal.isOpen}
        onClose={registrationModal.closeModal}
        onSubmit={handleMatchRegistration}
      />
      <BottomNavigation />
    </Container>
  );
}
