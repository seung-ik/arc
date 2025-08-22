// 댓글과 답글 관련 타입들을 정의하는 파일

// ===== 댓글 관련 타입 =====

/**
 * 댓글 사용자 타입
 * - 댓글 작성자의 기본 정보
 */
export interface CommentUser {
  id: number;
  nickname: string | null;
  profileImageUrl: string | null;
}

/**
 * 댓글 데이터 타입
 * - 포스트에 달린 댓글의 전체 정보
 * - 답글 목록과 좋아요 수를 포함
 */
export interface CommentData {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: CommentUser;
  postId: number;
  replies: ReplyData[];
  likeCount: number;
}

/**
 * 댓글 작성 요청 타입
 * - 새로운 댓글을 작성할 때 필요한 데이터
 */
export interface CreateCommentRequest {
  postId: number;
  content: string;
}

/**
 * 댓글 작성 응답 타입
 * - 댓글 작성 성공 시 서버에서 반환하는 데이터
 */
export interface CreateCommentResponse {
  success: boolean;
  data: {
    id: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: number;
      nickname: string;
      profileImageUrl: string | null;
    };
    postId: number;
    replies: any[];
    likeCount: number;
  };
  message: string;
}

/**
 * 댓글 삭제 응답 타입
 * - 댓글 삭제 성공 시 서버에서 반환하는 데이터
 */
export interface DeleteCommentResponse {
  success: boolean;
  data: {
    deleted: boolean;
  };
  message: string;
}

/**
 * 댓글 목록 응답 타입
 * - 특정 포스트의 모든 댓글을 조회할 때 서버에서 반환하는 데이터
 */
export interface CommentsResponse {
  success: boolean;
  data: CommentData[];
  message: string;
}

// ===== 답글 관련 타입 =====

/**
 * 답글 데이터 타입
 * - 댓글에 달린 답글의 정보
 * - 댓글과 유사하지만 postId 대신 commentId를 가짐
 */
export interface ReplyData {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: CommentUser;
}

/**
 * 답글 작성 요청 타입
 * - 기존 댓글에 답글을 작성할 때 필요한 데이터
 */
export interface CreateReplyRequest {
  commentId: string;
  content: string;
}

/**
 * 답글 작성 응답 타입
 * - 답글 작성 성공 시 서버에서 반환하는 데이터
 */
export interface CreateReplyResponse {
  success: boolean;
  data: {
    id: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: number;
      nickname: string;
      profileImageUrl: string | null;
    };
    commentId: number;
  };
  message: string;
}

/**
 * 답글 삭제 응답 타입
 * - 답글 삭제 성공 시 서버에서 반환하는 데이터
 */
export interface DeleteReplyResponse {
  success: boolean;
  data: {
    deleted: boolean;
  };
  message: string;
}

// ===== 댓글 반응 관련 타입 =====

/**
 * 댓글 좋아요 응답 타입
 * - 댓글에 좋아요를 추가/취소할 때 서버에서 반환하는 데이터
 */
export interface LikeCommentResponse {
  success: boolean;
  data: {
    commentId: number;
    success: boolean;
    isLiked: boolean;
    likeCount: number;
  };
  message: string;
}
