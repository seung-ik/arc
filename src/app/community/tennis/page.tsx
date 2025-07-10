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
import WriteButton from '@/components/WriteButton';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

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

// 테니스 관련 임시 게시글 데이터
const mockPosts = [
  {
    id: 1,
    title: '테니스 라켓 구매 후기',
    content:
      '최근에 Wilson Pro Staff RF97을 구매했습니다. 처음에는 무거워서 적응하기 어려웠지만, 한 달 정도 사용하니 정말 좋은 라켓이라는 걸 알 수 있었습니다. 특히 서브와 포핸드에서 위력이 대단합니다.',
    authorId: 'user303',
    authorName: '테니스매니아',
    date: '2024-01-15',
    category: '후기',
    viewCount: 89,
    commentCount: 31,
  },
  {
    id: 2,
    title: '테니스 코트 추천',
    content:
      '서울 강남 지역에서 테니스를 칠 수 있는 좋은 코트를 찾고 있습니다. 주차가 편하고, 시설이 깨끗한 곳을 추천해주세요. 가격도 적당한 곳이면 더 좋겠습니다.',
    authorId: 'user456',
    authorName: '테니스러버',
    date: '2024-01-14',
    category: '추천',
    viewCount: 67,
    commentCount: 23,
  },
  {
    id: 3,
    title: '테니스 동호회 모집',
    content:
      '매주 토요일 오후에 테니스를 치는 동호회를 만들려고 합니다. 초보자도 환영하고, 실력 향상을 목표로 하는 분들 모집합니다.',
    authorId: 'user789',
    authorName: '테니스마스터',
    date: '2024-01-13',
    category: '모집',
    viewCount: 45,
    commentCount: 18,
  },
  {
    id: 4,
    title: '테니스 서브 기술 팁',
    content:
      '테니스 서브를 시작한 지 6개월이 되었는데, 실력 향상이 더뎌서 고민입니다. 특히 스핀 서브와 플랫 서브 구사에 어려움을 겪고 있어요.',
    authorId: 'user202',
    authorName: '테니스초보',
    date: '2024-01-12',
    category: '질문',
    viewCount: 56,
    commentCount: 15,
  },
  {
    id: 5,
    title: '테니스 백핸드 개선법',
    content:
      '백핸드가 항상 약점이었는데, 최근에 개선된 방법을 찾았습니다. 양손 백핸드로 바꾸고 연습하니 훨씬 안정적이 되었어요.',
    authorId: 'user555',
    authorName: '테니스고수',
    date: '2024-01-11',
    category: '팁',
    viewCount: 78,
    commentCount: 29,
  },
  {
    id: 6,
    title: '테니스 대회 후기',
    content:
      '지난 주에 참가한 테니스 대회 후기를 공유합니다. 예상보다 높은 수준의 선수들이 참가해서 좋은 경험이 되었습니다.',
    authorId: 'user777',
    authorName: '테니스선수',
    date: '2024-01-10',
    category: '후기',
    viewCount: 92,
    commentCount: 34,
  },
  {
    id: 7,
    title: '테니스 라켓 스트링 교체',
    content:
      '라켓 스트링을 언제 교체해야 하는지 궁금합니다. 현재 사용 중인 스트링이 3개월 정도 되었는데 교체 시기가 된 건가요?',
    authorId: 'user888',
    authorName: '테니스초보',
    date: '2024-01-09',
    category: '질문',
    viewCount: 43,
    commentCount: 12,
  },
  {
    id: 8,
    title: '테니스 코트 예약 팁',
    content:
      '서울 지역 테니스 코트 예약에 대한 팁을 공유합니다. 평일 오전이 가장 예약하기 쉽고, 주말은 한 달 전에 예약해야 합니다.',
    authorId: 'user999',
    authorName: '테니스러버',
    date: '2024-01-08',
    category: '정보',
    viewCount: 156,
    commentCount: 47,
  },
  {
    id: 9,
    title: '테니스 포핸드 개선',
    content:
      '포핸드 스윙을 개선하고 싶습니다. 현재 스윙이 불안정해서 실수하는 경우가 많아요. 연습 방법을 알려주세요.',
    authorId: 'user111',
    authorName: '테니스매니아',
    date: '2024-01-07',
    category: '질문',
    viewCount: 67,
    commentCount: 21,
  },
  {
    id: 10,
    title: '테니스 용품 추천',
    content:
      '테니스 초보자를 위한 필수 용품을 추천해드립니다. 라켓, 공, 가방, 신발 등 기본적인 것부터 시작하시면 됩니다.',
    authorId: 'user222',
    authorName: '테니스마스터',
    date: '2024-01-06',
    category: '추천',
    viewCount: 134,
    commentCount: 38,
  },
  {
    id: 11,
    title: '테니스 동호회 후기',
    content:
      '지난 달에 가입한 테니스 동호회 후기를 공유합니다. 정말 좋은 분들과 함께해서 실력도 향상되고 즐거운 시간을 보내고 있어요.',
    authorId: 'user333',
    authorName: '테니스러버',
    date: '2024-01-05',
    category: '후기',
    viewCount: 89,
    commentCount: 26,
  },
  {
    id: 12,
    title: '테니스 대회 정보',
    content:
      '올해 상반기 테니스 대회 일정을 정리해드립니다. 각 대회별 참가 조건과 상금 정보도 포함되어 있습니다.',
    authorId: 'user444',
    authorName: '테니스선수',
    date: '2024-01-04',
    category: '정보',
    viewCount: 201,
    commentCount: 52,
  },
  {
    id: 13,
    title: '테니스 스트로크 분석',
    content: '프로 선수들의 스트로크를 분석해보았습니다. 각 선수별 특징과 배울 점을 정리해봤어요.',
    authorId: 'user555',
    authorName: '테니스고수',
    date: '2024-01-03',
    category: '분석',
    viewCount: 167,
    commentCount: 41,
  },
  {
    id: 14,
    title: '오늘 테니스 치다가 벌어진 일 😅',
    content:
      '오늘 테니스 치다가 서브할 때 라켓이 손에서 미끄러져서 뒤로 날아갔는데, 뒤에 있던 분이 완전 깜짝 놀라셨어요. 정말 죄송했는데 다들 웃어주셔서 다행이었습니다. 다음엔 라켓 그립을 더 꽉 잡아야겠어요!',
    authorId: 'user666',
    authorName: '테니스실수왕',
    date: '2024-01-02',
    category: '일상',
    viewCount: 234,
    commentCount: 67,
  },
  {
    id: 15,
    title: '테니스 코트에서 만난 귀여운 강아지 🐕',
    content:
      '오늘 테니스 치러 갔는데 코트 옆에서 주인이 테니스공 가지고 놀아주는 강아지를 봤어요. 공을 받아서 꼬리 흔들며 뛰어다니는 모습이 너무 귀여웠습니다. 테니스보다 강아지 구경에 더 집중했던 하루였어요 ㅋㅋ',
    authorId: 'user777',
    authorName: '강아지러버',
    date: '2024-01-01',
    category: '일상',
    viewCount: 189,
    commentCount: 45,
  },
  {
    id: 16,
    title: '테니스 라켓 이름 지어주기 🎾',
    content:
      '새로 산 테니스 라켓에 이름을 지어주고 싶은데 뭐가 좋을까요? Wilson Pro Staff인데 "윌슨이"로 하면 어떨까요? 아니면 "포핸드킹" 이런 식으로? 여러분 라켓 이름 있으시면 공유해주세요!',
    authorId: 'user888',
    authorName: '라켓네이머',
    date: '2023-12-31',
    category: '일상',
    viewCount: 156,
    commentCount: 38,
  },
  {
    id: 17,
    title: '테니스 치다가 생긴 웃픈 일 😂',
    content:
      '오늘 더블스 게임 중에 파트너가 "내가 받을게!"라고 외치고 뛰어왔는데, 정작 공은 제가 받았고 파트너는 공기만 치셨어요. 다들 폭소했는데 파트너는 부끄러워서 얼굴 빨개지셨네요. 이런 실수 다들 한 번씩은 하시죠?',
    authorId: 'user999',
    authorName: '웃음제조기',
    date: '2023-12-30',
    category: '일상',
    viewCount: 298,
    commentCount: 89,
  },
  {
    id: 18,
    title: '테니스 코트에서 벌어진 로맨스 💕',
    content:
      '테니스 동호회에서 만난 분과 1년째 사귀고 있어요! 처음엔 서브도 못 받던 분이었는데 지금은 제가 따라가기 바쁠 정도로 실력이 좋아지셨어요. 테니스가 인연이 되어서 정말 행복합니다. 여러분도 테니스로 인연 만드셨나요?',
    authorId: 'user101',
    authorName: '테니스커플',
    date: '2023-12-29',
    category: '일상',
    viewCount: 445,
    commentCount: 123,
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
          <SearchInput onSearch={handleSearch} placeholder="테니스 게시글 검색..." />
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
      <WriteButton onClick={handleWriteClick} />
      <BottomNavigation />
    </Container>
  );
}
