// 매치 관련 타입들을 정의하는 파일

// ===== 매치 결과 관련 타입 =====

// 매치 결과 생성 요청
export interface CreateMatchResultRequest {
  partnerNickname: string;
  sportCategoryId: number;
  senderResult: 'win' | 'lose';
  isHandicap: boolean;
}

// 매치 결과 데이터
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

// 매치 결과 생성 응답
export interface CreateMatchResultResponse {
  success: boolean;
  data: MatchResult;
  message: string;
}

// ===== 매치 요청 처리 관련 타입 =====

// 매치 요청 처리 요청
export interface HandleMatchRequestRequest {
  action: 'accept' | 'reject';
}

// 매치 요청 처리 응답
export interface HandleMatchRequestResponse {
  success: boolean;
  data: MatchResult;
  message: string;
}

// 보낸 매치 결과 목록 응답
export interface SentMatchResultsResponse {
  success: boolean;
  data: MatchResult[];
  message: string;
}

// 받은 매치 결과 목록 응답
export interface ReceivedMatchResultsResponse {
  success: boolean;
  data: MatchResult[];
  message: string;
}

// ===== 매치 히스토리 관련 타입 =====

// 매치 히스토리 결과
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

// 매치 히스토리 응답
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

// ===== 매치 신청 관련 타입 =====

// 매치 신청 사용자
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

// 매치 신청 포스트
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

// 매치 신청
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

// 매치 신청 생성 요청
export interface CreateMatchRequestRequest {
  postId: number;
  message: string;
}

// 매치 신청 생성 응답
export interface CreateMatchRequestResponse {
  success: boolean;
  data: MatchRequest;
  message: string;
}

// 매치 신청 응답 요청
export interface RespondToMatchRequestRequest {
  postId: number;
  action: 'accept' | 'reject';
  responseMessage: string;
}

// 매치 신청 응답 응답
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

// ===== 매치 포스트 관련 타입 =====

// 매치 포스트 작성자
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

// 매치 포스트 스포츠 카테고리
export interface MatchPostSportCategory {
  id: number;
  name: string;
  sortOrder: number;
}

// 매치 포스트 아이템
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
  matchDate: string;
}

// 추천 매치 포스트 응답
export interface RecommendedMatchPostsResponse {
  success: boolean;
  data: MatchPostItem[];
  message: string;
}

// 매치 포스트 목록 응답
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
