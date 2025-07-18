'use client';

import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import BottomNavigation from '@/components/BottomNavigation';
import CategoryTabs from '@/components/CategoryTabs';
import CommunityLayout from '@/components/CommunityLayout';
import MatchPostDetail from '@/components/MatchPostDetail';
import GeneralPostDetail from '@/components/GeneralPostDetail';
import MatchMyPostDetail from '@/components/MatchMyPostDetail';
import GeneralMyPostDetail from '@/components/GeneralMyPostDetail';
import MentorMyPostDetail from '@/components/MentorMyPostDetail';
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
  padding: ${(props) => props.theme.spacing.md};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  color: ${(props) => props.theme.colors.textGray};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
  text-align: center;
`;

const ErrorMessage = styled.div`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  color: ${(props) => props.theme.colors.textGray};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const BackButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.textWhite};
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.lg};
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryHover};
  }
`;

// 임시 데이터 타입
interface Post {
  id: number;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  date: string;
  category: string;
  postType: string;
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  isLiked: boolean;
  isDisliked: boolean;
  // 매치 전용 필드들
  elo?: number;
  location?: string;
  desiredSkillLevel?: string;
  validityPeriod?: number;
  participants?: string[];
  maxParticipants?: number;
}

// 임시 데이터
const mockGeneralPost: Post = {
  id: 1,
  title: '테니스 라켓 구매 후기',
  content: `최근에 Wilson Pro Staff RF97을 구매했습니다. 처음에는 무거워서 적응하기 어려웠지만, 한 달 정도 사용하니 정말 좋은 라켓이라는 걸 알 수 있었습니다.\n\n특히 서브와 포핸드에서 위력이 대단합니다. 라켓 헤드가 작아서 정확도가 높고, 무게감이 있어서 파워도 충분합니다.\n\n다만 초보자에게는 조금 어려울 수 있어요. 적어도 1년 이상 테니스를 치신 분들에게 추천드립니다.\n\n스트링은 Luxilon Alu Power를 사용했는데, 이것도 정말 좋네요. 스핀과 컨트롤이 완벽하게 조화를 이룹니다.\n\n전체적으로 만족도가 높은 구매였습니다!`,
  authorId: 'user303',
  authorName: '테니스매니아',
  date: '2024-01-15',
  category: 'tennis',
  postType: 'general',
  viewCount: 89,
  likeCount: 31,
  dislikeCount: 5,
  commentCount: 8,
  isLiked: false,
  isDisliked: false,
};

const mockMatchPost: Post = {
  id: 2,
  title: '테니스 매치 구합니다 (ELO 1500-1600)',
  content: `안녕하세요! 테니스 매치 상대를 구합니다.\n\n- 실력: 중급 (ELO 1500-1600 정도)\n- 위치: 강남 테니스장\n- 시간: 주말 오후\n- 인원: 2명 (더블스 가능)\n\n실력이 비슷한 분들과 재미있게 치고 싶습니다. 연락주세요!`,
  authorId: 'user404',
  authorName: '테니스러버',
  date: '2024-01-20',
  category: 'tennis',
  postType: 'match',
  viewCount: 55,
  likeCount: 10,
  dislikeCount: 1,
  commentCount: 2,
  isLiked: false,
  isDisliked: false,
  elo: 1550,
  location: '강남 테니스장',
  desiredSkillLevel: '중급',
  validityPeriod: 7,
};

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = params.postId as string;
  const from = searchParams.get('from');

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));

        // 1. 먼저 from 파라미터 확인 (프로필에서 온 건지)
        const fromParam = searchParams.get('from');
        // 2. 그 다음 type 파라미터 확인 (매치 타입인지)
        const typeParam = searchParams.get('type');

        // 3. 두 정보를 조합해서 포스트 데이터 결정
        if (typeParam === 'match' || typeParam === '매치') {
          setPost(mockMatchPost);
        } else {
          setPost(mockGeneralPost);
        }
      } catch (err) {
        setError('게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId, searchParams]);

  const handleBackClick = () => {
    router.back();
  };

  if (loading) {
    return (
      <Container>
        <CategoryTabs />
        <CommunityLayout>
          <LoadingContainer>로딩 중...</LoadingContainer>
        </CommunityLayout>
        <BottomNavigation />
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container>
        <CategoryTabs />
        <CommunityLayout>
          <ErrorContainer>
            <ErrorMessage>{error || '게시글을 찾을 수 없습니다.'}</ErrorMessage>
            <BackButton onClick={handleBackClick}>돌아가기</BackButton>
          </ErrorContainer>
        </CommunityLayout>
        <BottomNavigation />
      </Container>
    );
  }

  // 쿼리 파라미터에 따라 다른 컴포넌트 렌더링
  const fromParam = searchParams.get('from');
  const typeParam = searchParams.get('type');

  // 내 글인지 확인 (from=profile이거나 현재 사용자가 작성자인 경우)
  const isMyPost = fromParam === 'profile' || post.authorId === 'current-user-id'; // TODO: 실제 사용자 ID로 변경

  const renderPostDetail = () => {
    if (isMyPost) {
      // 내 글인 경우 postType에 따라 다른 컴포넌트 렌더링
      switch (typeParam) {
        case 'match':
        case '매치':
          return <MatchMyPostDetail post={post} />;
        case 'mentor':
        case '멘토':
          return <MentorMyPostDetail post={post} />;
        case 'general':
        case '일반':
        default:
          return <GeneralMyPostDetail post={post} />;
      }
    } else {
      // 다른 사람의 글인 경우 postType에 따라 다른 컴포넌트 렌더링
      switch (typeParam) {
        case 'match':
        case '매치':
          return <MatchPostDetail post={post} />;
        case 'general':
        case '일반':
        case 'mentor':
        case '멘토':
        default:
          return <GeneralPostDetail post={post} />;
      }
    }
  };

  return (
    <Container>
      <CategoryTabs />
      <CommunityLayout>{renderPostDetail()}</CommunityLayout>
      <BottomNavigation />
    </Container>
  );
}
