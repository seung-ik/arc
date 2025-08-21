import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

// Types
export interface CreateMatchResultRequest {
  partnerNickname: string;
  sportCategoryId: number;
  senderResult: 'win' | 'lose';
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
  senderResult: 'win' | 'lose';
  partnerResult: 'win' | 'lose';
  isHandicap: boolean;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  expiredTime: string;
  createdAt: string;
  playedAt: string;
  playedDate: string;
  confirmedAt: string;
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

// 매치 히스토리 타입
export interface MatchHistoryResult {
  id: number;
  partner: number;
  partner_nickname: string;
  sportCategory: string;
  result: 'win' | 'lose' | 'draw';
  isHandicap: boolean;
  created_at: string;
  elo_before: number;
  elo_after: number;
  elo_delta: number;
  partner_elo_before: number;
  partner_elo_after: number;
  partner_elo_delta: number;
  partner_current_elo: number;
  my_wins: number;
  my_losses: number;
  my_draws: number;
  my_total_matches: number;
  partner_wins: number;
  partner_losses: number;
  partner_draws: number;
  partner_total_matches: number;
}

export interface MatchHistoryResponse {
  success: boolean;
  data: {
    matches: MatchHistoryResult[];
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message: string;
}

// API Hooks

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

// 매치 신청 관련 타입들
export interface MatchRequestUser {
  id: number;
  walletUserId: string;
  walletAddress: string;
  nickname: string;
  email: string;
  createdAt: string;
  tokenAmount: string;
  availableToken: string;
  profileImageUrl: string | null;
  userElos: Array<{
    id: number;
    sportCategory: {
      id: number;
      name: string;
      sortOrder: number;
    };
    eloPoint: number;
    tier: string;
    percentile: string;
    wins: number;
    losses: number;
    draws: number;
    totalMatches: number;
  }>;
}

export interface MatchRequestPost {
  id: number;
  author: {
    id: number;
    walletUserId: string;
    walletAddress: string;
    nickname: string;
    email: string;
    createdAt: string;
    tokenAmount: string;
    availableToken: string;
    profileImageUrl: string | null;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  type: string;
  isHidden: boolean;
  viewCount: number;
  imageUrls: string[];
  matchLocation: string;
  myElo: number;
  preferredElo: string;
  participantCount: number;
  matchStatus: string;
  deadline: string;
  matchDate: string | null;
}

export interface MatchRequest {
  id: number;
  post: MatchRequestPost;
  user: MatchRequestUser;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  userElo: number | null;
  respondedAt: string | null;
  responseMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMatchRequestRequest {
  postId: number;
  message: string;
}

export interface CreateMatchRequestResponse {
  success: boolean;
  data: MatchRequest;
  message: string;
}

export interface RespondToMatchRequestRequest {
  postId: number;
  action: 'accept' | 'reject';
  responseMessage: string;
}

export interface RespondToMatchRequestResponse {
  success: boolean;
  data: {
    id: number;
    user: {
      id: number;
      walletUserId: string;
      walletAddress: string;
      nickname: string;
      email: string;
      createdAt: string;
      tokenAmount: string;
      availableToken: string;
      profileImageUrl: string | null;
    };
    status: 'pending' | 'approved' | 'rejected';
    message: string;
    userElo: number | null;
    respondedAt: string | null;
    responseMessage: string | null;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
}

// 매치글 관련 타입들
export interface MatchPostAuthor {
  id: number;
  walletUserId: string;
  walletAddress: string;
  nickname: string;
  email: string;
  createdAt: string;
  tokenAmount: string;
  availableToken: string;
  profileImageUrl: string | null;
  tutorialFirstPostCompleted: boolean;
  tutorialFirstMatchCompleted: boolean;
  tutorialFirstPostCompletedAt: string;
  tutorialFirstMatchCompletedAt: string | null;
}

export interface MatchPostSportCategory {
  id: number;
  name: string;
  sortOrder: number;
}

export interface MatchPostItem {
  id: number;
  author: MatchPostAuthor;
  content: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  type: string;
  isHidden: boolean;
  viewCount: number;
  sportCategory: MatchPostSportCategory;
  imageUrls: string[];
  matchLocation: string;
  myElo: number;
  preferredElo: string;
  participantCount: number;
  matchStatus: string;
  deadline: string;
  matchDate: string | null;
}

export interface RecommendedMatchPostsResponse {
  success: boolean;
  data: MatchPostItem[];
  message: string;
}

export interface MatchPostsResponse {
  success: boolean;
  data: {
    posts: MatchPostItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

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
