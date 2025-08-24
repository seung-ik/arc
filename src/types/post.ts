// 포스트 관련 타입들을 정의하는 파일

// ===== 포스트 폼 데이터 타입 =====

/**
 * 글 작성 폼 데이터 타입
 * - 포스트 작성 시 사용자가 입력하는 모든 필드
 */
export interface PostFormData {
  title: string;
  content: string;
  category: string;
  postType: string;
  matchLocation: string;
  myElo: string;
  preferredElo: string;
  participantCount: string;
  elo: string;
  location: string;
  tokenReward: string;
  matchDate: string;
  customParticipantCount: string;
}

// ===== 매치 관련 타입 =====

/**
 * 매치글 참가자 타입
 * - 매치글에 참가 신청한 사용자의 정보
 */
export interface MatchPostParticipant {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  elo: number | null;
  requestedAt: string;
  message: string;
}

/**
 * 매치글 참가자 목록 타입
 * - 매치글의 모든 참가자들을 상태별로 분류
 */
export interface MatchPostParticipants {
  confirmed: MatchPostParticipant[];
  pending: MatchPostParticipant[];
  rejected: MatchPostParticipant[];
}

/**
 * 매치글 매치 정보 타입
 * - 매치글의 핵심 매치 관련 정보
 */
export interface MatchPostMatchInfo {
  matchLocation: string;
  myElo: number;
  preferredElo: string;
  status: string;
  participantCount: number;
  createdAt: string;
  deadline: string;
  matchDate: string;
}

/**
 * 매치글 데이터 타입
 * - 매치글의 전체 정보를 포함
 * - 일반 포스트와 다른 구조를 가짐
 */
export interface MatchPostData {
  id: number;
  title: string;
  content: string;
  type: string;
  sportCategoryId: number;
  author: {
    id: number;
    nickname: string;
    profileImageUrl: string | null;
  };
  createdAt: string;
  updatedAt: string;
  matchInfo: MatchPostMatchInfo;
  participants: MatchPostParticipants;
}

/**
 * 매치글 단일조회 응답 타입
 * - 매치글 상세 조회 시 서버에서 반환하는 응답
 */
export interface MatchPostDetailResponse {
  success: boolean;
  data: MatchPostData;
  message: string;
}

// ===== 스포츠 카테고리 관련 타입 =====

/**
 * 스포츠 카테고리 데이터 타입
 * - 스포츠 종목별 분류 정보
 */
export interface SportCategoryData {
  id: number;
  name: string;
  sortOrder: number;
}

/**
 * 스포츠 카테고리 목록 응답 타입
 * - 모든 스포츠 카테고리를 조회할 때 서버에서 반환하는 응답
 */
export interface SportCategoriesResponse {
  success: boolean;
  message: string;
  data: SportCategoryData[];
}

// ===== 포스트 목록 관련 타입 =====

/**
 * 포스트 목록 응답 타입
 * - 포스트 목록 조회 시 서버에서 반환하는 응답
 * - 페이지네이션 정보를 포함
 */
export interface PostsResponse {
  success: boolean;
  message: string;
  data: Post[];
  pagination: {
    page: string;
    limit: string;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ===== 인기글 관련 타입 =====

/**
 * 인기글 작성자 타입
 * - 인기글의 작성자 기본 정보
 */
export interface HotPostAuthor {
  id: number;
  nickname: string;
}

/**
 * 인기글 스포츠 카테고리 타입
 * - 인기글의 스포츠 종목 정보
 */
export interface HotPostSportCategory {
  id: number;
  name: string;
}

/**
 * 인기글 아이템 타입
 * - 인기글의 상세 정보
 * - 인기도 점수와 조회수를 포함
 */
export interface HotPostItem {
  id: number;
  title: string;
  content: string;
  author: HotPostAuthor;
  sportCategory: HotPostSportCategory;
  popularityScore: number;
  createdAt: string;
  viewCount: number;
}

/**
 * 인기글 카테고리 그룹 타입
 * - 스포츠 종목별로 그룹화된 인기글 목록
 */
export interface HotPostCategoryGroup {
  categoryId: number;
  categoryName: string;
  posts: HotPostItem[];
}

/**
 * 인기글 목록 응답 타입
 * - 인기글 목록 조회 시 서버에서 반환하는 응답
 */
export interface HotPostsResponse {
  success: boolean;
  data: HotPostCategoryGroup[];
  message: string;
}

export interface StoredHotPostsResponse {
  success: boolean;
  data: StoredHotPost[];
  message: string;
}

export interface StoredHotPost {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    nickname: string;
  };
  sportCategory: {
    id: number;
    name: string;
  };
  popularityScore: string;
  createdAt: string;
  viewCount: number;
  rank: number;
  selectionDate: string;
  isRewarded: boolean;
}

// ===== 포스트 작성 관련 타입 =====

/**
 * 일반글 작성 요청 타입
 * - 새로운 일반 포스트를 작성할 때 서버로 전송하는 데이터
 */
export interface CreatePostRequest {
  sportCategoryId: number;
  title: string;
  content: string;
  type: string;
}

/**
 * 매치글 작성 요청 타입
 * - 새로운 매치 포스트를 작성할 때 서버로 전송하는 데이터
 * - 매치 관련 추가 정보를 포함
 */
export interface CreateMatchPostRequest {
  sportCategoryId: number;
  title: string;
  content: string;
  type: string;
  matchLocation: string;
  myElo: number;
  preferredElo: string;
  participantCount: string;
}

/**
 * 매치글 작성자 타입
 * - 매치글 작성자의 상세 정보
 * - 지갑 정보와 토큰 잔액을 포함
 */
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
}

