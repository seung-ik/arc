'use client';

import styled from 'styled-components';
import CategoryTabs from '@/components/CategoryTabs';
import CommunityPost from '@/components/CommunityPost';
import MatchPostCard from '@/components/MatchPostCard';
import BusinessBanner from '@/components/BusinessBanner';
import CommunityLayout from '@/components/CommunityLayout';
import { PAGINATION, POSTS } from '@/constants/pagination';
import { usePagination } from '@/hooks/usePagination';
import { MatchPost, Post } from '@/types/post';
import PopularPosts from '@/components/PopularPosts';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.background};
  padding-bottom: 80px;
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

// 체스 관련 임시 게시글 데이터
const mockPosts = [
  // 일반 포스트
  {
    id: 1,
    title: '체스 전략 공유',
    content:
      '오늘 상대방과 체스 대결에서 사용한 전략을 공유합니다. 킹스 인디언 어택을 사용했는데, 상대방이 예상보다 잘 막아내서 고전했습니다. 더 나은 전략이 있으시면 조언 부탁드립니다.',
    authorId: 'user456',
    authorName: '체스왕',
    date: '2024-01-15',
    postType: '일반',
    category: '체스',
    viewCount: 32,
    commentCount: 12,
  },
  {
    id: 2,
    title: '체스 동호회 모집',
    content:
      '서울 강남 지역에서 체스를 두는 동호회를 만들려고 합니다. 실력에 관계없이 즐겁게 두실 분들 모집합니다. 매주 일요일 오후에 모입니다.',
    authorId: 'user789',
    authorName: '체스마스터',
    date: '2024-01-14',
    postType: '일반',
    category: '체스',
    viewCount: 28,
    commentCount: 10,
  },
  {
    id: 3,
    title: '체스 실력 향상 팁',
    content:
      '체스를 시작한 지 6개월이 되었는데, 실력 향상이 더뎌서 고민입니다. 특히 중반전에서의 전략적 판단에 어려움을 겪고 있어요.',
    authorId: 'user101',
    authorName: '체스초보',
    date: '2024-01-13',
    postType: '일반',
    category: '체스',
    viewCount: 45,
    commentCount: 16,
  },
  {
    id: 4,
    title: '체스 오프닝 분석',
    content:
      '체스 오프닝에 대한 분석을 정리해보았습니다. 각 오프닝의 장단점과 활용법을 자세히 분석해봤어요.',
    authorId: 'user202',
    authorName: '체스분석가',
    date: '2024-01-12',
    postType: '일반',
    category: '체스',
    viewCount: 78,
    commentCount: 31,
  },
  {
    id: 5,
    title: '체스 대회 후기',
    content:
      '지난 주에 참가한 체스 대회 후기를 공유합니다. 예상보다 높은 수준의 선수들이 참가해서 좋은 경험이 되었습니다.',
    authorId: 'user303',
    authorName: '체스선수',
    date: '2024-01-11',
    postType: '일반',
    category: '체스',
    viewCount: 92,
    commentCount: 34,
  },
  {
    id: 6,
    title: '체스 용품 추천',
    content:
      '체스 초보자를 위한 필수 용품을 추천해드립니다. 체스판, 체스말, 체스시계 등 기본적인 것부터 시작하시면 됩니다.',
    authorId: 'user404',
    authorName: '체스마스터',
    date: '2024-01-10',
    postType: '일반',
    category: '체스',
    viewCount: 134,
    commentCount: 38,
  },

  // 매치 포스트
  {
    id: 13,
    title: '체스 매치 상대 구합니다',
    content:
      '서울 강남 지역에서 체스 매치 상대를 구합니다. 실력은 중급 정도이고, 매주 토요일 오후에 두고 싶습니다. 연락처 남겨주세요!',
    authorId: 'user222',
    authorName: '체스매처',
    date: '2024-01-26',
    postType: '매치',
    category: '체스',
    matchLocation: '서울 강남구 체스클럽',
    myElo: '1620',
    preferredElo: 'similar',
    validityPeriod: '7',
    viewCount: 34,
    commentCount: 12,
  },
  {
    id: 14,
    title: '체스 친선 대국 상대',
    content:
      '부산 해운대 지역에서 체스 친선 대국 상대를 구합니다. 실력에 관계없이 즐겁게 두실 분 환영합니다!',
    authorId: 'user333',
    authorName: '부산체스',
    date: '2024-01-23',
    postType: '매치',
    category: '체스',
    matchLocation: '부산 해운대구 체스클럽',
    myElo: '1480',
    preferredElo: 'any',
    validityPeriod: '3',
    viewCount: 28,
    commentCount: 8,
  },
  {
    id: 15,
    title: '체스 연습 상대 구합니다',
    content:
      '대구 수성구에서 체스 연습 상대를 구합니다. 초급 실력이고, 실력 향상이 목표입니다. 매주 일요일 오전에 두고 싶습니다.',
    authorId: 'user444',
    authorName: '대구체스',
    date: '2024-01-21',
    postType: '매치',
    category: '체스',
    matchLocation: '대구 수성구 체스클럽',
    myElo: '1350',
    preferredElo: 'similar',
    validityPeriod: '1',
    viewCount: 22,
    commentCount: 6,
  },
  {
    id: 16,
    title: '체스 토너먼트 참가자 모집',
    content:
      '인천 연수구에서 체스 토너먼트를 개최하려고 합니다. 참가자 16명을 모집합니다. 실력은 중급 이상이어야 합니다.',
    authorId: 'user555',
    authorName: '인천체스',
    date: '2024-01-19',
    postType: '매치',
    category: '체스',
    matchLocation: '인천 연수구 체스클럽',
    myElo: '1750',
    preferredElo: 'higher',
    validityPeriod: '5',
    viewCount: 45,
    commentCount: 15,
  },
  // 멘토 포스트
  {
    id: 17,
    title: '체스 레슨 제공합니다',
    content:
      '체스 레슨을 제공합니다. 10년 경력의 체스 지도자입니다. 초급부터 중급까지 체계적으로 가르쳐드립니다. 서울 강남 지역에서 가능합니다.',
    authorId: 'user666',
    authorName: '체스코치',
    date: '2024-01-15',
    postType: '멘토',
    category: '체스',
    location: '서울 강남',
    skillLevel: '초급~중급',
    experience: '10년',
    viewCount: 67,
    commentCount: 23,
  },
  {
    id: 18,
    title: '체스 기초 레슨',
    content:
      '체스 기초를 가르쳐드립니다. 기본 규칙, 오프닝, 중반전 전략부터 차근차근 배워보세요. 부산 서구 지역에서 가능합니다.',
    authorId: 'user777',
    authorName: '체스선생',
    date: '2024-01-14',
    postType: '멘토',
    category: '체스',
    location: '부산 서구',
    skillLevel: '초급',
    experience: '5년',
    viewCount: 42,
    commentCount: 18,
  },
  {
    id: 19,
    title: '체스 고급 기술 레슨',
    content:
      '체스 고급 기술을 가르쳐드립니다. 복잡한 오프닝, 정교한 계산, 엔드게임 기술을 배워보세요. 대구 중구 지역에서 가능합니다.',
    authorId: 'user888',
    authorName: '체스마스터',
    date: '2024-01-13',
    postType: '멘토',
    category: '체스',
    location: '대구 중구',
    skillLevel: '중급~고급',
    experience: '15년',
    viewCount: 38,
    commentCount: 14,
  },
  {
    id: 20,
    title: '체스 개인 레슨',
    content:
      '체스 개인 레슨을 제공합니다. 1:1 맞춤형 레슨으로 빠른 실력 향상을 도와드립니다. 인천 남구 지역에서 가능합니다.',
    authorId: 'user999',
    authorName: '체스개인교습',
    date: '2024-01-12',
    postType: '멘토',
    category: '체스',
    location: '인천 남구',
    skillLevel: '전체',
    experience: '8년',
    viewCount: 31,
    commentCount: 11,
  },
];

export default function ChessPage() {
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

  // 인기글(일반글 중 조회수 순 상위 3개)
  const popularFreePosts = mockPosts
    .filter(post => post.postType === '일반')
    .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
    .slice(0, POSTS.POPULAR_POSTS_COUNT)
    .map(post => ({
      id: post.id,
      title: post.title,
      author: post.authorName,
      views: post.viewCount ?? 0,
      likes: 0, // 체스 데이터에는 likeCount가 없으므로 기본값 사용
      commentCount: post.commentCount ?? 0,
      date: post.date,
      content: post.content,
    }));

  const handleLoadMore = () => {
    loadMore();
  };

  const handleAdClick = (business: any) => {
    console.log('체스 업장 배너 클릭됨:', business.name);
  };

  return (
    <Container>
      <CategoryTabs />
      <CommunityLayout>
        <Content>
          <PopularPosts posts={popularFreePosts} />
          <BusinessBanner onClick={handleAdClick} />
          <PostList>
            {currentPosts.length > 0 ? (
              currentPosts.map(post =>
                post.postType === '매치' ? (
                  <MatchPostCard key={post.id} post={post as MatchPost} />
                ) : (
                  <CommunityPost key={post.id} post={post as Post} />
                )
              )
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
