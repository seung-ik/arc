import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';

// API 응답 타입 정의
interface LikeSignatureResponse {
  success: boolean;
  data: {
    contractABI: any[];
    postId: number;
    encodedData: string; // 0x로 시작하는 hex 문자열
    contractAddress: string;
  };
  message: string;
}

// 토큰 수확을 위한 응답 타입 정의
interface TokenClaimSignatureResponse {
  success: boolean;
  data: {
    to: string;
    amount: string;
    deadline: number;
    nonce: string;
    signature: string;
    contractAddress: string;
  };
  message: string;
}

// 한번에 모든 토큰 수확을 위한 응답 타입 정의
interface ClaimAllAccumulatedResponse {
  success: boolean;
  data: {
    postId: number;
    to: string;
    amount: string;
    deadline: number;
    nonce: string;
    signature: string;
  };
  message: string;
}

// API 요청 타입 정의
interface LikeSignatureRequest {
  postId: number;
}

// 토큰 수확을 위한 요청 타입 정의
interface TokenClaimSignatureRequest {
  postId: number;
  userAddress: string;
}

// 한번에 모든 토큰 수확을 위한 요청 타입 정의
interface ClaimAllAccumulatedRequest {
  address: string;
  reason: string;
}

// 컨트랙트 콜 전 필요한 데이터를 받아오는 API
export const useLikeSignatureData = () => {
  return useMutation<LikeSignatureResponse, Error, LikeSignatureRequest>({
    mutationFn: params =>
      api.post('/post-like-signature/likes/data', params).then(res => res.data),
  });
};

// 토큰 수확을 위한 서명 데이터를 받아오는 API
export const useClaimByLikeSignature = () => {
  return useMutation<
    TokenClaimSignatureResponse,
    Error,
    TokenClaimSignatureRequest
  >({
    mutationFn: params =>
      api.post('/post-like-signature/create', params).then(res => res.data),
  });
};

// 한번에 모든 토큰을 수확하는 API
export const useClaimAllAccumulatedTokens = () => {
  return useMutation<
    ClaimAllAccumulatedResponse,
    Error,
    ClaimAllAccumulatedRequest
  >({
    mutationFn: params =>
      api
        .post('/token-transactions/claim-all-accumulated', params)
        .then(res => res.data),
  });
};
