'use client';

import styled from 'styled-components';
import { useState, useMemo } from 'react';
import BottomNavigation from '@/components/BottomNavigation';
import CategoryTabs from '@/components/CategoryTabs';
import CommunityPost from '@/components/CommunityPost';
import AdBanner from '@/components/AdBanner';
import SearchInput from '@/components/SearchInput';
import Pagination from '@/components/Pagination';
import CommunityLayout from '@/components/CommunityLayout';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.background};
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
  padding: ${(props) => props.theme.spacing.xl};
  color: ${(props) => props.theme.colors.textGray};
  font-size: ${(props) => props.theme.typography.fontSizes.base};
`;

// 배드민턴 관련 임시 게시글 데이터
const mockPosts = [
  {
    id: 1,
    title: '배드민턴 라켓 구매 후기',
    content:
      'Yonex Voltric Z-Force II를 구매했습니다. 라이트 헤드 무거운 그립 타입인데, 스매시가 정말 강력합니다. 특히 백핸드 클리어가 훨씬 안정적이에요.',
    authorId: 'user101',
    authorName: '배드민턴매니아',
    date: '2024-01-15',
    category: '후기',
    viewCount: 78,
    commentCount: 25,
  },
  {
    id: 2,
    title: '배드민턴 코트 추천',
    content:
      '서울 강남 지역에서 배드민턴을 칠 수 있는 좋은 코트를 찾고 있습니다. 주차가 편하고, 시설이 깨끗한 곳을 추천해주세요.',
    authorId: 'user789',
    authorName: '배드민턴러버',
    date: '2024-01-14',
    category: '추천',
    viewCount: 28,
    commentCount: 15,
  },
  {
    id: 3,
    title: '배드민턴 동호회 모집',
    content:
      '매주 일요일 오전에 배드민턴을 치는 동호회를 만들려고 합니다. 초보자도 환영하고, 실력 향상을 목표로 하는 분들 모집합니다.',
    authorId: 'user456',
    authorName: '배드민턴마스터',
    date: '2024-01-13',
    category: '모집',
    viewCount: 34,
    commentCount: 12,
  },
  {
    id: 4,
    title: '배드민턴 스매시 기술',
    content:
      '배드민턴 스매시를 시작한 지 3개월이 되었는데, 실력 향상이 더뎌서 고민입니다. 특히 파워와 정확도 조절에 어려움을 겪고 있어요.',
    authorId: 'user202',
    authorName: '배드민턴초보',
    date: '2024-01-12',
    category: '질문',
    viewCount: 45,
    commentCount: 18,
  },
  {
    id: 5,
    title: '배드민턴 서브 개선법',
    content:
      '서브가 항상 약점이었는데, 최근에 개선된 방법을 찾았습니다. 숏 서브와 롱 서브를 상황에 맞게 구사하니 훨씬 좋아졌어요.',
    authorId: 'user555',
    authorName: '배드민턴고수',
    date: '2024-01-11',
    category: '팁',
    viewCount: 67,
    commentCount: 23,
  },
  {
    id: 6,
    title: '배드민턴 대회 후기',
    content:
      '지난 주에 참가한 배드민턴 대회 후기를 공유합니다. 예상보다 높은 수준의 선수들이 참가해서 좋은 경험이 되었습니다.',
    authorId: 'user777',
    authorName: '배드민턴선수',
    date: '2024-01-10',
    category: '후기',
    viewCount: 89,
    commentCount: 31,
  },
  {
    id: 7,
    title: '배드민턴 라켓 스트링 교체',
    content:
      '라켓 스트링을 언제 교체해야 하는지 궁금합니다. 현재 사용 중인 스트링이 2개월 정도 되었는데 교체 시기가 된 건가요?',
    authorId: 'user888',
    authorName: '배드민턴초보',
    date: '2024-01-09',
    category: '질문',
    viewCount: 38,
    commentCount: 14,
  },
  {
    id: 8,
    title: '배드민턴 코트 예약 팁',
    content:
      '서울 지역 배드민턴 코트 예약에 대한 팁을 공유합니다. 평일 오전이 가장 예약하기 쉽고, 주말은 2주 전에 예약해야 합니다.',
    authorId: 'user999',
    authorName: '배드민턴러버',
    date: '2024-01-08',
    category: '정보',
    viewCount: 134,
    commentCount: 42,
  },
  {
    id: 9,
    title: '배드민턴 드롭샷 개선',
    content:
      '드롭샷을 개선하고 싶습니다. 현재 드롭샷이 너무 높게 올라가서 상대방에게 공격 기회를 주고 있어요. 연습 방법을 알려주세요.',
    authorId: 'user111',
    authorName: '배드민턴매니아',
    date: '2024-01-07',
    category: '질문',
    viewCount: 56,
    commentCount: 19,
  },
  {
    id: 10,
    title: '배드민턴 용품 추천',
    content:
      '배드민턴 초보자를 위한 필수 용품을 추천해드립니다. 라켓, 셔틀콕, 가방, 신발 등 기본적인 것부터 시작하시면 됩니다.',
    authorId: 'user222',
    authorName: '배드민턴마스터',
    date: '2024-01-06',
    category: '추천',
    viewCount: 112,
    commentCount: 35,
  },
  {
    id: 11,
    title: '배드민턴 동호회 후기',
    content:
      '지난 달에 가입한 배드민턴 동호회 후기를 공유합니다. 정말 좋은 분들과 함께해서 실력도 향상되고 즐거운 시간을 보내고 있어요.',
    authorId: 'user333',
    authorName: '배드민턴러버',
    date: '2024-01-05',
    category: '후기',
    viewCount: 76,
    commentCount: 28,
  },
  {
    id: 12,
    title: '배드민턴 대회 정보',
    content:
      '올해 상반기 배드민턴 대회 일정을 정리해드립니다. 각 대회별 참가 조건과 상금 정보도 포함되어 있습니다.',
    authorId: 'user444',
    authorName: '배드민턴선수',
    date: '2024-01-04',
    category: '정보',
    viewCount: 178,
    commentCount: 48,
  },
  {
    id: 13,
    title: '배드민턴 스트로크 분석',
    content: '프로 선수들의 스트로크를 분석해보았습니다. 각 선수별 특징과 배울 점을 정리해봤어요.',
    authorId: 'user555',
    authorName: '배드민턴고수',
    date: '2024-01-03',
    category: '분석',
    viewCount: 145,
    commentCount: 39,
  },
  {
    id: 14,
    title: '배드민턴 치다가 생긴 웃픈 일 😂',
    content:
      '오늘 배드민턴 치다가 스매시를 날렸는데 공이 네트에 걸려서 상대방 코트로 넘어가지 않았어요. 그런데 상대방이 "아, 아웃!"이라고 외치면서 공을 받지 않았는데, 정작 공은 인이었습니다. 다들 폭소했어요!',
    authorId: 'user666',
    authorName: '배드민턴실수왕',
    date: '2024-01-02',
    category: '일상',
    viewCount: 267,
    commentCount: 78,
  },
  {
    id: 15,
    title: '배드민턴 라켓으로 벌레 잡기 🦗',
    content:
      '오늘 배드민턴 치다가 코트에 벌레가 들어왔는데, 라켓으로 살살 밀어서 밖으로 보냈어요. 벌레도 배드민턴을 좋아하는 건가요? 아니면 우리가 너무 시끄러워서 들어온 걸까요? ㅋㅋ',
    authorId: 'user777',
    authorName: '벌레친구',
    date: '2024-01-01',
    category: '일상',
    viewCount: 134,
    commentCount: 42,
  },
  {
    id: 16,
    title: '배드민턴 동호회 맛집 탐방 🍜',
    content:
      '배드민턴 동호회 끝나고 다들 맛집으로 갔는데, 운동 후 먹는 음식이 정말 맛있었어요! 특히 땀 흘린 후 먹는 차가운 막국수가 최고였습니다. 운동하고 맛있는 거 먹는 게 인생의 낙이에요!',
    authorId: 'user888',
    authorName: '맛집탐험가',
    date: '2023-12-31',
    category: '일상',
    viewCount: 189,
    commentCount: 56,
  },
  {
    id: 17,
    title: '배드민턴 라켓 이름 짓기 🏸',
    content:
      '새로 산 배드민턴 라켓에 이름을 지어주고 싶은데 뭐가 좋을까요? Yonex 라켓인데 "요넥스킹"으로 하면 어떨까요? 아니면 "스매시마스터" 이런 식으로? 여러분 라켓 이름 있으시면 공유해주세요!',
    authorId: 'user999',
    authorName: '라켓네이머',
    date: '2023-12-30',
    category: '일상',
    viewCount: 145,
    commentCount: 34,
  },
  {
    id: 18,
    title: '배드민턴 코트에서 만난 고양이 🐱',
    content:
      '오늘 배드민턴 치러 갔는데 코트 옆에서 고양이가 구경하고 있었어요. 공이 날아갈 때마다 고개를 따라 움직이는 모습이 너무 귀여웠습니다. 고양이도 배드민턴을 배우고 싶어하는 걸까요?',
    authorId: 'user101',
    authorName: '고양이러버',
    date: '2023-12-29',
    category: '일상',
    viewCount: 223,
    commentCount: 67,
  },
];

const POSTS_PER_PAGE = 12;

export default function BadmintonPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // 검색 필터링
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return mockPosts;
    }

    const query = searchQuery.toLowerCase();
    return mockPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.authorName.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query),
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
    console.log('배드민턴 광고 배너 클릭됨');
  };

  return (
    <Container>
      <CategoryTabs />
      <CommunityLayout>
        <AdBanner
          title="🏸 배드민턴 대회 참가 신청"
          description="배드민턴 종목 대회에 참가하고 상금을 받아보세요!"
          onClick={handleAdClick}
        />
        <Content>
          <SearchInput onSearch={handleSearch} placeholder="배드민턴 게시글 검색..." />
          <PostList>
            {currentPosts.length > 0 ? (
              currentPosts.map((post) => <CommunityPost key={post.id} post={post} />)
            ) : (
              <NoResults>{searchQuery ? '검색 결과가 없습니다.' : '게시글이 없습니다.'}</NoResults>
            )}
          </PostList>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </Content>
      </CommunityLayout>
      <BottomNavigation />
    </Container>
  );
}
