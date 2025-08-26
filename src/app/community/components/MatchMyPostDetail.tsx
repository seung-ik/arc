'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MatchApplicationStatus from '@/app/community/components/MatchApplicationStatus';
import MatchInfo from './MatchInfo';
import PostHeader from './PostHeader';
import {
  Container,
  Content,
  PostContent,
  ManagementSection,
  ManagementTitle,
  ManagementButtons,
  ManagementButton,
} from '@/styles/PostDetailStyles';
import HtmlContent from '@/components/inputs/HtmlContent';
import { MatchPostData } from '@/types/post';
import { useDeletePostMutation } from '@/api/useCommunity';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import { ROUTES } from '@/constants/routes';
import styled from 'styled-components';
import Image from 'next/image';
import { ICONS } from '@/assets';

interface MatchMyPostDetailProps {
  post: MatchPostData;
}

const CreateChatButton = styled.button`
  background:
    linear-gradient(white, white) padding-box,
    linear-gradient(90deg, #ff6d75 50%, #9c86ff 100%) border-box;
  color: #ff6d75;
  border: 2px solid transparent;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 109, 117, 0.3);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export default function MatchMyPostDetail({ post }: MatchMyPostDetailProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();
  const deletePostMutation = useDeletePostMutation();

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleCreateChat = () => {
    alert('준비중인 기능입니다.');
  };

  const confirmDelete = async () => {
    try {
      await deletePostMutation.mutateAsync(post.id);
      router.push(ROUTES.community.root);
    } catch (error) {
      console.error('매치글 삭제 실패:', error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <Container>
      <Content>
        <PostHeader
          title={post.title}
          authorId={post.author.id}
          authorName={post.author.nickname}
          date={post.createdAt}
          postType={post.type}
        />

        <MatchInfo matchInfo={post.matchInfo} />

        <PostContent>
          <HtmlContent content={post.content} />
        </PostContent>

        <MatchApplicationStatus
          postId={post.id}
          participants={post.participants}
          isMyPost={true}
        />

        <ManagementSection>
          <ManagementTitle>게시글 관리</ManagementTitle>
          <ManagementButtons>
            <CreateChatButton onClick={handleCreateChat}>
              <Image
                src={ICONS.VERYCHAT}
                alt="verychat"
                width={24}
                height={24}
              />
              그룹 채팅방 생성
            </CreateChatButton>
            <ManagementButton onClick={handleDelete} $variant="delete">
              삭제
            </ManagementButton>
          </ManagementButtons>
        </ManagementSection>
      </Content>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <TwoButtonModal
          isOpen={showDeleteModal}
          onClose={cancelDelete}
          title="매치글 삭제"
          content="정말로 이 매치글을 삭제하시겠습니까? 삭제된 글은 복구할 수 없습니다."
          confirmText="삭제"
          cancelText="취소"
          onSubmit={confirmDelete}
          isLoading={deletePostMutation.isPending}
        />
      )}
    </Container>
  );
}
