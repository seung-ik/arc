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

// 탁구 관련 임시 게시글 데이터
const mockPosts = [
  // 일반 포스트
  {
    id: 1,
    title: '탁구 동호회 모집합니다!',
    content:
      '매주 토요일 오후에 탁구를 치는 동호회를 만들려고 합니다. 초보자도 환영하고, 실력 향상을 목표로 하는 분들 모집합니다. 관심 있으신 분들은 댓글로 연락처 남겨주세요!',
    authorId: 'user123',
    authorName: '탁구마스터',
    date: '2024-01-15',
    postType: '일반',
    category: '탁구',
    viewCount: 45,
    commentCount: 8,
  },
  {
    id: 2,
    title: '탁구 라켓 구매 후기',
    content:
      'Butterfly Viscaria를 구매했습니다. 카본 라켓이라 처음에는 적응하기 어려웠지만, 한 달 정도 사용하니 정말 좋은 라켓이라는 걸 알 수 있었습니다.',
    authorId: 'user456',
    authorName: '탁구매니아',
    date: '2024-01-14',
    postType: '일반',
    category: '탁구',
    viewCount: 67,
    commentCount: 23,
  },
  {
    id: 3,
    title: '탁구 실력 향상 팁',
    content:
      '탁구를 시작한 지 3개월이 되었는데, 실력 향상이 더뎌서 고민입니다. 특히 서브와 리시브에 어려움을 겪고 있어요.',
    authorId: 'user789',
    authorName: '탁구초보',
    date: '2024-01-13',
    postType: '일반',
    category: '탁구',
    viewCount: 38,
    commentCount: 14,
  },
  {
    id: 4,
    title: '탁구 코트 추천',
    content:
      '서울 강남 지역에서 탁구를 칠 수 있는 좋은 코트를 찾고 있습니다. 주차가 편하고, 시설이 깨끗한 곳을 추천해주세요.',
    authorId: 'user101',
    authorName: '탁구러버',
    date: '2024-01-12',
    postType: '일반',
    category: '탁구',
    viewCount: 56,
    commentCount: 19,
  },
  {
    id: 5,
    title: '탁구 서브 기술',
    content:
      '탁구 서브를 시작한 지 6개월이 되었는데, 실력 향상이 더뎌서 고민입니다. 특히 스핀 서브와 플랫 서브 구사에 어려움을 겪고 있어요.',
    authorId: 'user202',
    authorName: '탁구고수',
    date: '2024-01-11',
    postType: '일반',
    category: '탁구',
    viewCount: 78,
    commentCount: 31,
  },
  {
    id: 6,
    title: '탁구 대회 후기',
    content:
      '지난 주에 참가한 탁구 대회 후기를 공유합니다. 예상보다 높은 수준의 선수들이 참가해서 좋은 경험이 되었습니다.',
    authorId: 'user303',
    authorName: '탁구선수',
    date: '2024-01-10',
    postType: '일반',
    category: '탁구',
    viewCount: 92,
    commentCount: 34,
  },
  {
    id: 7,
    title: '탁구 라켓 스트링 교체',
    content:
      '라켓 스트링을 언제 교체해야 하는지 궁금합니다. 현재 사용 중인 스트링이 3개월 정도 되었는데 교체 시기가 된 건가요?',
    authorId: 'user404',
    authorName: '탁구초보',
    date: '2024-01-09',
    postType: '일반',
    category: '탁구',
    viewCount: 43,
    commentCount: 12,
  },
  {
    id: 8,
    title: '탁구 코트 예약 팁',
    content:
      '서울 지역 탁구 코트 예약에 대한 팁을 공유합니다. 평일 오전이 가장 예약하기 쉽고, 주말은 한 달 전에 예약해야 합니다.',
    authorId: 'user505',
    authorName: '탁구러버',
    date: '2024-01-08',
    postType: '일반',
    category: '탁구',
    viewCount: 156,
    commentCount: 47,
  },
  {
    id: 9,
    title: '탁구 포핸드 개선',
    content:
      '포핸드 스윙을 개선하고 싶습니다. 현재 스윙이 불안정해서 실수하는 경우가 많아요. 연습 방법을 알려주세요.',
    authorId: 'user606',
    authorName: '탁구매니아',
    date: '2024-01-07',
    postType: '일반',
    category: '탁구',
    viewCount: 67,
    commentCount: 21,
  },
  {
    id: 10,
    title: '탁구 용품 추천',
    content:
      '탁구 초보자를 위한 필수 용품을 추천해드립니다. 라켓, 공, 가방, 신발 등 기본적인 것부터 시작하시면 됩니다.',
    authorId: 'user707',
    authorName: '탁구마스터',
    date: '2024-01-06',
    postType: '일반',
    category: '탁구',
    viewCount: 134,
    commentCount: 38,
  },
  {
    id: 11,
    title: '탁구 동호회 후기',
    content:
      '지난 달에 가입한 탁구 동호회 후기를 공유합니다. 정말 좋은 분들과 함께해서 실력도 향상되고 즐거운 시간을 보내고 있어요.',
    authorId: 'user808',
    authorName: '탁구러버',
    date: '2024-01-05',
    postType: '일반',
    category: '탁구',
    viewCount: 89,
    commentCount: 26,
  },
  {
    id: 12,
    title: '탁구 대회 정보',
    content:
      '올해 상반기 탁구 대회 일정을 정리해드립니다. 각 대회별 참가 조건과 상금 정보도 포함되어 있습니다.',
    authorId: 'user909',
    authorName: '탁구선수',
    date: '2024-01-04',
    postType: '일반',
    category: '탁구',
    viewCount: 201,
    commentCount: 52,
  },
  {
    id: 13,
    title: '탁구 스트로크 분석',
    content:
      '프로 선수들의 스트로크를 분석해보았습니다. 각 선수별 특징과 배울 점을 정리해봤어요.',
    authorId: 'user111',
    authorName: '탁구고수',
    date: '2024-01-03',
    postType: '일반',
    category: '탁구',
    viewCount: 167,
    commentCount: 41,
  },
  {
    id: 14,
    title: '탁구 치다가 생긴 웃픈 일 😂',
    content:
      '탁구 치다가 상대방이 "아, 아웃!"이라고 외치면서 공을 받지 않았는데, 정작 공은 인이었어요. 상대방이 실수로 자신의 코트로 들어온 공을 아웃이라고 생각한 것 같아요. 다들 폭소했어요!',
    authorId: 'user222',
    authorName: '탁구실수왕',
    date: '2024-01-02',
    postType: '일반',
    category: '탁구',
    viewCount: 234,
    commentCount: 67,
  },
  {
    id: 15,
    title: '탁구 치다가 만난 귀여운 할머니 🏓',
    content:
      '오늘 탁구 치러 갔는데 80대 할머니가 탁구 치시는 걸 봤어요! 실력이 정말 대단하셨는데, 저희가 놀라니까 "나도 젊었을 때 탁구 선수였단다"라고 하시더라구요. 정말 멋진 분이었습니다!',
    authorId: 'user333',
    authorName: '할머니팬',
    date: '2024-01-01',
    postType: '일반',
    category: '탁구',
    viewCount: 456,
    commentCount: 123,
  },
  {
    id: 16,
    title: '탁구 라켓 이름 짓기 🏓',
    content:
      '새로 산 탁구 라켓에 이름을 지어주고 싶은데 뭐가 좋을까요? Butterfly 라켓인데 "버터플라이킹"으로 하면 어떨까요? 아니면 "탁구마스터" 이런 식으로? 여러분 라켓 이름 있으시면 공유해주세요!',
    authorId: 'user444',
    authorName: '라켓네이머',
    date: '2023-12-31',
    postType: '일반',
    category: '탁구',
    viewCount: 145,
    commentCount: 34,
  },
  {
    id: 17,
    title: '탁구로 인연 만든 이야기 💕',
    content:
      '탁구 동호회에서 만난 분과 1년째 사귀고 있어요! 처음엔 탁구도 못 치던 분이었는데 지금은 제가 따라가기 바쁠 정도로 실력이 좋아지셨어요. 탁구가 인연이 되어서 정말 행복합니다!',
    authorId: 'user555',
    authorName: '탁구커플',
    date: '2023-12-30',
    postType: '일반',
    category: '탁구',
    viewCount: 378,
    commentCount: 98,
  },
  {
    id: 18,
    title: '탁구 치다가 생긴 로맨스 💕',
    content:
      '탁구장에서 만난 분과 6개월째 사귀고 있어요! 처음엔 탁구도 못 치던 분이었는데 지금은 제가 따라가기 바쁠 정도로 실력이 좋아지셨어요. 탁구가 인연이 되어서 정말 행복합니다!',
    authorId: 'user666',
    authorName: '탁구로맨스',
    date: '2023-12-29',
    postType: '일반',
    category: '탁구',
    viewCount: 445,
    commentCount: 123,
  },
  // 매치 포스트
  {
    id: 19,
    title: '탁구 매치 상대 구합니다',
    content:
      '서울 강남 지역에서 탁구 매치 상대를 구합니다. 실력은 중급 정도이고, 매주 토요일 오후에 치고 싶습니다. 연락처 남겨주세요!',
    authorId: 'user777',
    authorName: '탁구매처',
    date: '2024-01-20',
    postType: '매치',
    category: '탁구',
    matchLocation: '서울 강남구 탁구장',
    myElo: '1350',
    preferredElo: 'similar',
    validityPeriod: '7',
    viewCount: 34,
    commentCount: 12,
  },
  {
    id: 20,
    title: '탁구 친선 경기 상대',
    content:
      '부산 해운대 지역에서 탁구 친선 경기 상대를 구합니다. 실력에 관계없이 즐겁게 치실 분 환영합니다!',
    authorId: 'user888',
    authorName: '부산탁구',
    date: '2024-01-18',
    postType: '매치',
    category: '탁구',
    matchLocation: '부산 해운대구 탁구장',
    myElo: '1280',
    preferredElo: 'any',
    validityPeriod: '3',
    viewCount: 28,
    commentCount: 8,
  },
  {
    id: 21,
    title: '탁구 연습 상대 구합니다',
    content:
      '대구 수성구에서 탁구 연습 상대를 구합니다. 초급 실력이고, 실력 향상이 목표입니다. 매주 일요일 오전에 치고 싶습니다.',
    authorId: 'user999',
    authorName: '대구탁구',
    date: '2024-01-16',
    postType: '매치',
    category: '탁구',
    matchLocation: '대구 수성구 탁구장',
    myElo: '1100',
    preferredElo: 'similar',
    validityPeriod: '1',
    viewCount: 22,
    commentCount: 6,
  },
  {
    id: 22,
    title: '탁구 토너먼트 참가자 모집',
    content:
      '인천 연수구에서 탁구 토너먼트를 개최하려고 합니다. 참가자 16명을 모집합니다. 실력은 중급 이상이어야 합니다.',
    authorId: 'user111',
    authorName: '인천탁구',
    date: '2024-01-15',
    postType: '매치',
    category: '탁구',
    matchLocation: '인천 연수구 탁구장',
    myElo: '1420',
    preferredElo: 'higher',
    validityPeriod: '5',
    viewCount: 45,
    commentCount: 15,
  },
  // 멘토 포스트
  {
    id: 23,
    title: '탁구 레슨 제공합니다',
    content:
      '탁구 레슨을 제공합니다. 10년 경력의 탁구 지도자입니다. 초급부터 중급까지 체계적으로 가르쳐드립니다. 서울 강남 지역에서 가능합니다.',
    authorId: 'user222',
    authorName: '탁구코치',
    date: '2024-01-15',
    postType: '멘토',
    category: '탁구',
    location: '서울 강남',
    skillLevel: '초급~중급',
    experience: '10년',
    viewCount: 67,
    commentCount: 23,
  },
  {
    id: 24,
    title: '탁구 기초 레슨',
    content:
      '탁구 기초를 가르쳐드립니다. 서브, 리시브, 기본 스트로크부터 차근차근 배워보세요. 부산 서구 지역에서 가능합니다.',
    authorId: 'user333',
    authorName: '탁구선생',
    date: '2024-01-14',
    postType: '멘토',
    category: '탁구',
    location: '부산 서구',
    skillLevel: '초급',
    experience: '5년',
    viewCount: 42,
    commentCount: 18,
  },
  {
    id: 25,
    title: '탁구 고급 기술 레슨',
    content:
      '탁구 고급 기술을 가르쳐드립니다. 스핀 서브, 플랫 서브, 각종 스트로크 기술을 배워보세요. 대구 중구 지역에서 가능합니다.',
    authorId: 'user444',
    authorName: '탁구마스터',
    date: '2024-01-13',
    postType: '멘토',
    category: '탁구',
    location: '대구 중구',
    skillLevel: '중급~고급',
    experience: '15년',
    viewCount: 38,
    commentCount: 14,
  },
  {
    id: 26,
    title: '탁구 개인 레슨',
    content:
      '탁구 개인 레슨을 제공합니다. 1:1 맞춤형 레슨으로 빠른 실력 향상을 도와드립니다. 인천 남구 지역에서 가능합니다.',
    authorId: 'user555',
    authorName: '탁구개인교습',
    date: '2024-01-12',
    postType: '멘토',
    category: '탁구',
    location: '인천 남구',
    skillLevel: '전체',
    experience: '8년',
    viewCount: 31,
    commentCount: 11,
  },
];

const POSTS_PER_PAGE = 12;

export default function TableTennisPage() {
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
    console.log('탁구 광고 배너 클릭됨');
  };

  const handleWriteClick = () => {
    console.log('탁구 글쓰기 버튼 클릭됨');
    router.push(`${ROUTES.community.write}?category=table-tennis`);
  };

  return (
    <Container>
      <CategoryTabs />
      <CommunityLayout>
        <AdBanner
          title="🏓 탁구 대회 참가 신청"
          description="탁구 종목 대회에 참가하고 상금을 받아보세요!"
          onClick={handleAdClick}
        />
        <Content>
          <SearchInput
            onSearch={handleSearch}
            placeholder="탁구 게시글 검색..."
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
