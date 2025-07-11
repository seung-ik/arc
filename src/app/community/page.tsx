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
  padding-bottom: 80px; /* 하단 네비게이션 높이만큼 패딩 */
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

// 자유글 임시 데이터 (모든 스포츠의 자유 게시글들)
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
    likeCount: 15,
    dislikeCount: 2,
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 2,
    title: '배드민턴 동호회 모집합니다',
    content:
      '서울 강남구에서 배드민턴 동호회를 모집합니다. 초급부터 중급까지 환영하며, 매주 토요일 오후에 활동합니다. 관심 있으신 분들은 댓글로 연락주세요!',
    authorId: 'user456',
    authorName: '배드민턴러버',
    date: '2024-01-14',
    category: '모집',
    viewCount: 156,
    commentCount: 23,
    likeCount: 28,
    dislikeCount: 1,
    isLiked: true,
    isDisliked: false,
  },
  {
    id: 3,
    title: '당구 실력 향상 팁 공유',
    content:
      '당구를 시작한 지 2년이 되었는데, 실력 향상에 도움이 되었던 팁들을 공유합니다. 기본 자세와 그립이 가장 중요하고, 연습할 때는 꾸준함이 핵심입니다.',
    authorId: 'user789',
    authorName: '당구마스터',
    date: '2024-01-13',
    category: '팁',
    viewCount: 234,
    commentCount: 45,
    likeCount: 67,
    dislikeCount: 3,
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 4,
    title: '탁구 대회 참가 후기',
    content:
      '지난 주에 열린 지역 탁구 대회에 참가했습니다. 예상보다 많은 참가자가 있어서 긴장했지만, 좋은 경험을 했습니다. 다음 대회도 참가할 예정입니다.',
    authorId: 'user101',
    authorName: '탁구선수',
    date: '2024-01-12',
    category: '후기',
    viewCount: 178,
    commentCount: 19,
    likeCount: 34,
    dislikeCount: 0,
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 5,
    title: '체스 전략 가이드',
    content:
      '체스 초보자를 위한 기본 전략을 정리해보았습니다. 오프닝, 미들게임, 엔드게임 각 단계별로 중요한 포인트들을 설명합니다.',
    authorId: 'user202',
    authorName: '체스마스터',
    date: '2024-01-11',
    category: '가이드',
    viewCount: 345,
    commentCount: 67,
    likeCount: 89,
    dislikeCount: 4,
    isLiked: true,
    isDisliked: false,
  },
  {
    id: 6,
    title: '바둑 기보 분석',
    content:
      '최근 프로 기사들의 대국을 분석해보았습니다. 특히 중반전에서의 판단과 수순이 인상적이었습니다. 바둑을 배우는 분들에게 도움이 될 것 같습니다.',
    authorId: 'user303',
    authorName: '바둑연구가',
    date: '2024-01-10',
    category: '분석',
    viewCount: 267,
    commentCount: 34,
    likeCount: 56,
    dislikeCount: 2,
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 7,
    title: '테니스 코트 예약 팁',
    content:
      '서울 지역 테니스 코트 예약에 대한 정보를 공유합니다. 인기 있는 코트들은 미리 예약해야 하고, 오프피크 시간을 이용하면 더 쉽게 예약할 수 있습니다.',
    authorId: 'user404',
    authorName: '테니스코치',
    date: '2024-01-09',
    category: '정보',
    viewCount: 189,
    commentCount: 28,
    likeCount: 42,
    dislikeCount: 1,
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 8,
    title: '배드민턴 라켓 스트링 교체',
    content:
      '배드민턴 라켓 스트링 교체 주기와 방법에 대해 알아보았습니다. 일반적으로 3-6개월마다 교체하는 것이 좋고, 사용 빈도에 따라 조정하면 됩니다.',
    authorId: 'user505',
    authorName: '배드민턴전문가',
    date: '2024-01-08',
    category: '팁',
    viewCount: 145,
    commentCount: 22,
    likeCount: 38,
    dislikeCount: 0,
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 9,
    title: '당구 큐 관리법',
    content:
      '당구 큐를 오래 사용하기 위한 관리법을 정리했습니다. 습도 관리, 클리닝, 보관 방법 등 큐 수명을 연장시키는 방법들을 소개합니다.',
    authorId: 'user606',
    authorName: '당구장주인',
    date: '2024-01-07',
    category: '가이드',
    viewCount: 198,
    commentCount: 31,
    likeCount: 51,
    dislikeCount: 2,
    isLiked: true,
    isDisliked: false,
  },
  {
    id: 10,
    title: '탁구 라켓 고르는 법',
    content:
      '탁구 라켓을 고를 때 고려해야 할 요소들을 정리했습니다. 플레이 스타일, 실력 수준, 예산에 따라 적합한 라켓이 달라집니다.',
    authorId: 'user707',
    authorName: '탁구코치',
    date: '2024-01-06',
    category: '가이드',
    viewCount: 223,
    commentCount: 39,
    likeCount: 63,
    dislikeCount: 1,
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 11,
    title: '체스 오프닝 정리',
    content:
      '체스 초보자를 위한 기본 오프닝들을 정리했습니다. 이탈리안 게임, 루이 로페즈, 스코치 게임 등 자주 사용되는 오프닝들을 소개합니다.',
    authorId: 'user808',
    authorName: '체스강사',
    date: '2024-01-05',
    category: '가이드',
    viewCount: 312,
    commentCount: 58,
    likeCount: 78,
    dislikeCount: 3,
    isLiked: false,
    isDisliked: false,
  },
  {
    id: 12,
    title: '바둑 입문 가이드',
    content:
      '바둑을 처음 배우는 분들을 위한 입문 가이드입니다. 기본 규칙부터 시작해서 간단한 전략까지 단계별로 설명합니다.',
    authorId: 'user909',
    authorName: '바둑입문자',
    date: '2024-01-04',
    category: '가이드',
    viewCount: 276,
    commentCount: 42,
    likeCount: 71,
    dislikeCount: 1,
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
