'use client';

import { useRouter } from 'next/navigation';
import PostHeader from '@/components/PostHeader';
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
import HtmlContent from './HtmlContent';
import PostActions from './PostActions';

interface GeneralMyPostDetailProps {
  post: GeneralPostData;
}

export default function GeneralMyPostDetail({
  post,
}: GeneralMyPostDetailProps) {
  const router = useRouter();
  const deletePostMutation = useDeletePostMutation();

  const handleDelete = () => {
    if (confirm('정말로 이 글을 삭제하시겠습니까?')) {
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
    }
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
    </Container>
  );
}
