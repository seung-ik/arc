'use client';

import styled from 'styled-components';
import { useState, useEffect } from 'react';

import { useModal } from '@/hooks/useModal';
import MatchRegistrationModal from '@/components/MatchRegistrationModal';
import MatchManagement from '@/components/MatchManagement';
import EloTabCards from '@/components/EloTabCards';
import AdBanner from '@/components/AdBanner';
import MatchPostCard from '@/components/MatchPostCard';
import { useRouter } from 'next/navigation';
import { MatchPost } from '@/types/post';
import PendingMatchCard from '@/components/PendingMatchCard';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.background};
  position: relative;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
`;

const Header = styled.div`
  padding: ${props => props.theme.spacing.lg};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: ${props => props.theme.spacing.lg};
`;

const RegisterButton = styled.button`
  background: #111;
  color: #fff;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background 0.2s;
  min-width: 280px;

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
  overflow-y: auto;

  @media (min-width: 1200px) {
    min-width: 1100px;
    max-width: 1100px;
    padding-top: ${props => props.theme.spacing.md};
  }
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.textBlack};
  margin: ${props => props.theme.spacing.lg} 0
    ${props => props.theme.spacing.sm} 0;
  padding-left: ${props => props.theme.spacing.md};
  letter-spacing: -0.5px;
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
  const router = useRouter();
  const registrationModal = useModal();
  const [pendingMatches, setPendingMatches] = useState<PendingMatch[]>([]);

  // 30초 후 대기 중인 매치 제거
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setPendingMatches(
        prev => prev.filter(match => now - match.createdAt < 30000) // 30초 = 30000ms
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
  ];

  const handleAccept = (matchId: number) => {
    console.log('Accept match:', matchId);
  };

  const handleReject = (matchId: number, reason?: string) => {
    console.log('Reject match:', matchId, reason);
  };

  // 추천매치 데이터를 Post 형식으로 변환
  const recommendedMatchPosts = [
    {
      id: 1,
      title: '테니스 매칭 구합니다',
      content:
        '테니스 실력 향상을 위해 매칭을 구합니다. 실력은 무관하고 즐겁게 치실 분 환영합니다.',
      authorId: 'tennis_pro',
      authorName: 'tennis_pro',
      date: '2024-01-10',
      postType: '매치',
      category: 'tennis',
      matchLocation: '서울 강남구 테니스장',
      myElo: '1350',
      preferredElo: 'similar',
      validityPeriod: '7',
      viewCount: 45,
      commentCount: 12,
      likeCount: 28,
      dislikeCount: 1,
      isLiked: true,
      isDisliked: false,
    },
    {
      id: 2,
      title: '체스 친선 대국 상대',
      content:
        '체스 친선 대국 상대를 구합니다. 실력에 관계없이 즐겁게 두실 분 환영합니다.',
      authorId: 'chess_master',
      authorName: 'chess_master',
      date: '2024-01-12',
      postType: '매치',
      category: 'chess',
      matchLocation: '서울 서초구 체스클럽',
      myElo: '1420',
      preferredElo: 'any',
      validityPeriod: '3',
      viewCount: 32,
      commentCount: 8,
      likeCount: 34,
      dislikeCount: 0,
      isLiked: false,
      isDisliked: false,
    },
    {
      id: 3,
      title: '탁구 연습 상대 구합니다',
      content: '탁구 연습 상대를 구합니다. 초급부터 중급까지 환영합니다.',
      authorId: 'ping_pong_king',
      authorName: 'ping_pong_king',
      date: '2024-01-14',
      postType: '매치',
      category: 'table-tennis',
      matchLocation: '서울 강남구 탁구장',
      myElo: '1280',
      preferredElo: 'similar',
      validityPeriod: '1',
      viewCount: 28,
      commentCount: 6,
      likeCount: 42,
      dislikeCount: 1,
      isLiked: false,
      isDisliked: false,
    },
    {
      id: 4,
      title: '배드민턴 매칭 구합니다',
      content:
        '배드민턴 동호인과 함께 치고 싶습니다. 실력은 비슷하거나 조금 높은 분이면 좋겠어요.',
      authorId: 'badminton_ace',
      authorName: 'badminton_ace',
      date: '2024-01-11',
      postType: '매치',
      category: 'badminton',
      matchLocation: '서울 송파구 배드민턴장',
      myElo: '1380',
      preferredElo: 'higher',
      validityPeriod: '5',
      viewCount: 38,
      commentCount: 15,
      likeCount: 34,
      dislikeCount: 0,
      isLiked: false,
      isDisliked: false,
    },
  ];

  const handleChallenge = (matchId: number) => {
    router.push(`/community/post/${matchId}?type=match`);
  };

  const handleMatchRegistration = (matchData: {
    sport: string;
    opponentId: string;
    result: '승' | '패';
    isHandicap: boolean;
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

    setPendingMatches(prev => [newPendingMatch, ...prev]);
  };

  return (
    <Container>
      <EloTabCards />
      <Header>
        <RegisterButton onClick={registrationModal.openModal}>
          매치결과 등록
        </RegisterButton>
      </Header>
      <ContentContainer>
        {pendingMatches.length > 0 && (
          <>
            <SectionTitle>내가 보낸 요청</SectionTitle>
            {pendingMatches.map(match => (
              <PendingMatchCard match={match} key={match.id} />
            ))}
          </>
        )}

        {receivedMatches.length > 0 && (
          <>
            <SectionTitle>나에게 온 요청</SectionTitle>
            <MatchManagement
              matches={receivedMatches}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          </>
        )}

        <SectionTitle>추천매치</SectionTitle>
        {recommendedMatchPosts.map((post, index) => (
          <div key={post.id}>
            <MatchPostCard post={post as MatchPost} onClick={handleChallenge} />
            {index === 1 && (
              <AdBanner
                title="프리미엄 구장 할인"
                description="전용 코트에서 실력 향상! 20% 할인된 가격으로 이용하세요"
                badge="할인"
                onClick={() => console.log('구장 예약 클릭')}
              />
            )}
          </div>
        ))}
      </ContentContainer>
      <MatchRegistrationModal
        isOpen={registrationModal.isOpen}
        onClose={registrationModal.closeModal}
        onSubmit={handleMatchRegistration}
      />
    </Container>
  );
}