/**
 * 매치글 스포츠 카테고리 타입
 * - 매치글의 스포츠 종목 정보
 */
export interface MatchPostSportCategory {
  id: number;
  name: string;
  sortOrder: number;
}

/**
 * 매치글 작성 응답 타입
 * - 매치글 작성 성공 시 서버에서 반환하는 응답
 */
export interface CreateMatchPostResponse {
  success: boolean;
  data: {
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
    participantCount: string;
    matchStatus: string;
    deadline: string;
    matchDate: string | null;
  };
  message: string;
}

/**
 * 일반글 작성자 타입
 * - 일반글 작성자의 기본 정보
 */
export interface Author {
  id: number;
  nickname: string | null;
  profileImageUrl: string | null;
}

/**
 * 일반글 작성 응답 타입
 * - 일반글 작성 성공 시 서버에서 반환하는 응답
 */
export interface CreatePostResponse {
  success: boolean;
  data: {
    id: number;
    title: string;
    content: string;
    type: string;
    isHidden: boolean;
    createdAt: string;
    updatedAt: string;
    author: Author;
  };
  message: string;
}

// ===== 포스트 삭제 관련 타입 =====

/**
 * 글 삭제 응답 타입
 * - 포스트 삭제 성공 시 서버에서 반환하는 응답
 */
export interface DeletePostResponse {
  success: boolean;
  data: {
    deleted: boolean;
  };
  message: string;
}

// ===== 포스트 상세 조회 관련 타입 =====

/**
 * 글 상세 조회 응답 타입
 * - 포스트 상세 조회 시 서버에서 반환하는 응답
 */
export interface PostDetailResponse {
  success: boolean;
  data: {
    id: number;
    title: string;
    content: string;
    type: string;
    isHidden: boolean;
    createdAt: string;
    updatedAt: string;
    author: Author;
  };
  message: string;
}

// ===== 포스트 반응 관련 타입 =====

/**
 * 글 좋아요 응답 타입
 * - 포스트에 좋아요를 추가/취소할 때 서버에서 반환하는 응답
 */
export interface LikePostResponse {
  success: boolean;
  data: {
    postId: number;
    success: boolean;
    isLiked: boolean;
    likeCount: number;
  };
  message: string;
}

/**
 * 글 싫어요 응답 타입
 * - 포스트에 싫어요를 추가/취소할 때 서버에서 반환하는 응답
 */
export interface HatePostResponse {
  success: boolean;
  data: {
    postId: number;
    success: boolean;
    isHated: boolean;
    hateCount: number;
  };
  message: string;
}

// ===== 포스트 데이터 타입 =====

/**
 * 일반글 데이터 타입
 * - 일반 포스트의 전체 정보
 * - 조회수, 댓글 수, 좋아요/싫어요 상태를 포함
 */
export interface GeneralPostData {
  id: number;
  title: string;
  content: string;
  type: string;
  isHidden: boolean;
  viewCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    nickname: string;
    profileImageUrl: string | null;
  };
  sportCategoryId: number;
  sportCategoryName: string;
  isLiked: boolean;
  isHated: boolean;
  likeCount: number;
  hateCount: number;
}

/**
 * 멘토글 데이터 타입
 * - 멘토 포스트의 정보
 * - GeneralPostData를 확장하여 멘토 관련 추가 필드를 포함
 */
export interface MentorPostData extends GeneralPostData {
  // type은 GeneralPostData에서 상속
  // CommunityPost에서 사용하는 필드명
  sport?: string;
  customSport?: string;
  elo?: string | number;
  location?: string;
  tokenReward?: string;
}

/**
 * 포스트 통합 타입
 * - 모든 종류의 포스트를 포함하는 유니온 타입
 * - 컴포넌트에서 포스트 타입을 구분하여 처리할 때 사용
 */
export type Post = GeneralPostData | MatchPostData | MentorPostData;
