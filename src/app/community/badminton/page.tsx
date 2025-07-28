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

// 배드민턴 관련 임시 게시글 데이터 (일반, 매치, 멘토 타입)
const mockPosts = [
  // 일반 글들
  {
    id: 1,
    title: '배드민턴 라켓 구매 후기',
    content:
      'Yonex Voltric Z-Force II를 구매했습니다. 라이트 헤드 무거운 그립 타입인데, 스매시가 정말 강력합니다. 특히 백핸드 클리어가 훨씬 안정적이에요.',
    authorId: 'user101',
    authorName: '배드민턴매니아',
    date: '2024-01-15',
    category: 'badminton',
    postType: '일반',
    viewCount: 78,
    commentCount: 25,
    likeCount: 18,
    dislikeCount: 1,
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 2,
    title: '배드민턴 서브 개선법',
    content:
      '서브가 항상 약점이었는데, 최근에 개선된 방법을 찾았습니다. 숏 서브와 롱 서브를 상황에 맞게 구사하니 훨씬 좋아졌어요.',
    authorId: 'user555',
    authorName: '배드민턴고수',
    date: '2024-01-11',
    category: 'badminton',
    postType: '일반',
    viewCount: 67,
    commentCount: 23,
    likeCount: 25,
    dislikeCount: 0,
    isLiked: true,
    isDisliked: false,
  },
  {
    id: 3,
    title: '배드민턴 대회 후기',
    content:
      '지난 주에 참가한 배드민턴 대회 후기를 공유합니다. 예상보다 높은 수준의 선수들이 참가해서 좋은 경험이 되었습니다.',
    authorId: 'user777',
    authorName: '배드민턴선수',
    date: '2024-01-10',
    category: 'badminton',
    postType: '일반',
    viewCount: 89,
    commentCount: 31,
    likeCount: 32,
    dislikeCount: 1,
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 4,
    title: '배드민턴 코트 예약 팁',
    content:
      '서울 지역 배드민턴 코트 예약에 대한 팁을 공유합니다. 평일 오전이 가장 예약하기 쉽고, 주말은 2주 전에 예약해야 합니다.',
    authorId: 'user999',
    authorName: '배드민턴러버',
    date: '2024-01-08',
    category: 'badminton',
    postType: '일반',
    viewCount: 134,
    commentCount: 42,
    likeCount: 45,
    dislikeCount: 2,
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 5,
    title: '배드민턴 용품 추천',
    content:
      '배드민턴 초보자를 위한 필수 용품을 추천해드립니다. 라켓, 셔틀콕, 가방, 신발 등 기본적인 것부터 시작하시면 됩니다.',
    authorId: 'user222',
    authorName: '배드민턴마스터',
    date: '2024-01-06',
    category: 'badminton',
    postType: '일반',
    viewCount: 112,
    commentCount: 35,
    likeCount: 38,
    dislikeCount: 0,
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 6,
    title: '배드민턴 스트로크 분석',
    content:
      '프로 선수들의 스트로크를 분석해보았습니다. 각 선수별 특징과 배울 점을 정리해봤어요.',
    authorId: 'user555',
    authorName: '배드민턴고수',
    date: '2024-01-03',
    category: 'badminton',
    postType: '일반',
    viewCount: 145,
    commentCount: 39,
    likeCount: 52,
    dislikeCount: 1,
    isLiked: true,
    isDisliked: false,
  },

  // 매치 글들
  {
    id: 7,
    title: '배드민턴 매칭 구합니다',
    content:
      '배드민턴 동호인과 함께 치고 싶습니다. 실력은 비슷하거나 조금 높은 분이면 좋겠어요.',
    authorId: 'user456',
    authorName: '배드민턴러버',
    date: '2024-01-23',
    category: 'badminton',
    postType: '매치',
    matchLocation: '서울 서초구 배드민턴장',
    myElo: '1400',
    preferredElo: 'higher',
    validityPeriod: '3',
    viewCount: 178,
    commentCount: 19,
    likeCount: 34,
    dislikeCount: 0,
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 8,
    title: '배드민턴 더블스 파트너 구합니다',
    content:
      '배드민턴 더블스 파트너를 구합니다. 중급 실력이고 주말에 자주 치실 분 찾습니다.',
    authorId: 'user789',
    authorName: '배드민턴마스터',
    date: '2024-01-20',
    category: 'badminton',
    postType: '매치',
    matchLocation: '서울 강남구 배드민턴장',
    myElo: '1500',
    preferredElo: 'similar',
    validityPeriod: '7',
    viewCount: 156,
    commentCount: 23,
    likeCount: 28,
    dislikeCount: 1,
    isLiked: true,
    isDisliked: false,
  },
  {
    id: 9,
    title: '배드민턴 연습 상대 구합니다',
    content:
      '배드민턴 연습 상대를 구합니다. 초보자도 환영하고 함께 실력 향상하실 분 찾습니다.',
    authorId: 'user202',
    authorName: '배드민턴학도',
    date: '2024-01-18',
    category: 'badminton',
    postType: '매치',
    matchLocation: '서울 마포구 배드민턴장',
    myElo: '1200',
    preferredElo: 'any',
    validityPeriod: '1',
    viewCount: 189,
    commentCount: 28,
    likeCount: 42,
    dislikeCount: 1,
    isLiked: false,
    isDisliked: false,
  },

  // 멘토 글들
  {
    id: 10,
    title: '배드민턴 초보자 멘토링 요청합니다',
    content:
      '배드민턴을 시작한 지 2개월이 되었는데 실력 향상이 더뎌서 고민입니다. 체계적으로 지도해주실 멘토를 찾습니다.',
    authorId: 'user303',
    authorName: '배드민턴초보',
    date: '2024-01-07',
    category: 'badminton',
    postType: '멘토',
    sport: 'badminton',
    customSport: '',
    elo: '1200-1400',
    location: '서울 강남구',
    tokenReward: '100',
    viewCount: 145,
    commentCount: 22,
    likeCount: 38,
    dislikeCount: 0,
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 11,
    title: '배드민턴 스매시 기술 멘토링 요청합니다',
    content:
      '배드민턴 스매시 기술을 개선하고 싶습니다. 특히 파워와 정확도 조절에 어려움을 겪고 있어요.',
    authorId: 'user404',
    authorName: '스매시초보',
    date: '2024-01-05',
    category: 'badminton',
    postType: '멘토',
    sport: 'badminton',
    customSport: '',
    elo: '1400-1600',
    location: '서울 송파구',
    tokenReward: '150',
    viewCount: 198,
    commentCount: 31,
    likeCount: 51,
    dislikeCount: 2,
    isLiked: true,
    isDisliked: false,
  },
  {
    id: 12,
    title: '배드민턴 고급자 멘토링 요청합니다',
    content:
      '배드민턴 실력을 더욱 향상시키고 싶습니다. 고급 기술과 전략을 배우고 싶어요.',
    authorId: 'user505',
    authorName: '배드민턴학도',
    date: '2024-01-02',
    category: 'badminton',
    postType: '멘토',
    sport: 'badminton',
    customSport: '',
    elo: '1600+',
    location: '서울 종로구',
    tokenReward: '200',
    viewCount: 312,
    commentCount: 58,
    likeCount: 78,
    dislikeCount: 3,
    isLiked: false,
    isDisliked: false,
  },
];

export default function BadmintonPage() {
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

  // 인기글(일반글 중 좋아요 순 상위 3개)
  const popularFreePosts = mockPosts
    .filter(post => post.postType === '일반')
    .sort((a, b) => (b.likeCount ?? 0) - (a.likeCount ?? 0))
    .slice(0, POSTS.POPULAR_POSTS_COUNT)
    .map(post => ({
      id: post.id,
      title: post.title,
      author: post.authorName,
      views: post.viewCount ?? 0,
      likes: post.likeCount ?? 0,
      commentCount: post.commentCount ?? 0,
      date: post.date,
      content: post.content,
    }));

  const handleLoadMore = () => {
    loadMore();
  };

  const handleAdClick = (business: any) => {
    console.log('배드민턴 업장 배너 클릭됨:', business.name);
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
