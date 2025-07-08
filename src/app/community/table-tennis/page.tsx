'use client';

import styled from 'styled-components';
import BottomNavigation from '@/components/BottomNavigation';
import CategoryTabs from '@/components/CategoryTabs';
import CommunityPost from '@/components/CommunityPost';
import AdBanner from '@/components/AdBanner';

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
  padding: ${(props) => props.theme.spacing.md};
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
`;

// 탁구 관련 임시 게시글 데이터
const mockPosts = [
  {
    id: 1,
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
    id: 2,
    title: '탁구 라켓 구매 후기',
    content:
      'Butterfly Viscaria를 구매했습니다. 카본 라켓이라 처음에는 적응하기 어려웠지만, 한 달 정도 사용하니 정말 좋은 라켓이라는 걸 알 수 있었습니다.',
    authorId: 'user456',
    authorName: '탁구매니아',
    date: '2024-01-14',
    category: '후기',
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
    category: '질문',
    viewCount: 38,
    commentCount: 14,
  },
];

export default function TableTennisPage() {
  const handleAdClick = () => {
    console.log('탁구 광고 배너 클릭됨');
  };

  return (
    <Container>
      <CategoryTabs />
      <AdBanner
        title="🏓 탁구 대회 참가 신청"
        description="탁구 종목 대회에 참가하고 상금을 받아보세요!"
        onClick={handleAdClick}
      />
      <Content>
        <PostList>
          {mockPosts.map((post) => (
            <CommunityPost key={post.id} post={post} />
          ))}
        </PostList>
      </Content>
      <BottomNavigation />
    </Container>
  );
}
