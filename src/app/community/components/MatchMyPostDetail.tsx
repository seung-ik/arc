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

interface MatchMyPostDetailProps {
  post: MatchPostData;
}

export default function MatchMyPostDetail({ post }: MatchMyPostDetailProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();
  const deletePostMutation = useDeletePostMutation();

  const handleDelete = () => {
    setShowDeleteModal(true);
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
