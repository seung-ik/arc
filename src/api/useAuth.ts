import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { User } from './useUser';

// 1. 파라미터 타입 정의
export interface LoginParams {
  idToken: string;
  email: string;
  accounts: { network: string; address: string }[];
}

// 2. 리스폰스 타입 정의
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: User;
  };
}

export function useLoginApi() {
  return useMutation<LoginResponse, Error, LoginParams>({
    mutationFn: params =>
      api.post<LoginResponse>('/auth/login', params).then(res => res.data),
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
