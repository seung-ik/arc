'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TwoButtonModal from '@/components/TwoButtonModal';

interface ProfilePost {
  id: number;
  title: string;
  content: string;
  category: string;
  date: string;
  viewCount: number;
  commentCount: number;
  showInProfile: boolean;
}

interface ProfilePostListProps {
  posts: ProfilePost[];
  isMyProfile: boolean;
  onToggleVisibility?: (postId: number, showInProfile: boolean) => void;
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

const CategoryBadge = styled.span`
  background-color: ${(props) => props.theme.colors.primaryLight};
  color: ${(props) => props.theme.colors.primary};
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
  gap: ${(props) => props.theme.spacing.md};
`;

const StatItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ToggleSwitch = styled.button<{ $isOn: boolean }>`
  position: relative;
  width: 44px;
  height: 24px;
  background-color: ${(props) =>
    props.$isOn ? props.theme.colors.success : props.theme.colors.textLightGray};
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${(props) => (props.$isOn ? '22px' : '2px')};
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &:hover {
    opacity: 0.8;
  }

  &:active::after {
    width: 22px;
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
}: ProfilePostListProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [modalAction, setModalAction] = useState<'show' | 'hide'>('show');

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

  const filteredPosts = isMyProfile ? posts : posts.filter((post) => post.showInProfile);

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
                <PostTitle>{post.title}</PostTitle>
                <CategoryBadge>{post.category}</CategoryBadge>
              </PostTitleSection>

              {isMyProfile && (
                <ToggleSwitch
                  $isOn={post.showInProfile}
                  onClick={(e) => handleToggleVisibility(e, post.id, post.showInProfile)}
                />
              )}
            </PostHeader>

            <PostContent>{post.content}</PostContent>

            <PostFooter>
              <PostDate>{post.date}</PostDate>

              <PostStats>
                <StatItem>👁️ {post.viewCount}</StatItem>
                <StatItem>💬 {post.commentCount}</StatItem>
              </PostStats>
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
