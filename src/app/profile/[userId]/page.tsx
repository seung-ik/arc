'use client';

import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BottomNavigation from '@/components/BottomNavigation';
import ProfileHeader from '@/components/ProfileHeader';
import GameStatsGrid from '@/components/GameStatsGrid';
import ProfilePostList from '@/components/ProfilePostList';
import { useUserProfileApi, useUserPostsApi } from '@/api/useUser';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.background};
  padding-bottom: 80px;
  margin-top: ${props => props.theme.spacing.xl};
`;

const Content = styled.div`
  flex: 1;
`;

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.userId as string;

  // API 훅들 사용
  const { data: userProfileData } = useUserProfileApi(parseInt(userId));
  const { data: userPostsData } = useUserPostsApi(parseInt(userId));

  // 상태 관리
  const [user, setUser] = useState<any>(null);
  const [userElos, setUserElos] = useState<any[]>([]);
  const [userPosts, setUserPosts] = useState<any[]>([]);

  // 콘솔 출력 및 상태 업데이트
  useEffect(() => {
    if (userProfileData) {
      console.log('다른 사람 프로필 정보:', userProfileData);
      setUser(userProfileData.data);
      setUserElos([]); //TODO: 추후 수정
    }
  }, [userProfileData]);

  useEffect(() => {
    if (userPostsData) {
      console.log('다른 사람이 쓴 글 목록:', userPostsData);
      setUserPosts(userPostsData.data);
    }
  }, [userPostsData]);

  return (
    <Container>
      <Content>
        <ProfileHeader
          name={user?.nickname || ''}
          profileImage={user?.profileImageUrl || undefined}
          isMyProfile={false}
        />

        <GameStatsGrid userElos={userElos} />

        <ProfilePostList posts={userPosts} isMyProfile={false} />
      </Content>
      <BottomNavigation />
    </Container>
  );
}
