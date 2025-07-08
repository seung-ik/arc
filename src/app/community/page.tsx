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
  },
  {
    id: 2,
    title: '당구 실력 향상 팁',
    content:
      '당구를 시작한 지 3개월이 되었는데, 실력 향상이 더뎌서 고민입니다. 특히 큐 각도 잡는 법과 파워 조절에 어려움을 겪고 있어요. 고수분들의 조언 부탁드립니다!',
    authorId: 'user202',
    authorName: '당구초보',
    date: '2024-01-15',
    category: '질문',
    viewCount: 67,
    commentCount: 23,
  },
  {
    id: 3,
    title: '탁구 동호회 모집합니다!',
    content:
      '매주 토요일 오후에 탁구를 치는 동호회를 만들려고 합니다. 초보자도 환영하고, 실력 향상을 목표로 하는 분들 모집합니다. 관심 있으신 분들은 댓글로 연락처 남겨주세요!',
    authorId: 'user123',
    authorName: '탁구마스터',
    date: '2024-01-15',
    category: '모집',
    viewCount: 45,
    commentCount: 8,
  },
  {
    id: 4,
    title: '체스 전략 공유',
    content:
      '오늘 상대방과 체스 대결에서 사용한 전략을 공유합니다. 킹스 인디언 어택을 사용했는데, 상대방이 예상보다 잘 막아내서 고전했습니다. 더 나은 전략이 있으시면 조언 부탁드립니다.',
    authorId: 'user456',
    authorName: '체스왕',
    date: '2024-01-14',
    category: '전략',
    viewCount: 32,
    commentCount: 12,
  },
  {
    id: 5,
    title: '배드민턴 라켓 구매 후기',
    content:
      'Yonex Voltric Z-Force II를 구매했습니다. 라이트 헤드 무거운 그립 타입인데, 스매시가 정말 강력합니다. 특히 백핸드 클리어가 훨씬 안정적이에요.',
    authorId: 'user101',
    authorName: '배드민턴매니아',
    date: '2024-01-14',
    category: '후기',
    viewCount: 78,
    commentCount: 25,
  },
  {
    id: 6,
    title: '바둑 기보 분석',
    content:
      '최근에 둔 바둑 기보를 분석해보았습니다. 중반에 실수로 인해 불리해졌지만, 후반에 상대방의 실수를 놓치지 않고 역전승을 거뒀습니다. 기보를 공유하니 참고해보세요.',
    authorId: 'user789',
    authorName: '바둑고수',
    date: '2024-01-13',
    category: '기보',
    viewCount: 56,
    commentCount: 18,
  },
  {
    id: 7,
    title: '테니스 코트 예약 팁',
    content:
      '서울 지역 테니스 코트 예약에 대한 팁을 공유합니다. 평일 오전이 가장 예약하기 쉽고, 주말은 한 달 전에 예약해야 합니다. 각 코트별 특징도 정리해봤어요.',
    authorId: 'user555',
    authorName: '테니스러버',
    date: '2024-01-13',
    category: '정보',
    viewCount: 123,
    commentCount: 42,
  },
  {
    id: 8,
    title: '당구 큐 관리법',
    content:
      '당구 큐 관리는 실력 향상에 매우 중요합니다. 큐 끝 부분의 청소와 보관법, 그리고 큐 끝 교체 시기를 알려드릴게요. 정기적인 관리로 큐 수명을 연장할 수 있습니다.',
    authorId: 'user333',
    authorName: '당구마스터',
    date: '2024-01-12',
    category: '팁',
    viewCount: 89,
    commentCount: 31,
  },
  {
    id: 9,
    title: '오늘 체스 치다가 벌어진 일 😅',
    content:
      '오늘 체스 치다가 상대방이 "체크메이트!"라고 외쳤는데, 정작 제가 이기고 있었어요. 상대방이 실수로 자신의 킹을 체크메이트 상태로 만들었네요. 다들 폭소했는데 상대방은 부끄러워서 얼굴 빨개지셨습니다!',
    authorId: 'user444',
    authorName: '체스실수왕',
    date: '2024-01-11',
    category: '일상',
    viewCount: 312,
    commentCount: 89,
  },
  {
    id: 10,
    title: '바둑 두다가 생긴 웃픈 일 😂',
    content:
      '바둑 두다가 상대방이 "아, 실수했어!"라고 외치면서 돌을 다시 두려고 했는데, 정작 실수한 건 제가었어요. 상대방이 돌을 다시 두는 걸 보고 "아, 맞다!"라고 따라했는데, 다들 웃어주셨어요.',
    authorId: 'user555',
    authorName: '바둑실수왕',
    date: '2024-01-10',
    category: '일상',
    viewCount: 245,
    commentCount: 67,
  },
  {
    id: 11,
    title: '탁구 치다가 만난 귀여운 할머니 🏓',
    content:
      '오늘 탁구 치러 갔는데 80대 할머니가 탁구 치시는 걸 봤어요! 실력이 정말 대단하셨는데, 저희가 놀라니까 "나도 젊었을 때 탁구 선수였단다"라고 하시더라구요. 정말 멋진 분이었습니다!',
    authorId: 'user666',
    authorName: '할머니팬',
    date: '2024-01-09',
    category: '일상',
    viewCount: 456,
    commentCount: 123,
  },
  {
    id: 12,
    title: '당구 치다가 생긴 로맨스 💕',
    content:
      '당구장에서 만난 분과 6개월째 사귀고 있어요! 처음엔 당구도 못 치던 분이었는데 지금은 제가 따라가기 바쁠 정도로 실력이 좋아지셨어요. 당구가 인연이 되어서 정말 행복합니다!',
    authorId: 'user777',
    authorName: '당구커플',
    date: '2024-01-08',
    category: '일상',
    viewCount: 378,
    commentCount: 98,
  },
  {
    id: 13,
    title: '체스로 인연 만든 이야기 ♟️',
    content:
      '체스 동호회에서 만난 분과 결혼했어요! 처음엔 체스만 두던 사이였는데, 점점 대화도 늘어나고 이제는 부부가 되었습니다. 체스가 우리의 인연이 되어서 정말 감사해요!',
    authorId: 'user888',
    authorName: '체스부부',
    date: '2024-01-07',
    category: '일상',
    viewCount: 567,
    commentCount: 145,
  },
  {
    id: 14,
    title: '바둑 두다가 만난 고수 할아버지 🎯',
    content:
      '바둑방에서 만난 90대 할아버지가 정말 고수셨어요! 저희가 놀라니까 "나도 젊었을 때 바둑 기사였단다"라고 하시더라구요. 정말 멋진 분이었고, 많은 것을 배웠습니다!',
    authorId: 'user999',
    authorName: '바둑학생',
    date: '2024-01-06',
    category: '일상',
    viewCount: 289,
    commentCount: 76,
  },
  {
    id: 15,
    title: '탁구 치다가 생긴 웃픈 일 😂',
    content:
      '탁구 치다가 상대방이 "아, 아웃!"이라고 외치면서 공을 받지 않았는데, 정작 공은 인이었어요. 상대방이 실수로 자신의 코트로 들어온 공을 아웃이라고 생각한 것 같아요. 다들 폭소했어요!',
    authorId: 'user101',
    authorName: '탁구실수왕',
    date: '2024-01-05',
    category: '일상',
    viewCount: 234,
    commentCount: 67,
  },
];

const POSTS_PER_PAGE = 12;

export default function CommunityPage() {
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
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAdClick = () => {
    console.log('광고 배너 클릭됨');
    // 실제로는 광고 링크로 이동하거나 모달을 열 수 있음
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
      <BottomNavigation />
    </Container>
  );
}
