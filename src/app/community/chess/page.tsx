'use client';

import styled from 'styled-components';
import BottomNavigation from '@/components/BottomNavigation';
import CategoryTabs from '@/components/CategoryTabs';
import CommunityPost from '@/components/CommunityPost';

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
      '매주 금요일 저녁에 체스를 두는 동호회를 만들려고 합니다. 초보자도 환영하고, 실력 향상을 목표로 하는 분들 모집합니다.',
    authorId: 'user789',
    authorName: '체스마스터',
    date: '2024-01-14',
    category: '모집',
    viewCount: 28,
    commentCount: 9,
  },
  {
    id: 3,
    title: '체스 실력 향상 팁',
    content:
      '체스를 시작한 지 6개월이 되었는데, 실력 향상이 더뎌서 고민입니다. 특히 중반전에서의 전략적 판단에 어려움을 겪고 있어요.',
    authorId: 'user202',
    authorName: '체스초보',
    date: '2024-01-13',
    category: '질문',
    viewCount: 41,
    commentCount: 17,
  },
];

export default function ChessPage() {
  return (
    <Container>
      <CategoryTabs />
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
