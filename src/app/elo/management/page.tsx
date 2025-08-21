'use client';

import styled from 'styled-components';

import { useModal } from '@/hooks/useModal';
import MatchRegistrationModal from '@/components/MatchRegistrationModal';
import EloTabCards from '../components/EloTabCards';
import AdBanner from '@/components/AdBanner';
import MatchCard from '../components/MatchCard';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ICONS } from '@/assets';
import MatchRequestTabs from '@/components/MatchRequestTabs';
import { useRecommendedMatchPostsApi, MatchPostItem } from '@/api/useMatch';

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

  // 추천 매치글 데이터 가져오기 (5개, 전체 스포츠 카테고리)
  const {
    data: recommendedPostsData,
    isLoading,
    error,
  } = useRecommendedMatchPostsApi(5);

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

        {isLoading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            추천 매치글을 불러오는 중...
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
            추천 매치글을 불러오는데 실패했습니다.
          </div>
        )}

        {recommendedPostsData?.data?.map((post: MatchPostItem) => (
          <div key={post.id}>
            <MatchCard post={post} onClick={handleChallenge} />
          </div>
        ))}

        {!isLoading && recommendedPostsData?.data?.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            추천할 매치글이 없습니다.
          </div>
        )}
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
