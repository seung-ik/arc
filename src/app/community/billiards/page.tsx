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

// 당구 관련 임시 게시글 데이터
const mockPosts = [
  {
    id: 1,
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
    id: 2,
    title: '당구 동호회 모집',
    content:
      '서울 강북 지역에서 당구를 치는 동호회를 만들려고 합니다. 실력에 관계없이 즐겁게 치실 분들 모집합니다. 매주 토요일 오후에 모입니다.',
    authorId: 'user456',
    authorName: '당구마스터',
    date: '2024-01-14',
    category: '모집',
    viewCount: 34,
    commentCount: 12,
  },
  {
    id: 3,
    title: '당구 큐 구매 후기',
    content:
      'Predator Ikon4-3를 구매했습니다. 카본 큐라 처음에는 무거워서 적응하기 어려웠지만, 한 달 정도 사용하니 정말 좋은 큐라는 걸 알 수 있었습니다.',
    authorId: 'user789',
    authorName: '당구매니아',
    date: '2024-01-13',
    category: '후기',
    viewCount: 52,
    commentCount: 18,
  },
];

const POSTS_PER_PAGE = 12;

export default function BilliardsPage() {
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
    console.log('당구 광고 배너 클릭됨');
  };

  const handleWriteClick = () => {
    console.log('당구 글쓰기 버튼 클릭됨');
    router.push(`${ROUTES.community.write}?category=billiards`);
  };

  return (
    <Container>
      <CategoryTabs />
      <CommunityLayout>
        <AdBanner
          title="🎱 당구 대회 참가 신청"
          description="당구 종목 대회에 참가하고 상금을 받아보세요!"
          onClick={handleAdClick}
        />
        <Content>
          <SearchInput onSearch={handleSearch} placeholder="당구 게시글 검색..." />
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
