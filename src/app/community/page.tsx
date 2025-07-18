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

// 커뮤니티 글 임시 데이터 (일반, 매치, 멘토 타입)
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
    title: '당구 실력 향상 팁 공유',
    content:
      '당구를 시작한 지 2년이 되었는데, 실력 향상에 도움이 되었던 팁들을 공유합니다. 기본 자세와 그립이 가장 중요하고, 연습할 때는 꾸준함이 핵심입니다.',
    authorId: 'user789',
    authorName: '당구마스터',
    date: '2024-01-13',
    category: 'billiards',
    postType: '일반',
    viewCount: 234,
    commentCount: 45,
    likeCount: 67,
    dislikeCount: 3,
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 3,
    title: '체스 전략 가이드',
    content:
      '체스 초보자를 위한 기본 전략을 정리해보았습니다. 오프닝, 미들게임, 엔드게임 각 단계별로 중요한 포인트들을 설명합니다.',
    authorId: 'user202',
    authorName: '체스마스터',
    date: '2024-01-11',
    category: 'chess',
    postType: '일반',
    viewCount: 345,
    commentCount: 67,
    likeCount: 89,
    dislikeCount: 4,
    isLiked: true,
    isDisliked: false,
  },
  {
    id: 4,
    title: '바둑 기보 분석',
    content:
      '최근 프로 기사들의 대국을 분석해보았습니다. 특히 중반전에서의 판단과 수순이 인상적이었습니다. 바둑을 배우는 분들에게 도움이 될 것 같습니다.',
    authorId: 'user303',
    authorName: '바둑연구가',
    date: '2024-01-10',
    category: 'go',
    postType: '일반',
    viewCount: 267,
    commentCount: 34,
    likeCount: 56,
    dislikeCount: 2,
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 5,
    title: '탁구 라켓 고르는 법',
    content:
      '탁구 라켓을 고를 때 고려해야 할 요소들을 정리했습니다. 플레이 스타일, 실력 수준, 예산에 따라 적합한 라켓이 달라집니다.',
    authorId: 'user707',
    authorName: '탁구코치',
    date: '2024-01-06',
    category: 'table-tennis',
    postType: '일반',
    viewCount: 223,
    commentCount: 39,
    likeCount: 63,
    dislikeCount: 1,
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 6,
    title: '바둑 입문 가이드',
    content:
      '바둑을 처음 배우는 분들을 위한 입문 가이드입니다. 기본 규칙부터 시작해서 간단한 전략까지 단계별로 설명합니다.',
    authorId: 'user909',
    authorName: '바둑입문자',
    date: '2024-01-04',
    category: 'go',
    postType: '일반',
    viewCount: 276,
    commentCount: 42,
    likeCount: 71,
    dislikeCount: 1,
    isLiked: false,
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
    date: '2024-01-19',
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
    title: '배드민턴 매칭 구합니다',
    content:
      '배드민턴 동호인과 함께 치고 싶습니다. 실력은 비슷하거나 조금 높은 분이면 좋겠어요.',
    authorId: 'user456',
    authorName: '배드민턴러버',
    date: '2024-01-17',
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
    id: 9,
    title: '탁구 매칭 구합니다',
    content:
      '탁구 실력 향상을 위해 매칭을 구합니다. 초보자도 환영하고 함께 연습하실 분 찾습니다.',
    authorId: 'user202',
    authorName: '탁구학도',
    date: '2024-01-15',
    category: 'table-tennis',
    postType: '매치',
    matchLocation: '서울 마포구 탁구장',
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
    date: '2024-01-08',
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
    title: '바둑 고급자 멘토링 요청합니다',
    content:
      '바둑을 배운 지 1년이 되었는데 더 높은 수준으로 올라가고 싶습니다. 프로 기사급 멘토를 찾습니다.',
    authorId: 'user404',
    authorName: '바둑학도',
    date: '2024-01-07',
    category: 'go',
    postType: '멘토',
    sport: 'go',
    customSport: '',
    elo: '1600+',
    location: '서울 종로구',
    tokenReward: '200',
    viewCount: 198,
    commentCount: 31,
    likeCount: 51,
    dislikeCount: 2,
    isLiked: true,
    isDisliked: false,
  },
  {
    id: 12,
    title: '체스 중급자 멘토링 요청합니다',
    content:
      '체스 실력을 더 향상시키고 싶습니다. 중급에서 고급으로 넘어가는 전략을 배우고 싶어요.',
    authorId: 'user505',
    authorName: '체스학도',
    date: '2024-01-05',
    category: 'chess',
    postType: '멘토',
    sport: 'chess',
    customSport: '',
    elo: '1400-1600',
    location: '서울 송파구',
    tokenReward: '150',
    viewCount: 312,
    commentCount: 58,
    likeCount: 78,
    dislikeCount: 3,
    isLiked: false,
    isDisliked: false,
  },
];

const POSTS_PER_PAGE = 12;

export default function CommunityPage() {
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
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAdClick = () => {
    console.log('광고 배너 클릭됨');
    // 실제로는 광고 링크로 이동하거나 모달을 열 수 있음
  };

  const handleWriteClick = () => {
    console.log('자유글 글쓰기 버튼 클릭됨');
    router.push(ROUTES.community.write);
  };

  return (
    <Container>
      <CategoryTabs />
      <CommunityLayout>
        <AdBanner onClick={handleAdClick} />
        <Content>
          <SearchInput onSearch={handleSearch} placeholder="게시글 검색..." />
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
