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
];

export default function TennisPage() {
  const handleAdClick = () => {
    console.log('테니스 광고 배너 클릭됨');
  };

  return (
    <Container>
      <CategoryTabs />
      <AdBanner
        title="🎾 테니스 대회 참가 신청"
        description="테니스 종목 대회에 참가하고 상금을 받아보세요!"
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
