'use client';

import styled from 'styled-components';
import { useState, useMemo } from 'react';

import CategoryTabs from '@/components/CategoryTabs';
import CommunityPost from '@/components/CommunityPost';
import MatchPostCard from '@/components/MatchPostCard';
import AdBanner from '@/components/AdBanner';
import SearchInput from '@/components/SearchInput';
import Pagination from '@/components/Pagination';
import CommunityLayout from '@/components/CommunityLayout';
import WriteButton from '@/components/WriteButton';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { MatchPost, Post } from '@/types/post';

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

// 테니스 관련 임시 게시글 데이터 (일반, 매치, 멘토 타입)
const mockPosts = [
  // 일반 글들
  {
    id: 1,
    title: '테니스 라켓 구매 후기',
    content:
      '최근에 Wilson Pro Staff RF97을 구매했습니다. 처음에는 무거워서 적응하기 어려웠지만, 한 달 정도 사용하니 정말 좋은 라켓이라는 걸 알 수 있었습니다. 특히 서브와 포핸드에서 위력이 대단합니다.',
    authorId: 'user303',
    authorName: '테니스매니아',
    date: '2024-01-15',
    category: 'tennis',
    postType: '일반',
    viewCount: 89,
    commentCount: 31,
    likeCount: 15,
    dislikeCount: 2,
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 2,
    title: '테니스 백핸드 개선법',
    content:
      '백핸드가 항상 약점이었는데, 최근에 개선된 방법을 찾았습니다. 양손 백핸드로 바꾸고 연습하니 훨씬 안정적이 되었어요.',
    authorId: 'user555',
    authorName: '테니스고수',
    date: '2024-01-11',
    category: 'tennis',
    postType: '일반',
    viewCount: 78,
    commentCount: 29,
    likeCount: 23,
    dislikeCount: 1,
    isLiked: true,
    isDisliked: false,
  },
  {
    id: 3,
    title: '테니스 대회 후기',
    content:
      '지난 주에 참가한 테니스 대회 후기를 공유합니다. 예상보다 높은 수준의 선수들이 참가해서 좋은 경험이 되었습니다.',
    authorId: 'user777',
    authorName: '테니스선수',
    date: '2024-01-10',
    category: 'tennis',
    postType: '일반',
    viewCount: 92,
    commentCount: 34,
    likeCount: 28,
    dislikeCount: 0,
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 4,
    title: '테니스 코트 예약 팁',
    content:
      '서울 지역 테니스 코트 예약에 대한 팁을 공유합니다. 평일 오전이 가장 예약하기 쉽고, 주말은 한 달 전에 예약해야 합니다.',
    authorId: 'user999',
    authorName: '테니스러버',
    date: '2024-01-08',
    category: 'tennis',
    postType: '일반',
    viewCount: 156,
    commentCount: 47,
    likeCount: 42,
    dislikeCount: 1,
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 5,
    title: '테니스 용품 추천',
    content:
      '테니스 초보자를 위한 필수 용품을 추천해드립니다. 라켓, 공, 가방, 신발 등 기본적인 것부터 시작하시면 됩니다.',
    authorId: 'user222',
    authorName: '테니스마스터',
    date: '2024-01-06',
    category: 'tennis',
    postType: '일반',
    viewCount: 134,
    commentCount: 38,
    likeCount: 35,
    dislikeCount: 0,
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 6,
    title: '테니스 스트로크 분석',
    content:
      '프로 선수들의 스트로크를 분석해보았습니다. 각 선수별 특징과 배울 점을 정리해봤어요.',
    authorId: 'user555',
    authorName: '테니스고수',
    date: '2024-01-03',
    category: 'tennis',
    postType: '일반',
    viewCount: 167,
    commentCount: 41,
    likeCount: 51,
    dislikeCount: 2,
    isLiked: true,
    isDisliked: false,
  },

  // 매치 글들
  {
    id: 7,
    title: '테니스 매칭 구합니다',
    content:
      '테니스 실력 향상을 위해 매칭을 구합니다. 실력은 무관하고 즐겁게 치실 분 환영합니다.',
    authorId: 'user101',
    authorName: '테니스초보',
    date: '2024-01-21',
    category: 'tennis',
    postType: '매치',
    matchLocation: '서울 강남구 테니스장',
    myElo: '1200',
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
    id: 8,
    title: '테니스 더블스 파트너 구합니다',
    content:
      '테니스 더블스 파트너를 구합니다. 중급 실력이고 주말에 자주 치실 분 찾습니다.',
    authorId: 'user456',
    authorName: '테니스러버',
    date: '2024-01-18',
    category: 'tennis',
    postType: '매치',
    matchLocation: '서울 서초구 테니스장',
    myElo: '1400',
    preferredElo: 'similar',
    validityPeriod: '3',
    viewCount: 178,
    commentCount: 19,
    likeCount: 34,
    dislikeCount: 0,
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 9,
    title: '테니스 연습 상대 구합니다',
    content:
      '테니스 연습 상대를 구합니다. 초보자도 환영하고 함께 실력 향상하실 분 찾습니다.',
    authorId: 'user202',
    authorName: '테니스학도',
    date: '2024-01-16',
    category: 'tennis',
    postType: '매치',
    matchLocation: '서울 마포구 테니스장',
    myElo: '1100',
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
    title: '테니스 초보자 멘토링 요청합니다',
    content:
      '테니스를 시작한 지 3개월이 되었는데 실력 향상이 더뎌서 고민입니다. 체계적으로 지도해주실 멘토를 찾습니다.',
    authorId: 'user303',
    authorName: '테니스초보',
    date: '2024-01-07',
    category: 'tennis',
    postType: '멘토',
    sport: 'tennis',
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
    title: '테니스 서브 기술 멘토링 요청합니다',
    content:
      '테니스 서브 기술을 개선하고 싶습니다. 특히 스핀 서브와 플랫 서브 구사에 어려움을 겪고 있어요.',
    authorId: 'user404',
    authorName: '서브초보',
    date: '2024-01-05',
    category: 'tennis',
    postType: '멘토',
    sport: 'tennis',
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
    title: '테니스 고급자 멘토링 요청합니다',
    content:
      '테니스 실력을 더욱 향상시키고 싶습니다. 고급 기술과 전략을 배우고 싶어요.',
    authorId: 'user505',
    authorName: '테니스학도',
    date: '2024-01-02',
    category: 'tennis',
    postType: '멘토',
    sport: 'tennis',
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

const POSTS_PER_PAGE = 12;

export default function TennisPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // 검색 필터링
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return mockPosts;
    }

    const query = searchQuery.toLowerCase();
    return mockPosts.filter(
      post =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.authorName.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // 페이지네이션
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAdClick = () => {
    console.log('테니스 광고 배너 클릭됨');
  };

  const handleWriteClick = () => {
    console.log('테니스 글쓰기 버튼 클릭됨');
    router.push(`${ROUTES.community.write}?category=tennis`);
  };

  return (
    <Container>
      <CategoryTabs />
      <CommunityLayout>
        <AdBanner
          title="🎾 테니스 대회 참가 신청"
          description="테니스 종목 대회에 참가하고 상금을 받아보세요!"
          onClick={handleAdClick}
        />
        <Content>
          <SearchInput
            onSearch={handleSearch}
            placeholder="테니스 게시글 검색..."
          />
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
              <NoResults>
                {searchQuery ? '검색 결과가 없습니다.' : '게시글이 없습니다.'}
              </NoResults>
            )}
          </PostList>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </Content>
      </CommunityLayout>
      <WriteButton onClick={handleWriteClick} />
    </Container>
  );
}
