'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNavigation from '@/components/BottomNavigation';
import MatchHistory from '@/components/MatchHistory';
import MatchManagement from '@/components/MatchManagement';
import EloTabCards from '@/components/EloTabCards';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.background};
  padding-bottom: 80px;
  position: relative;
`;

const ContentContainer = styled.div`
  padding: ${(props) => props.theme.spacing.md};
  flex: 1;
  overflow-y: auto;
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

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<'management' | 'history'>('history');
  const router = useRouter();

  // 목업 데이터
  const historyMatches = [
    {
      id: 3,
      opponentId: 'user789',
      sport: '배드민턴',
      result: '승',
      date: '2024-01-10',
      eloChange: '+15',
      beforeElo: 1305,
      afterElo: 1320,
    },
    {
      id: 4,
      opponentId: 'user101',
      sport: '당구',
      result: '패',
      date: '2024-01-08',
      eloChange: '-12',
      beforeElo: 1320,
      afterElo: 1308,
    },
    {
      id: 5,
      opponentId: 'user202',
      sport: '탁구',
      result: '승',
      date: '2024-01-05',
      eloChange: '+8',
      beforeElo: 1308,
      afterElo: 1316,
    },
    {
      id: 6,
      opponentId: 'user303',
      sport: '체스',
      result: '패',
      date: '2024-01-03',
      eloChange: '-5',
      beforeElo: 1316,
      afterElo: 1311,
    },
  ];

  const receivedMatches = [
    {
      id: 1,
      opponentId: 'user123',
      sport: '탁구',
      result: '승',
      date: '2024-01-15',
      isWin: true,
    },
    {
      id: 2,
      opponentId: 'user456',
      sport: '체스',
      result: '패',
      date: '2024-01-14',
      isWin: false,
    },
  ];

  const handleAccept = (matchId: number) => {
    console.log('Accept match:', matchId);
  };

  const handleReject = (matchId: number) => {
    console.log('Reject match:', matchId);
  };

  const handleTabChange = (tab: 'management' | 'history') => {
    setActiveTab(tab);
    if (tab === 'management') {
      router.push('/elo/management');
    }
  };

  return (
    <Container>
      <EloTabCards />
      <ContentContainer>
        <MatchHistory matches={historyMatches} />
      </ContentContainer>
      <BottomNavigation />
    </Container>
  );
}
