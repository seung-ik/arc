import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

// Types
export interface CreateMatchResultRequest {
  partnerNickname: string;
  sportCategoryId: number;
  myResult: 'win' | 'lose';
  isHandicap: boolean;
}

export interface MatchResult {
  id: number;
  partnerId: number;
  partnerNickname: string;
  senderId: number;
  senderNickname: string;
  sportCategoryId: number;
  sportCategoryName: string;
  myResult: 'win' | 'lose';
  isHandicap: boolean;
  status: 'pending' | 'accepted' | 'rejected';
  expiredTime: string;
  createdAt: string;
}

export interface CreateMatchResultResponse {
  success: boolean;
  data: MatchResult;
  message: string;
}

// Match Request Handling Types
export interface HandleMatchRequestRequest {
  action: 'accept' | 'reject';
}

export interface HandleMatchRequestResponse {
  success: boolean;
  data: MatchResult;
  message: string;
}

// Sent Match Results Types
export interface SentMatchResultsResponse {
  success: boolean;
  data: MatchResult[];
  message: string;
}

// Received Match Results Types
export interface ReceivedMatchResultsResponse {
  success: boolean;
  data: MatchResult[];
  message: string;
}

// API Hooks

/**
 * 매치 결과 등록
 * - 내가 상대방과의 매치 결과를 등록하여 상대방의 승인을 요청
 * - 상대방이 승인하면 ELO 점수가 반영됨
 */
export const useCreateMatchResultMutation = () => {
  return useMutation({
    mutationFn: async (
      data: CreateMatchResultRequest
    ): Promise<CreateMatchResultResponse> => {
      const response = await api.post('/match-results', data);
      return response.data;
    },
    onSuccess: data => {
      console.log('매치 결과 등록 성공:', data);
    },
    onError: error => {
      console.error('매치 결과 등록 실패:', error);
    },
  });
};

/**
 * 매치 요청 처리 (수락/거절)
 * - 나에게 온 매치 요청을 수락하거나 거절
 * - 수락 시 ELO 점수가 반영되고 매치 기록이 생성됨
 */
export const useHandleMatchRequestMutation = () => {
  return useMutation({
    mutationFn: async ({
      matchId,
      action,
    }: {
      matchId: number;
      action: 'accept' | 'reject';
    }): Promise<HandleMatchRequestResponse> => {
      const response = await api.post(`/match-results/${matchId}`, { action });
      return response.data;
    },
    onSuccess: data => {
      console.log('매치 요청 처리 성공:', data);
    },
    onError: error => {
      console.error('매치 요청 처리 실패:', error);
    },
  });
};

/**
 * 내가 보낸 매치 요청 목록 조회
 * - 내가 등록한 매치 결과들의 상태를 확인
 * - pending, accepted, rejected, expired 상태 확인 가능
 */
export const useSentMatchResultsApi = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['sent-match-results'],
    queryFn: async (): Promise<SentMatchResultsResponse> => {
      const response = await api.get('/match-results/sent');
      return response.data;
    },
    enabled,
  });
};

/**
 * 나에게 온 매치 요청 목록 조회
 * - 다른 사용자가 나에게 보낸 매치 요청들을 확인
 * - 수락/거절 대기 중인 요청들을 관리
 */
export const useReceivedMatchResultsApi = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['received-match-results'],
    queryFn: async (): Promise<ReceivedMatchResultsResponse> => {
      const response = await api.get('/match-results/received');
      return response.data;
    },
    enabled,
  });
};
