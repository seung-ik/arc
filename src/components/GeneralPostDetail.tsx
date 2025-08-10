'use client';

import PostHeader from '@/components/PostHeader';
import PostActions from '@/components/PostActions';
import Comments from '@/app/community/components/Comments';
import { Container, Content, PostContent } from '@/styles/PostDetailStyles';
import { GeneralPost } from '@/types/post';
import HtmlContent from './HtmlContent';

interface GeneralPostDetailProps {
  post: GeneralPost;
}

export default function GeneralPostDetail({ post }: GeneralPostDetailProps) {
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
      </Content>
    </Container>
  );
}
