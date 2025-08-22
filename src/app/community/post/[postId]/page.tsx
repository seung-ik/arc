'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import BottomNavigation from '@/components/BottomNavigation';
import PostDetailHeader from '@/components/PostDetailHeader';
import FullPageLoading from '@/components/FullPageLoading';
import GeneralPostDetail from '@/components/GeneralPostDetail';
import GeneralMyPostDetail from '@/components/GeneralMyPostDetail';
import MatchPostDetail from '@/components/MatchPostDetail';
import MatchMyPostDetail from '@/components/MatchMyPostDetail';
import MentorPostDetail from '@/components/MentorPostDetail';
import MentorMyPostDetail from '@/components/MentorMyPostDetail';
import { GeneralPostData, MatchPostData, MentorPostData } from '@/types/post';
import { usePostDetailApi, useMatchPostDetailApi } from '@/api/useCommunity';
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

  const isGeneralType =
    typeParam === 'general' || typeParam === '일반' || !typeParam;
  const isMatchType = typeParam === 'match' || typeParam === '매치';

  // 타입에 따라 다른 API 훅 사용
  const { data: generalPostData, isLoading: generalLoading } = usePostDetailApi(
    Number(postId),
    isGeneralType
  );

  const { data: matchPostData, isLoading: matchLoading } =
    useMatchPostDetailApi(Number(postId), isMatchType);

  const postDetailData = isMatchType ? matchPostData : generalPostData;
  const post = postDetailData?.data;
  const isMyPost =
    fromParam === 'profile' || post?.author.id === userProfile.id;

  const handleBackClick = () => router.back();

  const renderPostDetail = () => {
    if (!post) return null;

    if (isMyPost) {
      // 내 글인 경우 postType에 따라 다른 컴포넌트 렌더링
      switch (typeParam) {
        case 'match':
        case '매치':
          return <MatchMyPostDetail post={post as MatchPostData} />;
        case 'mentor':
        case '멘토':
          return <MentorMyPostDetail post={post as MentorPostData} />;
        case 'general':
        case '일반':
        default:
          return <GeneralMyPostDetail post={post as GeneralPostData} />;
      }
    } else {
      // 다른 사람 글인 경우 postType에 따라 다른 컴포넌트 렌더링
      switch (typeParam) {
        case 'match':
        case '매치':
          return <MatchPostDetail post={post as MatchPostData} />;
        case 'mentor':
        case '멘토':
          return <MentorPostDetail post={post as MentorPostData} />;
        case 'general':
        case '일반':
        default:
          return <GeneralPostDetail post={post as GeneralPostData} />;
      }
    }
  };

  const isLoading = matchLoading || generalLoading;
  if (isLoading) {
    return <FullPageLoading />;
  }

  return (
    <Container>
      <PostDetailHeader onBackClick={handleBackClick} />
      <CommunityLayout>{renderPostDetail()}</CommunityLayout>
      <BottomNavigation />
    </Container>
  );
}
