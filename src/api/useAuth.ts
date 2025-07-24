import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';

// 1. 파라미터 타입 정의
export interface LoginParams {
  idToken: string;
  email: string;
  accounts: { network: string; address: string }[];
}

// 2. 리스폰스 타입 정의
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    // 기타 유저 정보
  };
  // 필요시 추가 필드
}

export function useLoginApi() {
  return useMutation<LoginResponse, Error, LoginParams>({
    mutationFn: params =>
      api.post<LoginResponse>('/login', params).then(res => res.data),
  });
}

export function useLogoutApi() {
  return useMutation({
    mutationFn: () => api.post('/logout').then(res => res.data),
    onSuccess: () => {
      localStorage.removeItem('accessToken');
    },
  });
}
