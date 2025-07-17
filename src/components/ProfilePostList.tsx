'use client';

import styled from 'styled-components';
import { useState, useMemo } from 'react';
import TwoButtonModal from '@/components/TwoButtonModal';

export interface ProfilePost {
  id: number;
  title: string;
  content: string;
  postType: string;
  category: string;
  date: string;
  viewCount: number;
  commentCount: number;
  showInProfile: boolean;
  likeCount?: number;
  enableHarvest?: boolean | null; // boolean | null (수확 가능/불가능/완료)
  harvestStage?: number; // 수확 단계 (1, 2, 3, 4...)
}

interface ProfilePostListProps {
  posts: ProfilePost[];
  isMyProfile: boolean;
  onToggleVisibility?: (postId: number, showInProfile: boolean) => void;
  onHarvest?: (postId: number) => void;
}

const PostListContainer = styled.div`
  padding: 16px;
`;

const SectionTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.textBlack};
  margin: 0 0 16px 0;
  padding-left: 4px;
`;

const PostCard = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.md};
  margin-bottom: ${(props) => props.theme.spacing.md};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const PostTitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  flex: 1;
`;

const PostTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.textBlack};
  margin: 0;
  line-height: 1.4;
`;

const PostTypeBadge = styled.span<{ $postType: string }>`
  background-color: ${(props) => {
    switch (props.$postType) {
      case '일반':
        return props.theme.colors.postType.general.background;
      case '매치':
        return props.theme.colors.postType.match.background;
      case '멘토':
        return props.theme.colors.postType.mentor.background;
      case '공지':
        return props.theme.colors.postType.notice.background;
      default:
        return props.theme.colors.primaryLight;
    }
  }};
  color: ${(props) => {
    switch (props.$postType) {
      case '일반':
        return props.theme.colors.postType.general.text;
      case '매치':
        return props.theme.colors.postType.match.text;
      case '멘토':
        return props.theme.colors.postType.mentor.text;
      case '공지':
        return props.theme.colors.postType.notice.text;
      default:
        return props.theme.colors.primary;
    }
  }};
  padding: 2px 8px;
  border-radius: 12px;
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  flex-shrink: 0;
`;

const PostContent = styled.p`
  color: ${(props) => props.theme.colors.textGray};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  margin: 0 0 ${(props) => props.theme.spacing.sm} 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PostFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  color: ${(props) => props.theme.colors.textLightGray};
`;

const PostDate = styled.span`
  color: ${(props) => props.theme.colors.textLightGray};
`;

const PostStats = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const HarvestButton = styled.button<{ $canHarvest: boolean; $stage?: number }>`
  background-color: ${(props) => {
    if (!props.$canHarvest) return '#fff'; // 수확불가: 흰색

    // 단계별 색상
    switch (props.$stage) {
      case 1:
        return '#ffc107'; // 1단계: 노란색
      case 2:
        return '#28a745'; // 2단계: 초록색
      case 3:
        return '#007bff'; // 3단계: 파란색
      case 4:
        return '#6f42c1'; // 4단계: 보라색
      case 5:
        return '#fd7e14'; // 5단계: 주황색
      default:
        return props.theme.colors.success; // 기본: 초록색
    }
  }};
  color: ${(props) =>
    props.$canHarvest
      ? 'white' // 수확가능: 흰색
      : props.theme.colors.textGray}; // 수확불가: 회색
  border: ${(props) =>
    props.$canHarvest
      ? 'none' // 수확가능: 테두리 없음
      : `1.5px solid ${props.theme.colors.textLightGray}`}; // 수확불가: 회색 테두리
  border-radius: ${(props) => props.theme.borderRadius.sm};
  padding: 4px 10px;
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  cursor: ${(props) =>
    props.$canHarvest
      ? 'pointer' // 수확가능: 클릭 가능
      : 'default'}; // 수확불가: 클릭 불가
  transition: all 0.2s;
  white-space: nowrap;
  min-width: 80px;
  text-align: center;

  &:hover {
    background-color: ${(props) => {
      if (!props.$canHarvest) return '#fff';

      // 호버 시 약간 어둡게
      switch (props.$stage) {
        case 1:
          return '#e0a800'; // 1단계: 어두운 노란색
        case 2:
          return '#218838'; // 2단계: 어두운 초록색
        case 3:
          return '#0056b3'; // 3단계: 어두운 파란색
        case 4:
          return '#5a32a3'; // 4단계: 어두운 보라색
        case 5:
          return '#e8690b'; // 5단계: 어두운 주황색
        default:
          return props.theme.colors.success;
      }
    }};
  }

  &:active {
    transform: ${(props) =>
      props.$canHarvest
        ? 'translateY(1px)' // 수확가능: 클릭 효과
        : 'none'}; // 수확불가: 변형 없음
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing.xl};
  color: ${(props) => props.theme.colors.textGray};
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

