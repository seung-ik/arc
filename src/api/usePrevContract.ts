import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';

// ===== API 응답 타입 정의 =====

/**
 * 좋아요 서명 데이터 응답 타입
 * - 포스트 좋아요 시 블록체인 컨트랙트 호출에 필요한 데이터
 */
interface LikeSignatureResponse {
  success: boolean;
  error?: {
    message: string;
  };
  data: {
    contractABI: any[]; // 스마트 컨트랙트 ABI
    postId: number; // 포스트 ID
    encodedData: string; // 0x로 시작하는 hex 문자열 (컨트랙트 함수 호출 데이터)
    contractAddress: string; // 스마트 컨트랙트 주소
    to: string; // 수신자 주소
  };
  message: string;
}

/**
 * 토큰 수확 서명 데이터 응답 타입
 * - 개별 포스트 좋아요에 대한 토큰 수확 시 필요한 데이터
 */
interface TokenClaimSignatureResponse {
  success: boolean;
  data: {
    to: string; // 수신자 주소
    amount: string; // 수확할 토큰 양
    deadline: number; // 서명 만료 시간 (Unix timestamp)
    nonce: string; // 중복 방지를 위한 고유값
    signature: string; // 백엔드에서 생성한 서명
    contractAddress: string; // 스마트 컨트랙트 주소
    contractABI: any[]; // 스마트 컨트랙트 ABI
    postId: number; // 포스트 ID
  };
  message: string;
}

/**
 * 전체 누적 토큰 수확 서명 데이터 응답 타입
 * - 모든 누적된 토큰을 한 번에 수확할 때 필요한 데이터
 */
interface ClaimAllAccumulatedResponse {
  success: boolean;
  data: {
    signature: string; // 백엔드에서 생성한 서명
    nonce: string; // 중복 방지를 위한 고유값
    deadline: number; // 서명 만료 시간 (Unix timestamp)
    amount: string; // 수확할 총 토큰 양
    contractAddress: string; // 스마트 컨트랙트 주소
    contractABI: any[]; // 스마트 컨트랙트 ABI
    to: string; // 수신자 주소
  };
  message: string;
}

// ===== API 요청 타입 정의 =====

/**
 * 좋아요 서명 데이터 요청 타입
 * - 포스트 ID를 기반으로 서명 데이터 요청
 */
interface LikeSignatureRequest {
  postId: number;
}

/**
 * 토큰 수확 서명 데이터 요청 타입
 * - 특정 포스트에 대한 토큰 수확 서명 요청
 */
interface TokenClaimSignatureRequest {
  postId: number; // 포스트 ID
  userAddress: string; // 사용자 지갑 주소
}

/**
 * 전체 누적 토큰 수확 서명 데이터 요청 타입
 * - 모든 누적된 토큰을 한 번에 수확하기 위한 서명 요청
 */
interface ClaimAllAccumulatedRequest {
  address: string; // 사용자 지갑 주소
  reason?: string; // 수확 이유 (선택사항)
}

// ===== 블록체인 컨트랙트 관련 API 훅들 =====

/**
 * 좋아요 서명 데이터 조회
 * - 포스트 좋아요 시 블록체인 컨트랙트 호출에 필요한 데이터를 백엔드에서 가져옴
 * - ABI, 인코딩된 데이터, 컨트랙트 주소 등 포함
 * - 이 데이터를 사용하여 Wepin SDK로 실제 블록체인 트랜잭션 실행
 */
export const useLikeSignatureData = () => {
  return useMutation<LikeSignatureResponse, Error, LikeSignatureRequest>({
    mutationFn: params =>
      api.post('/post-like-signature/likes/data', params).then(res => res.data),
  });
};

/**
 * 개별 포스트 토큰 수확 서명 데이터 조회
 * - 특정 포스트에 대한 좋아요로 인한 토큰 수확을 위한 서명 데이터 요청
 * - 백엔드에서 생성한 서명과 함께 컨트랙트 호출에 필요한 모든 정보 제공
 * - 사용자가 개별 포스트에 대한 토큰을 수확할 때 사용
 */
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

/**
 * 전체 누적 토큰 수확 서명 데이터 조회
 * - 사용자가 여러 포스트에 좋아요를 눌러 누적된 모든 토큰을 한 번에 수확
 * - 백엔드에서 생성한 서명과 함께 컨트랙트 호출에 필요한 모든 정보 제공
 * - 사용자가 프로필 페이지에서 "전체 수확" 버튼을 클릭할 때 사용
 * - 개별 수확보다 효율적이며 가스비 절약 가능
 */
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
