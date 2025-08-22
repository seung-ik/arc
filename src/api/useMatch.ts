import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import {
  CreateMatchResultRequest,
  CreateMatchResultResponse,
  HandleMatchRequestResponse,
  SentMatchResultsResponse,
  ReceivedMatchResultsResponse,
  MatchHistoryResponse,
  CreateMatchRequestRequest,
  CreateMatchRequestResponse,
  RespondToMatchRequestRequest,
  RespondToMatchRequestResponse,
  RecommendedMatchPostsResponse,
  MatchPostsResponse,
} from '@/types/match';

/**
 * 매치 결과 등록
 * - 내가 상대방과의 매치 결과를 등록하여 상대방의 승인을 요청
 * - 상대방이 승인하면 ELO 점수가 반영됨
 */
export const useCreateMatchResultMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreateMatchResultRequest
    ): Promise<CreateMatchResultResponse> => {
      const response = await api.post('/match-results', data);
      return response.data;
    },
    onSuccess: data => {
      console.log('매치 결과 등록 성공:', data);
      // sent-match-results 쿼리 무효화하여 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ['sent-match-results'] });
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      matchId,
      action,
    }: {
      matchId: number;
      action: 'accept' | 'reject';
    }): Promise<HandleMatchRequestResponse> => {
      const response = await api.post(`/match-results/${matchId}/respond`, {
        action,
      });
      return response.data;
    },
    onSuccess: data => {
      console.log('매치 요청 처리 성공:', data);
      // 관련 쿼리들 무효화하여 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ['sent-match-results'] });
      queryClient.invalidateQueries({ queryKey: ['received-match-results'] });
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

/**
 * 내 매치 히스토리 조회
 * - 내가 지금까지 한 모든 매치 기록을 조회
 * - 스포츠 카테고리, 페이지네이션, 파트너 필터링 지원
 */
export const useMatchHistory = (
  sportCategoryId?: string,
  page: number = 1,
  limit: number = 10,
  partnerName?: string
) => {
  return useQuery({
    queryKey: ['matchHistory', sportCategoryId, page, limit, partnerName],
    queryFn: async (): Promise<MatchHistoryResponse> => {
      const params = new URLSearchParams();
      if (sportCategoryId) params.append('sport', sportCategoryId);
      if (page) params.append('page', page.toString());
      if (limit) params.append('limit', limit.toString());
      if (partnerName) params.append('partner', partnerName);

      const response = await api.get(
        `/users/me/match-results?${params.toString()}`
      );
      return response.data;
    },
    enabled: true, // 항상 활성화
  });
};

/**
 * 무한 스크롤을 위한 매치 히스토리 래퍼 함수
 * - useInfinitePagination 훅과 연동하여 사용
 */
export const createMatchHistoryFetcher = (
  sportCategoryId?: string,
  partnerName?: string
) => {
  return async (page: number, limit: number) => {
    const params = new URLSearchParams();
    if (sportCategoryId) params.append('sport', sportCategoryId);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (partnerName) params.append('partner', partnerName);

    const response = await api.get(
      `/users/me/match-results?${params.toString()}`
    );

    return {
      data: response.data.data.matches,
      pagination: {
        hasNext: response.data.pagination.hasNext,
        page: response.data.pagination.page,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages,
        hasPrev: response.data.pagination.hasPrev,
      },
    };
  };
};

/**
 * 매치글 참가 신청하기
 * - 특정 매치글에 참가 신청을 보냄
 * - 작성자가 승인/거절할 수 있음
 */
export const useApplyToMatchPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreateMatchRequestRequest
    ): Promise<CreateMatchRequestResponse> => {
      const response = await api.post('/match-posts/request', data);
      return response.data;
    },
    onSuccess: data => {
      console.log('매치글 참가 신청 성공:', data);
      // 매치글 상세 정보와 신청자 목록을 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ['match-post-detail'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: error => {
      console.error('매치글 참가 신청 실패:', error);
    },
  });
};

/**
 * 매치 신청 승인/거절하기
 * - 글작성자가 참가 신청을 승인하거나 거절
 * - 승인 시 참가자로 확정, 거절 시 신청 거부
 */
export const useRespondToMatchRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: RespondToMatchRequestRequest
    ): Promise<RespondToMatchRequestResponse> => {
      const response = await api.post('/match-posts/respond', data);
      return response.data;
    },
    onSuccess: data => {
      console.log('매치 신청 응답 성공:', data);
      // 매치글 상세 정보와 신청자 목록을 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ['match-post-detail'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: error => {
      console.error('매치 신청 응답 실패:', error);
    },
  });
};

// 추천 매치글 목록 조회 훅
export const useRecommendedMatchPostsApi = (
  limit: number = 3,
  sportCategoryId?: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['recommended-match-posts', limit, sportCategoryId],
    queryFn: async (): Promise<RecommendedMatchPostsResponse> => {
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      if (sportCategoryId) {
        params.append('sport', sportCategoryId.toString());
      }

      const response = await api.get(
        `/match-posts/recommended?${params.toString()}`
      );
      return response.data;
    },
    enabled,
  });
};

// 매치글 목록 조회 훅
export const useMatchPostsApi = (
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['match-posts', page, limit],
    queryFn: async (): Promise<MatchPostsResponse> => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await api.get(`/match-posts?${params.toString()}`);
      return response.data;
    },
    enabled,
  });
};