export default function ProfilePostList({
  posts,
  isMyProfile,
  onToggleVisibility,
  onHarvest,
}: ProfilePostListProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [modalAction, setModalAction] = useState<'show' | 'hide'>('show');
  // 정렬된 게시글 목록: 수확 가능한 것들을 위로, 그 다음 시간순
  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      // 1. 수확 가능한 것들을 위로
      if (a.enableHarvest && !b.enableHarvest) return -1;
      if (!a.enableHarvest && b.enableHarvest) return 1;

      // 2. 수확 가능한 것들 중에서는 단계순 (낮은 단계부터)
      if (a.enableHarvest && b.enableHarvest) {
        const stageA = a.harvestStage || 0;
        const stageB = b.harvestStage || 0;
        if (stageA !== stageB) return stageA - stageB;
      }

      // 3. 수확 가능 여부가 같다면 최신순 (날짜 내림차순)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [posts]);

  // 수확 단계별 텍스트 생성
  const getHarvestText = (post: ProfilePost) => {
    if (post.enableHarvest === true) {
      // 수확 가능할 때만 단계 표시
      switch (post.harvestStage) {
        case 1:
          return '1단계 수확';
        case 2:
          return '2단계 수확';
        case 3:
          return '3단계 수확';
        case 4:
          return '4단계 수확';
        default:
          return '수확하기';
      }
    }

    // 수확 불가능하거나 완료된 경우 좋아요 개수 표시
    return `좋아요 ${post.likeCount || 0}개`;
  };

  const handlePostClick = () => {
    // 게시글 상세 페이지로 이동 (나중에 구현)
    console.log('Post clicked');
  };

  const handleToggleVisibility = (
    e: React.MouseEvent,
    postId: number,
    currentVisibility: boolean,
  ) => {
    e.stopPropagation(); // 게시글 클릭 이벤트와 충돌 방지

    setSelectedPostId(postId);
    setModalAction(currentVisibility ? 'hide' : 'show');
    setModalOpen(true);
  };

  const handleModalConfirm = () => {
    if (selectedPostId !== null) {
      const newVisibility = modalAction === 'show';
      onToggleVisibility?.(selectedPostId, newVisibility);
      setModalOpen(false);
      setSelectedPostId(null);
    }
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    setSelectedPostId(null);
  };

  const handleHarvest = (e: React.MouseEvent, postId: number) => {
    e.stopPropagation();
    onHarvest?.(postId);
  };

  const getModalContent = () => {
    if (modalAction === 'show') {
      return (
        <div>
          <p>이 글을 프로필에 노출하시겠습니까?</p>
          <br />
          <p>• 1토큰이 소각됩니다</p>
          <p>• 등록된 글은 상대가 내 프로필을 통해 확인할 수 있게 됩니다</p>
        </div>
      );
    } else {
      return (
        <div>
          <p>이 글을 프로필에서 숨기시겠습니까?</p>
          <br />
          <p>• 숨긴 글은 다른 사용자에게 보이지 않습니다</p>
          <p>• 다시 노출하려면 1토큰이 추가로 소각됩니다</p>
        </div>
      );
    }
  };

  const getModalTitle = () => {
    return modalAction === 'show' ? '글을 프로필에 노출하기' : '글을 프로필에서 숨기기';
  };

  const getConfirmText = () => {
    return modalAction === 'show' ? '노출하기' : '숨기기';
  };

  const filteredPosts = isMyProfile
    ? sortedPosts
    : sortedPosts.filter((post) => post.showInProfile);

  if (filteredPosts.length === 0) {
    return (
      <PostListContainer>
        <SectionTitle>{isMyProfile ? '내 글' : '작성한 글'}</SectionTitle>
        <EmptyState>
          <EmptyIcon>📝</EmptyIcon>
          <p>{isMyProfile ? '아직 작성한 글이 없습니다' : '프로필에 노출된 글이 없습니다'}</p>
        </EmptyState>
      </PostListContainer>
    );
  }
  return (
    <>
      <PostListContainer>
        <SectionTitle>{isMyProfile ? '내 글' : '작성한 글'}</SectionTitle>
        {filteredPosts.map((post) => (
          <PostCard key={post.id} onClick={handlePostClick}>
            <PostHeader>
              <PostTitleSection>
                <PostTypeBadge $postType={post.postType}>{post.postType}</PostTypeBadge>
                <PostTitle>{post.title}</PostTitle>
                <PostStats>[{post.commentCount}]</PostStats>
              </PostTitleSection>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {isMyProfile && (
                  <HarvestButton
                    $canHarvest={post.enableHarvest === true}
                    $stage={post.harvestStage}
                    onClick={(e) => handleHarvest(e, post.id)}
                    disabled={post.enableHarvest !== true}
                  >
                    {getHarvestText(post)}
                  </HarvestButton>
                )}
              </div>
            </PostHeader>

            <PostContent>{post.content}</PostContent>

            <PostFooter>
              <PostDate>{post.date}</PostDate>
            </PostFooter>
          </PostCard>
        ))}
      </PostListContainer>

      <TwoButtonModal
        isOpen={modalOpen}
        onClose={handleModalCancel}
        title={getModalTitle()}
        content={getModalContent()}
        cancelText="취소"
        confirmText={getConfirmText()}
        onSubmit={handleModalConfirm}
      />
    </>
  );
}
