'use client';

import styled from 'styled-components';
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

const SectionTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.textBlack};
  margin: ${(props) => props.theme.spacing.lg} 0 ${(props) => props.theme.spacing.sm} 0;
  padding-left: ${(props) => props.theme.spacing.md};
  letter-spacing: -0.5px;
`;

export default function ManagementPage() {
  const registrationModal = useModal();

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
    {
      id: 3,
      opponentId: 'user789',
      sport: '배드민턴',
      result: '승',
      date: '2024-01-13',
      isWin: true,
      myElo: 1335,
      opponentElo: 1300,
    },
    {
      id: 4,
      opponentId: 'user202',
      sport: '테니스',
      result: '패',
      date: '2024-01-12',
      isWin: false,
      myElo: 1290,
      opponentElo: 1325,
    },
    {
      id: 5,
      opponentId: 'user303',
      sport: '당구',
      result: '승',
      date: '2024-01-11',
      isWin: true,
      myElo: 1340,
      opponentElo: 1295,
    },
  ];

  const handleAccept = (matchId: number) => {
    console.log('Accept match:', matchId);
  };

  const handleReject = (matchId: number, reason?: string) => {
    console.log('Reject match:', matchId, reason);
  };

  return (
    <Container>
      <EloTabCards />
      <Header>
        <RegisterButton onClick={registrationModal.openModal}>매치결과 등록</RegisterButton>
      </Header>
      <ContentContainer>
        <SectionTitle>등록된 결과요청</SectionTitle>
        <MatchManagement
          matches={receivedMatches}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      </ContentContainer>
      <MatchRegistrationModal
        isOpen={registrationModal.isOpen}
        onClose={registrationModal.closeModal}
      />
      <BottomNavigation />
    </Container>
  );
}
