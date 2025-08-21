'use client';

import MatchApplicationStatus from '@/components/MatchApplicationStatus';
import MatchInfo from '@/components/MatchInfo';
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
import { MatchPostType } from '@/api/useCommunity';
import HtmlContent from './HtmlContent';

interface MatchMyPostDetailProps {
  post: MatchPostType;
}

export default function MatchMyPostDetail({ post }: MatchMyPostDetailProps) {
  console.log(post, 'myDetail');

  const handleDelete = () => {};

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
            <ManagementButton onClick={handleDelete} $variant="edit">
              마감
            </ManagementButton>
          </ManagementButtons>
        </ManagementSection>
      </Content>
    </Container>
  );
}
