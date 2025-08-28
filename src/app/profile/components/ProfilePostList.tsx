'use client';

import styled from 'styled-components';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MyPost } from '@/api/useUser';
import HtmlContent from '../../../components/inputs/HtmlContent';
import NoData from '@/components/views/NoData';
import { formatDate } from '@/utils';

interface ProfilePostListProps {
  posts: MyPost[];
  isMyProfile: boolean;
  onHarvest?: (postId: number) => void;
}

const PostListContainer = styled.div`
  padding: 16px;
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.textBlack};
  margin: 0 0 16px 0;
  padding-left: 4px;
`;

const PostCard = styled.div`
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
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
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const PostTitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  flex: 1;
`;

const PostTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.textBlack};
  margin: 0;
  line-height: 1.4;
`;

const PostTypeBadge = styled.span<{ $postType: string }>`
  background-color: ${props => {
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
  color: ${props => {
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
  font-size: ${props => props.theme.typography.fontSizes.xs};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  flex-shrink: 0;
`;

const PostContent = styled.div`
  color: ${props => props.theme.colors.textGray};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  line-height: 1.5;

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  & img {
    max-height: 60px;
    width: auto;
  }
`;

const PostFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.textLightGray};
`;

const PostDate = styled.span`
  color: ${props => props.theme.colors.textLightGray};
`;

const LikeButton = styled.button`
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: 4px 8px;
  font-size: ${props => props.theme.typography.fontSizes.xs};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.textGray};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background-color: ${props => props.theme.colors.primaryLight};
    color: ${props => props.theme.colors.primary};
  }
`;

const getLabelByType = (type: string) => {
  switch (type) {
    case '일반':
    case 'general':
      return '일반';
    case '매치':
    case 'match':
      return '매치';
    case '멘토':
    case 'mentor':
      return '멘토';
    case '공지':
      return '공지';
    default:
      return '일반';
  }
};

export default function ProfilePostList({
  posts,
  isMyProfile,
  onHarvest,
}: ProfilePostListProps) {
  const router = useRouter();

  // 정렬된 게시글 목록: 수확 가능한 것들을 위로, 그 다음 시간순
  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [posts]);

  const handlePostClick = (post: MyPost) => {
    // post.type이 이미 영어로 오므로 그대로 사용
    const typeParam = post.type;

    router.push(`/community/post/${post.id}?from=profile&type=${typeParam}`);
  };

  const filteredPosts = isMyProfile
    ? sortedPosts
    : sortedPosts.filter(post => post.isHidden === false);

  if (filteredPosts.length === 0) {
    return (
      <PostListContainer>
        <SectionTitle>{isMyProfile ? '내 글' : '작성한 글'}</SectionTitle>
        <NoData
          message={
            isMyProfile
              ? '아직 작성한 글이 없습니다'
              : '프로필에 노출된 글이 없습니다'
          }
        />
      </PostListContainer>
    );
  }

  return (
    <PostListContainer>
      <SectionTitle>{isMyProfile ? '내 글' : '작성한 글'}</SectionTitle>
      {filteredPosts.map(post => (
        <PostCard key={post.id} onClick={() => handlePostClick(post)}>
          <PostHeader>
            <PostTitleSection>
              <PostTypeBadge $postType={post.type}>
                {getLabelByType(post.type)}
              </PostTypeBadge>
              <PostTitle>{post.title}</PostTitle>
            </PostTitleSection>

            {post.type === 'general' && (
              <div
                style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
              >
                <LikeButton
                  onClick={e => {
                    e.stopPropagation();
                    onHarvest?.(post.id);
                  }}
                >
                  ❤️ {post.likeCount}
                </LikeButton>
              </div>
            )}
          </PostHeader>

          <PostContent>
            <HtmlContent content={post.content} />
          </PostContent>

          <PostFooter>
            <PostDate>{formatDate(post.createdAt)}</PostDate>
          </PostFooter>
        </PostCard>
      ))}
    </PostListContainer>
  );
}
