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
