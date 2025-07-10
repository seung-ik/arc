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

// 체스 관련 임시 게시글 데이터
const mockPosts = [
  {
    id: 1,
    title: '체스 전략 공유',
    content:
      '오늘 상대방과 체스 대결에서 사용한 전략을 공유합니다. 킹스 인디언 어택을 사용했는데, 상대방이 예상보다 잘 막아내서 고전했습니다. 더 나은 전략이 있으시면 조언 부탁드립니다.',
    authorId: 'user456',
    authorName: '체스왕',
    date: '2024-01-15',
    category: '전략',
    viewCount: 32,
    commentCount: 12,
  },
  {
    id: 2,
    title: '체스 동호회 모집',
    content:
      '서울 강남 지역에서 체스를 두는 동호회를 만들려고 합니다. 실력에 관계없이 즐겁게 두실 분들 모집합니다. 매주 일요일 오후에 모입니다.',
    authorId: 'user789',
    authorName: '체스마스터',
    date: '2024-01-14',
    category: '모집',
    viewCount: 28,
    commentCount: 10,
  },
  {
    id: 3,
    title: '체스 실력 향상 팁',
    content:
      '체스를 시작한 지 6개월이 되었는데, 실력 향상이 더뎌서 고민입니다. 특히 중반전에서의 전략적 판단에 어려움을 겪고 있어요.',
    authorId: 'user101',
    authorName: '체스초보',
    date: '2024-01-13',
    category: '질문',
    viewCount: 45,
    commentCount: 16,
  },
];

const POSTS_PER_PAGE = 12;

export default function ChessPage() {
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
    console.log('체스 광고 배너 클릭됨');
  };

  const handleWriteClick = () => {
    console.log('체스 글쓰기 버튼 클릭됨');
    router.push(`${ROUTES.community.write}?category=chess`);
  };

  return (
    <Container>
      <CategoryTabs />
      <CommunityLayout>
        <AdBanner
          title="♟️ 체스 대회 참가 신청"
          description="체스 종목 대회에 참가하고 상금을 받아보세요!"
          onClick={handleAdClick}
        />
        <Content>
          <SearchInput onSearch={handleSearch} placeholder="체스 게시글 검색..." />
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
