'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import BottomNavigation from '@/components/BottomNavigation';
import CommunityErrorLayout from '@/components/layout/CommunityErrorLayout';
import PostDetailHeader from '@/components/PostDetailHeader';
import FullPageLoading from '@/components/FullPageLoading';
import GeneralPostDetail from '@/components/GeneralPostDetail';
import GeneralMyPostDetail from '@/components/GeneralMyPostDetail';
import MatchPostDetail from '@/components/MatchPostDetail';
import MatchMyPostDetail from '@/components/MatchMyPostDetail';
import MentorPostDetail from '@/components/MentorPostDetail';
import MentorMyPostDetail from '@/components/MentorMyPostDetail';
import { GeneralPost, MentorPost } from '@/types/post';
import {
  usePostDetailApi,
  useMatchPostDetailApi,
  MatchPostType,
} from '@/api/useCommunity';
import { useAuthStore } from '@/stores/authStore';
import CommunityLayout from '../../components/CommunityLayout';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.background};
  padding-bottom: 80px;
  position: relative;
`;

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = params.postId as string;
  const { userProfile } = useAuthStore();

  // 쿼리 파라미터에 따라 다른 컴포넌트 렌더링
  const fromParam = searchParams.get('from');
  const typeParam = searchParams.get('type');

  // 타입에 따라 다른 API 훅 사용
  const {
    data: generalPostData,
    isLoading: generalLoading,
    error: generalError,
  } = usePostDetailApi(
    Number(postId),
    typeParam === 'general' || typeParam === '일반' || !typeParam
  );

  const {
    data: matchPostData,
    isLoading: matchLoading,
    error: matchError,
  } = useMatchPostDetailApi(
    Number(postId),
    typeParam === 'match' || typeParam === '매치'
  );

  // 현재 타입에 맞는 데이터와 로딩/에러 상태 선택
  const postDetailData =
    typeParam === 'match' || typeParam === '매치'
      ? matchPostData
      : generalPostData;
  const isLoading =
    typeParam === 'match' || typeParam === '매치'
      ? matchLoading
      : generalLoading;
  const apiError =
    typeParam === 'match' || typeParam === '매치' ? matchError : generalError;

  const handleBackClick = () => {
    router.back();
  };

  if (isLoading) {
    return <FullPageLoading />;
  }

  if (apiError || !postDetailData?.data) {
    return (
      <CommunityErrorLayout
        message={apiError?.message || '게시글을 찾을 수 없습니다.'}
        onBackClick={handleBackClick}
      />
    );
  }

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
          return <MatchMyPostDetail post={post as MatchPostType} />;
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
          return <MatchPostDetail post={post as MatchPostType} />;
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
      <PostDetailHeader onBackClick={handleBackClick} />
      <CommunityLayout>{renderPostDetail()}</CommunityLayout>
      <BottomNavigation />
    </Container>
  );
}
