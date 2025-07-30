'use client';

import styled from 'styled-components';

import CategoryTabs from '@/components/CategoryTabs';
import CommunityPost from '@/components/CommunityPost';
import CommunityLayout from '@/components/CommunityLayout';
import { PAGINATION } from '@/constants/pagination';
import { usePagination } from '@/hooks/usePagination';
import { Post } from '@/types/post';
import { usePostsApi } from '@/api/useCommunity';
import { useCommunityStore } from '@/stores/communityStore';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.background};
  position: relative;
`;

const Content = styled.div`
  flex: 1;
  width: 100%;
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
`;

const NoResults = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textGray};
  font-size: ${props => props.theme.typography.fontSizes.base};
`;

const LoadMoreButton = styled.button`
  background-color: ${props => props.theme.colors.backgroundGray};
  color: ${props => props.theme.colors.textBlack};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.textGray};
  cursor: pointer;
  margin: ${props => props.theme.spacing.md} auto;
  display: block;
  width: 80%;
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.borderLight};
    border-color: ${props => props.theme.colors.textBlack};
  }
`;

// 공지사항 임시 데이터
const mockPosts: Post[] = [
  {
    id: 1,
    title: '[공지] 종목별 후원 순위 안내',
    content:
      '안녕하세요! 현재 종목별 후원 순위를 안내드립니다. 후원받은 토큰 순서에 따라 상단 탭의 순서가 결정됩니다. 후원받은 토큰의 일부는 소각되고, 나머지는 대회 자금으로 사용됩니다. 현재 순위: 1위 테니스(890토큰), 2위 배드민턴(670토큰), 3위 바둑(450토큰), 4위 탁구(320토큰), 5위 체스(280토큰), 6위 당구(150토큰)',
    authorId: 'admin',
    authorName: '관리자',
    date: '2024-01-15',
    postType: '공지',
    category: '공지',
    viewCount: 1250,
    commentCount: 45,
    likeCount: 0,
    dislikeCount: 0,
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 2,
    title: '[공지] 커뮤니티 이용 규칙 안내',
    content:
      '커뮤니티 이용 규칙을 안내드립니다. 1. 타인을 비방하거나 욕설을 사용하지 마세요. 2. 스팸이나 광고성 글은 금지됩니다. 3. 각 종목에 맞는 내용만 작성해주세요. 4. 저작권을 침해하는 내용은 금지됩니다. 위반 시 글 삭제 및 계정 제재가 있을 수 있습니다.',
    authorId: 'admin',
    authorName: '관리자',
    date: '2024-01-14',
    postType: '공지',
    category: '공지',
    viewCount: 890,
    commentCount: 23,
    likeCount: 0,
    dislikeCount: 0,
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 3,
    title: '[공지] 토큰 시스템 업데이트 안내',
    content:
      '토큰 시스템이 업데이트되었습니다. 주요 변경사항: 1. 프로필에 글 노출 시 1토큰 소각, 2. 종목별 후원 시 일부 토큰 소각 및 대회 자금으로 사용, 3. 후원 순위에 따른 상단 탭 순서 변경. 자세한 내용은 FAQ를 참고해주세요.',
    authorId: 'admin',
    authorName: '관리자',
    date: '2024-01-13',
    postType: '공지',
    category: '공지',
    viewCount: 756,
    commentCount: 31,
    likeCount: 0,
    dislikeCount: 0,
    isLiked: false,
    isDisliked: false,
  },
];

export default function NoticePage() {
  const currentTab = '공지사항';

  const { communityTabs } = useCommunityStore();
  const categoryId = communityTabs?.[currentTab]?.id || 0;
  const { data: postsData } = usePostsApi(categoryId);

  console.log(postsData);

  // 모든 게시글 표시 (검색은 별도 페이지에서 처리)
  const filteredPosts = mockPosts;

  // 페이지네이션 훅 사용
  const {
    currentItems: currentPosts,
    loadMore,
    hasNextPage: hasMorePosts,
  } = usePagination({
    items: filteredPosts,
    itemsPerPage: PAGINATION.POSTS_PER_PAGE,
  });

  const handleLoadMore = () => {
    loadMore();
  };

  return (
    <Container>
      <CategoryTabs currentLabel={currentTab} />
      <CommunityLayout>
        <Content>
          <PostList>
            {currentPosts.length > 0 ? (
              currentPosts.map(post => (
                <CommunityPost key={post.id} post={post} />
              ))
            ) : (
              <NoResults>게시글이 없습니다.</NoResults>
            )}
          </PostList>
          {hasMorePosts && (
            <LoadMoreButton onClick={handleLoadMore}>더보기</LoadMoreButton>
          )}
        </Content>
      </CommunityLayout>
    </Container>
  );
}
