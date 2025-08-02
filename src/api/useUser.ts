import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

// 유저 정보 타입
export interface User {
  id: number;
  nickname: string | null;
  email: string;
  profileImageUrl: string | null;
  availableToken: string;
  tokenAmount: string;
  walletAddress: string;
}

// 닉네임 수정 요청 타입
interface InitNicknameParams {
  nickname: string;
}

// 스포츠 카테고리 타입
export interface SportCategory {
  id: number;
  name: string;
}

// 유저 ELO 정보 타입
export interface UserElo {
  id: number;
  sportCategory: SportCategory;
  eloPoint: number;
  tier: string;
  percentile: string;
}

// 내가 쓴 글 타입
export interface MyPost {
  id: number;
  title: string;
  content: string;
  type: string;
  isHidden: boolean;
  viewCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    nickname: string;
    profileImageUrl: string | null;
  };
  sportCategoryId: number;
  sportCategoryName: string;
  likeCount: number;
  hateCount: number;
}

// 내가 쓴 글 목록 응답 타입
interface MyPostsResponse {
  success: boolean;
  data: MyPost[];
  message: string;
}

interface UserProfileResponse {
  success: boolean;
  data: User;
  message: string;
}

// 프로필 조회 응답 타입
interface ProfileResponse {
  user: User;
  userElos: UserElo[];
}

// 닉네임 수정 응답 타입
interface InitNicknameResponse {
  success: boolean;
  message: string;
  data: User;
}

// 프로필 조회
export const useProfileApi = () => {
  return useQuery<ProfileResponse>({
    queryKey: ['profile'],
    queryFn: () => api.get('/users/me/profile').then(res => res.data),
  });
};

// 닉네임 수정
export const useInitNicknameApi = () => {
  return useMutation<InitNicknameResponse, Error, InitNicknameParams>({
    mutationFn: params =>
      api.put('/users/me/nickname', params).then(res => res.data),
  });
};

// 내가 쓴 글 목록 조회
export const useMyPostsApi = () => {
  return useQuery<MyPostsResponse>({
    queryKey: ['my-posts'],
    queryFn: () => api.get('/users/me/posts').then(res => res.data),
  });
};

// 다른 사람의 프로필 조회
export const useUserProfileApi = (userId: number) => {
  return useQuery<UserProfileResponse>({
    queryKey: ['user-profile', userId],
    queryFn: () => api.get(`/users/${userId}`).then(res => res.data),
    enabled: !!userId,
  });
};

// 다른 사람이 쓴 글 목록 조회
export const useUserPostsApi = (userId: number) => {
  return useQuery<MyPostsResponse>({
    queryKey: ['user-posts', userId],
    queryFn: () => api.get(`/users/${userId}/posts`).then(res => res.data),
    enabled: !!userId,
  });
};
