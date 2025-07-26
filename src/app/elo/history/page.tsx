'use client';

import styled from 'styled-components';
import MatchHistory from '@/components/MatchHistory';
import EloTabCards from '@/components/EloTabCards';
import AdBanner from '@/components/AdBanner';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.background};
  position: relative;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
`;

const ContentContainer = styled.div`
  flex: 1;
  width: 100%;
  padding-top: ${props => props.theme.spacing.lg};

  @media (min-width: 1200px) {
    width: 1100px;
    padding: 0;
    padding-top: ${props => props.theme.spacing.md};
  }
`;
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

export default function HistoryPage() {
  const handleAdClick = () => {
    console.log('광고 배너 클릭됨');
    // 실제로는 광고 링크로 이동하거나 모달을 열 수 있음
  };

  return (
    <Container>
      <EloTabCards />
      <ContentContainer>
        <AdBanner
          title="♟️ 체스 대회 참가 신청"
          description="체스 종목 대회에 참가하고 상금을 받아보세요!"
          onClick={handleAdClick}
        />
        <MatchHistory matches={historyMatches} />
      </ContentContainer>
    </Container>
  );
}
