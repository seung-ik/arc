'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import CategoryTabs from '../../component/CategoryTabs';
import CommunityLayout from '../../component/CommunityLayout';
import BottomNavigation from '@/components/BottomNavigation';
import GeneralPostDetail from '@/components/GeneralPostDetail';
import GeneralMyPostDetail from '@/components/GeneralMyPostDetail';
import MatchPostDetail from '@/components/MatchPostDetail';
import MatchMyPostDetail from '@/components/MatchMyPostDetail';
import MentorPostDetail from '@/components/MentorPostDetail';
import MentorMyPostDetail from '@/components/MentorMyPostDetail';
import { GeneralPost, MatchPost, MentorPost } from '@/types/post';
import { usePostDetailApi } from '@/api/useCommunity';
import { useAuthStore } from '@/stores/authStore';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.background};
  padding-bottom: 80px;
  position: relative;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: ${props => props.theme.typography.fontSizes.lg};
  color: ${props => props.theme.colors.textGray};
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
  font-size: ${props => props.theme.typography.fontSizes.lg};
  color: ${props => props.theme.colors.textGray};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const BackButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textWhite};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.typography.fontSizes.base};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }
`;

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = params.postId as string;
  const { userProfile } = useAuthStore();

  // API 호출
  const {
    data: postDetailData,
    isLoading,
    error: apiError,
  } = usePostDetailApi(Number(postId));

  console.log('API 호출 결과:', {
    postDetailData,
    isLoading,
    apiError,
    postId: Number(postId),
  });

  const handleBackClick = () => {
    router.back();
  };

  if (isLoading) {
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

  if (apiError || !postDetailData?.data) {
    return (
      <Container>
        <CategoryTabs />
        <CommunityLayout>
          <ErrorContainer>
            <ErrorMessage>
              {apiError?.message || '게시글을 찾을 수 없습니다.'}
            </ErrorMessage>
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
  const post = postDetailData?.data;

  // 내 글인지 확인 (from=profile이거나 현재 사용자가 작성자인 경우)
  const isMyPost =
    fromParam === 'profile' || post?.author.id === userProfile.id;

  const renderPostDetail = () => {
    if (!post) return null;

    if (isMyPost) {
      // 내 글인 경우 postType에 따라 다른 컴포넌트 렌더링
      switch (typeParam) {
        case 'match':
        case '매치':
          return <MatchMyPostDetail post={post as MatchPost} />;
        case 'mentor':
        case '멘토':
          return <MentorMyPostDetail post={post as MentorPost} />;
        case 'general':
        case '일반':
        default:
          return <GeneralMyPostDetail post={post as GeneralPost} />;
      }
    } else {
      // 다른 사람 글인 경우 postType에 따라 다른 컴포넌트 렌더링
      switch (typeParam) {
        case 'match':
        case '매치':
          return <MatchPostDetail post={post as MatchPost} />;
        case 'mentor':
        case '멘토':
          return <MentorPostDetail post={post as MentorPost} />;
        case 'general':
        case '일반':
        default:
          return <GeneralPostDetail post={post as GeneralPost} />;
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
