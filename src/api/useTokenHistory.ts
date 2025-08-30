import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

// 타입 정의
export interface TokenTransactionUser {
  id: number;
  nickname: string;
  walletAddress: string;
}

export interface TokenTransactionMetadata {
  action: string;
  source: string;
  context: string;
  reference_id: string;
  reference_type: string;
  blockchain_event?: string;
  balance_before: number;
  balance_after: number;
  available_token_before: string;
  available_token_after: string;
  post_id?: number;
  postId?: number;
  blockchainEvent?: string;
  nonce?: string;
  claim_type?: string;
  deadline?: string;
  event_source?: string;
  availableTokenAfter?: number;
  availableTokenBefore?: string;
}

export interface TokenTransactionSummary {
  action: string;
  target: string;
  reason: string;
  amount: string;
  direction: 'earned' | 'spent';
  timestamp: string;
}

export interface TokenTransaction {
  id: number;
  user: TokenTransactionUser;
  transactionType: string;
  status: string;
  transactionHash: string | null;
  description: string;
  metadata: TokenTransactionMetadata;
  processedAt: string;
  summary: TokenTransactionSummary;
}

export interface TokenTransactionUserInfo {
  id: number;
  walletUserId: string;
  walletAddress: string;
  nickname: string;
  email: string;
  createdAt: string;
  tokenAmount: string;
  availableToken: string;
  lastTokenSyncAt: string;
  profileImageUrl: string | null;
  tutorialFirstPostCompleted: boolean;
  tutorialFirstMatchCompleted: boolean;
  tutorialFirstPostCompletedAt: string | null;
  tutorialFirstMatchCompletedAt: string | null;
}

export interface TokenTransactionResponse {
  message: string;
  data: {
    transactions: TokenTransaction[];
    user: TokenTransactionUserInfo;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TokenTransactionParams {
  page?: number;
  limit?: number;
}

// 토큰 누적 관련 타입 정의
export interface TokenAccumulationMetadata {
  tutorial_type?: string;
  [key: string]: any; // 추가 메타데이터를 위한 유연한 타입
}

export interface TokenAccumulationSummary {
  action: string;
  source: string;
  reason: string;
  amount: string;
  status: string;
  canClaim: boolean;
}

export interface TokenAccumulation {
  id: number;
  walletAddress: string;
  reason: string;
  amount: number;
  type: string;
  nonce: string;
  status: 'pending' | 'claimed' | 'expired';
  claimTxHash: string | null;
  claimedAt: string | null;
  createdAt: string;
  updatedAt: string;
  metadata: TokenAccumulationMetadata;
  summary: TokenAccumulationSummary;
}

export interface TokenAccumulationSummaryData {
  totalPending: number;
  totalClaimed: number;
  totalExpired: number;
  totalAmount: number;
}

export interface TokenAccumulationResponse {
  message: string;
  data: {
    accumulations: TokenAccumulation[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    summary: TokenAccumulationSummaryData;
  };
}

export interface TokenAccumulationParams {
  page?: number;
  limit?: number;
}

// API 함수
const fetchTokenTransactions = async (
  params: TokenTransactionParams = {}
): Promise<TokenTransactionResponse> => {
  const { page = 1, limit = 20 } = params;

  const response = await api.get('/token-transactions', {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};

// 토큰 누적 내역 조회 API 함수
const fetchTokenAccumulations = async (
  params: TokenAccumulationParams = {}
): Promise<TokenAccumulationResponse> => {
  const { page = 1, limit = 20 } = params;

  const response = await api.get('/token-accumulations', {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};

// React Query 훅
export const useTokenTransactions = (params: TokenTransactionParams = {}) => {
  const { page = 1, limit = 20 } = params;

  return useQuery({
    queryKey: ['token-transactions', page, limit],
    queryFn: () => fetchTokenTransactions({ page, limit }),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};

// 토큰 누적 내역 조회 훅
export const useTokenAccumulations = (params: TokenAccumulationParams = {}) => {
  const { page = 1, limit = 20 } = params;

  return useQuery({
    queryKey: ['token-accumulations', page, limit],
    queryFn: () => fetchTokenAccumulations({ page, limit }),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};

// 페이지네이션을 위한 무한 스크롤 훅 (필요시 사용)
export const useInfiniteTokenTransactions = (limit: number = 20) => {
  return useInfiniteQuery({
    queryKey: ['token-transactions-infinite', limit],
    queryFn: ({ pageParam = 1 }) =>
      fetchTokenTransactions({ page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      if (lastPage.data.page < lastPage.data.totalPages) {
        return lastPage.data.page + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// 토큰 누적 내역 무한 스크롤 훅
export const useInfiniteTokenAccumulations = (limit: number = 20) => {
  return useInfiniteQuery({
    queryKey: ['token-accumulations-infinite', limit],
    queryFn: ({ pageParam = 1 }) =>
      fetchTokenAccumulations({ page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      if (lastPage.data.page < lastPage.data.totalPages) {
        return lastPage.data.page + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
