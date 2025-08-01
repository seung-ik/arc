'use client';

import PostHeader from '@/components/PostHeader';
import PostActions from '@/components/PostActions';
import Comments from '@/components/Comments';
import { Container, Content, PostContent } from '@/styles/PostDetailStyles';
import { GeneralPost } from '@/types/post';
import HtmlContent from './HtmlContent';

interface GeneralPostDetailProps {
  post: GeneralPost;
}

export default function GeneralPostDetail({ post }: GeneralPostDetailProps) {
  const handleLike = () => {
    // TODO: 좋아요 처리
  };

  const handleDislike = () => {
    // TODO: 싫어요 처리
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

        <PostActions
          likeCount={post.likeCount}
          dislikeCount={post.hateCount}
          isLiked={post.isLiked}
          isDisliked={post.isHated}
          onLike={handleLike}
          onDislike={handleDislike}
        />

        <Comments postId={post.id} commentCount={post.commentCount} />
      </Content>
    </Container>
  );
}
