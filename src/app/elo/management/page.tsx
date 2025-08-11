'use client';

import styled from 'styled-components';

import { useModal } from '@/hooks/useModal';
import MatchRegistrationModal from '@/components/MatchRegistrationModal';
import EloTabCards from '../components/EloTabCards';
import AdBanner from '@/components/AdBanner';
import MatchCard from '../components/MatchCard';
import { useRouter } from 'next/navigation';
import { MatchPost } from '@/types/post';
import Image from 'next/image';
import { ICONS } from '@/assets';
import MatchRequestTabs from '@/components/MatchRequestTabs';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.background};
  position: relative;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
`;

const RegisterWrapper = styled.div`
  position: fixed;
  width: 100%;
  max-width: 768px;
  height: calc(100vh - 62px);
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  pointer-events: none;
`;

const RegisterButton = styled.button`
  position: absolute;
  bottom: 12px;
  right: 16px;
  pointer-events: auto; /* 클릭 이벤트를 받음 */

  display: flex;
  gap: ${props => props.theme.spacing.xs};
  align-items: center;

  background: #111;
  color: #fff;
  border: none;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background 0.2s;

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

export default function ManagementPage() {
  const router = useRouter();
  const registrationModal = useModal();

  // 목업 데이터
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

  return (
    <Container>
      <EloTabCards />
      <AdBanner
        title="기록은 온라인에, 경험은 오프라인에."
        description={`기록은 당신의 이야기를 남기고,\n보상은 더 넓은 경험으로 이어집니다.`}
        badge="할인"
        onClick={() => alert('구장 예약 클릭')}
      />

      <ContentContainer>
        <MatchRequestTabs />

        <SectionTitle>추천매치</SectionTitle>
        {recommendedMatchPosts.map(post => (
          <div key={post.id}>
            <MatchCard
              post={post as unknown as MatchPost}
              onClick={handleChallenge}
            />
          </div>
        ))}
      </ContentContainer>

      <RegisterWrapper>
        <RegisterButton onClick={registrationModal.openModal}>
          <Image src={ICONS.PLUS} alt="plus" width={20} height={20} />
          <span>결과 등록</span>
        </RegisterButton>
      </RegisterWrapper>

      <MatchRegistrationModal
        isOpen={registrationModal.isOpen}
        onClose={registrationModal.closeModal}
      />
    </Container>
  );
}
