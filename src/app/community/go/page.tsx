'use client';

import styled from 'styled-components';
import { useState, useMemo } from 'react';
import BottomNavigation from '@/components/BottomNavigation';
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

// 바둑 관련 임시 게시글 데이터
const mockPosts = [
  // 일반 포스트
  {
    id: 1,
    title: '바둑 기보 분석',
    content:
      '오늘 프로 기사와의 대국에서 배운 수를 분석해보았습니다. 특히 중반전에서의 포석이 인상적이었어요. 3-3 포인트에서의 응수법을 정리해보겠습니다.',
    authorId: 'user202',
    authorName: '바둑학도',
    date: '2024-01-15',
    postType: '일반',
    category: '바둑',
    viewCount: 56,
    commentCount: 18,
  },
  {
    id: 2,
    title: '바둑 동호회 모집',
    content:
      '서울 강북 지역에서 바둑을 두는 동호회를 만들려고 합니다. 실력에 관계없이 즐겁게 두실 분들 모집합니다. 매주 토요일 오후에 모입니다.',
    authorId: 'user303',
    authorName: '바둑마스터',
    date: '2024-01-14',
    postType: '일반',
    category: '바둑',
    viewCount: 34,
    commentCount: 12,
  },
  {
    id: 3,
    title: '바둑 실력 향상 팁',
    content:
      '바둑을 시작한 지 1년이 되었는데, 실력 향상이 더뎌서 고민입니다. 특히 중반전에서의 전략적 판단에 어려움을 겪고 있어요.',
    authorId: 'user456',
    authorName: '바둑초보',
    date: '2024-01-13',
    postType: '일반',
    category: '바둑',
    viewCount: 42,
    commentCount: 16,
  },
  {
    id: 4,
    title: '바둑 기보 해설',
    content:
      '최근 프로 기사들의 대국 기보를 해설해보았습니다. 각 수의 의미와 전략적 배경을 자세히 분석해봤어요.',
    authorId: 'user101',
    authorName: '바둑해설가',
    date: '2024-01-12',
    postType: '일반',
    category: '바둑',
    viewCount: 78,
    commentCount: 31,
  },
  {
    id: 5,
    title: '바둑 대회 후기',
    content:
      '지난 주에 참가한 바둑 대회 후기를 공유합니다. 예상보다 높은 수준의 기사들이 참가해서 좋은 경험이 되었습니다.',
    authorId: 'user202',
    authorName: '바둑기사',
    date: '2024-01-11',
    postType: '일반',
    category: '바둑',
    viewCount: 92,
    commentCount: 34,
  },
  {
    id: 6,
    title: '바둑 용품 추천',
    content:
      '바둑 초보자를 위한 필수 용품을 추천해드립니다. 바둑판, 바둑돌, 바둑가방 등 기본적인 것부터 시작하시면 됩니다.',
    authorId: 'user303',
    authorName: '바둑마스터',
    date: '2024-01-10',
    postType: '일반',
    category: '바둑',
    viewCount: 134,
    commentCount: 38,
  },

  // 매치 포스트
  {
    id: 13,
    title: '바둑 매치 상대 구합니다',
    content:
      '서울 강남 지역에서 바둑 매치 상대를 구합니다. 실력은 중급 정도이고, 매주 토요일 오후에 두고 싶습니다. 연락처 남겨주세요!',
    authorId: 'user111',
    authorName: '바둑매처',
    date: '2024-01-25',
    postType: '매치',
    category: '바둑',
    matchLocation: '서울 강남구 바둑도장',
    myElo: '1580',
    preferredElo: 'similar',
    validityPeriod: '7',
    viewCount: 34,
    commentCount: 12,
  },
  {
    id: 14,
    title: '바둑 친선 대국 상대',
    content:
      '부산 해운대 지역에서 바둑 친선 대국 상대를 구합니다. 실력에 관계없이 즐겁게 두실 분 환영합니다!',
    authorId: 'user222',
    authorName: '부산바둑',
    date: '2024-01-22',
    postType: '매치',
    category: '바둑',
    matchLocation: '부산 해운대구 바둑도장',
    myElo: '1420',
    preferredElo: 'any',
    validityPeriod: '3',
    viewCount: 28,
    commentCount: 8,
  },
  {
    id: 15,
    title: '바둑 연습 상대 구합니다',
    content:
      '대구 수성구에서 바둑 연습 상대를 구합니다. 초급 실력이고, 실력 향상이 목표입니다. 매주 일요일 오전에 두고 싶습니다.',
    authorId: 'user333',
    authorName: '대구바둑',
    date: '2024-01-20',
    postType: '매치',
    category: '바둑',
    matchLocation: '대구 수성구 바둑도장',
    myElo: '1250',
    preferredElo: 'similar',
    validityPeriod: '1',
    viewCount: 22,
    commentCount: 6,
  },
  {
    id: 16,
    title: '바둑 토너먼트 참가자 모집',
    content:
      '인천 연수구에서 바둑 토너먼트를 개최하려고 합니다. 참가자 16명을 모집합니다. 실력은 중급 이상이어야 합니다.',
    authorId: 'user444',
    authorName: '인천바둑',
    date: '2024-01-18',
    postType: '매치',
    category: '바둑',
    matchLocation: '인천 연수구 바둑도장',
    myElo: '1650',
    preferredElo: 'higher',
    validityPeriod: '5',
    viewCount: 45,
    commentCount: 15,
  },
  // 멘토 포스트
  {
    id: 17,
    title: '바둑 레슨 제공합니다',
    content:
      '바둑 레슨을 제공합니다. 10년 경력의 바둑 지도자입니다. 초급부터 중급까지 체계적으로 가르쳐드립니다. 서울 강남 지역에서 가능합니다.',
    authorId: 'user555',
    authorName: '바둑코치',
    date: '2024-01-15',
    postType: '멘토',
    category: '바둑',
    location: '서울 강남',
    skillLevel: '초급~중급',
    experience: '10년',
    viewCount: 67,
    commentCount: 23,
  },
  {
    id: 18,
    title: '바둑 기초 레슨',
    content:
      '바둑 기초를 가르쳐드립니다. 기본 규칙, 포석, 중반전 전략부터 차근차근 배워보세요. 부산 서구 지역에서 가능합니다.',
    authorId: 'user666',
    authorName: '바둑선생',
    date: '2024-01-14',
    postType: '멘토',
    category: '바둑',
    location: '부산 서구',
    skillLevel: '초급',
    experience: '5년',
    viewCount: 42,
    commentCount: 18,
  },
  {
    id: 19,
    title: '바둑 고급 기술 레슨',
    content:
      '바둑 고급 기술을 가르쳐드립니다. 복잡한 포석, 정교한 계산, 끝내기 기술을 배워보세요. 대구 중구 지역에서 가능합니다.',
    authorId: 'user777',
    authorName: '바둑마스터',
    date: '2024-01-13',
    postType: '멘토',
    category: '바둑',
    location: '대구 중구',
    skillLevel: '중급~고급',
    experience: '15년',
    viewCount: 38,
    commentCount: 14,
  },
  {
    id: 20,
    title: '바둑 개인 레슨',
    content:
      '바둑 개인 레슨을 제공합니다. 1:1 맞춤형 레슨으로 빠른 실력 향상을 도와드립니다. 인천 남구 지역에서 가능합니다.',
    authorId: 'user888',
    authorName: '바둑개인교습',
    date: '2024-01-12',
    postType: '멘토',
    category: '바둑',
    location: '인천 남구',
    skillLevel: '전체',
    experience: '8년',
    viewCount: 31,
    commentCount: 11,
  },
];

const POSTS_PER_PAGE = 12;

export default function GoPage() {
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
    console.log('바둑 광고 배너 클릭됨');
  };

  const handleWriteClick = () => {
    console.log('바둑 글쓰기 버튼 클릭됨');
    router.push(`${ROUTES.community.write}?category=go`);
  };

  return (
    <Container>
      <CategoryTabs />
      <CommunityLayout>
        <AdBanner
          title="⚫ 바둑 대회 참가 신청"
          description="바둑 종목 대회에 참가하고 상금을 받아보세요!"
          onClick={handleAdClick}
        />
        <Content>
          <SearchInput
            onSearch={handleSearch}
            placeholder="바둑 게시글 검색..."
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
      <BottomNavigation />
    </Container>
  );
}
