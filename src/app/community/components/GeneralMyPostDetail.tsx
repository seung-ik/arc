'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PostHeader from '@/app/community/components/PostHeader';
import {
  Container,
  Content,
  PostContent,
  ManagementSection,
  ManagementTitle,
  ManagementButtons,
  ManagementButton,
} from '@/styles/PostDetailStyles';
import { GeneralPostData } from '@/types/post';
import Comments from '@/app/community/components/Comments';
import { useDeletePostMutation } from '@/api/useCommunity';
import HtmlContent from '@/components/inputs/HtmlContent';
import PostActions from '@/app/community/components/PostActions';
import TwoButtonModal from '@/components/modals/TwoButtonModal';

interface GeneralMyPostDetailProps {
  post: GeneralPostData;
}

export default function GeneralMyPostDetail({
  post,
}: GeneralMyPostDetailProps) {
  const router = useRouter();
  const deletePostMutation = useDeletePostMutation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deletePostMutation.mutate(post.id, {
      onSuccess: () => {
        console.log('글 삭제 성공');
        router.back(); // 이전 페이지로 돌아가기
      },
      onError: error => {
        console.error('글 삭제 실패:', error);
        alert('글 삭제에 실패했습니다.');
      },
    });
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
          viewCount={post.viewCount}
        />

        <PostContent>
          <HtmlContent content={post.content} />
        </PostContent>

        <PostActions post={post} />

        <Comments postId={post.id} commentCount={post.commentCount} />
        <ManagementSection>
          <ManagementTitle>게시글 관리</ManagementTitle>
          <ManagementButtons>
            <ManagementButton onClick={handleDelete} $variant="delete">
              삭제
            </ManagementButton>
          </ManagementButtons>
        </ManagementSection>
      </Content>

      <TwoButtonModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="게시글 삭제"
        content="정말로 이 글을 삭제하시겠습니까?"
        cancelText="취소"
        confirmText="삭제"
        onSubmit={handleConfirmDelete}
        isLoading={deletePostMutation.isPending}
      />
    </Container>
  );
}
