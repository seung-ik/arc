import { Comment as ApiComment } from '@/api/useCommunity';

export interface Comment {
  id: number;
  authorId: string;
  authorName: string;
  content: string;
  date: string;
  parentId?: number;
  replies?: Comment[];
  likeCount: number;
  isLiked?: boolean;
}

/**
 * API 댓글 데이터를 로컬 Comment 형식으로 변환
 */
export function normalizeApiComment(apiComment: ApiComment): Comment {
  return {
    id: apiComment.id,
    authorId: apiComment.user.id.toString(),
    authorName: apiComment.user.nickname || '익명',
    content: apiComment.content,
    date: apiComment.createdAt,
    likeCount: apiComment.likeCount,
    isLiked: false, // API에서 제공하지 않으므로 기본값
    replies: apiComment.replies?.map(normalizeApiReply) || [],
  };
}

/**
 * API 답글 데이터를 로컬 Comment 형식으로 변환
 */
export function normalizeApiReply(reply: any): Comment {
  return {
    id: reply.id,
    authorId: reply.user.id.toString(),
    authorName: reply.user.nickname || '익명',
    content: reply.content,
    date: reply.createdAt,
    likeCount: 0,
    isLiked: false,
  };
}

/**
 * API 댓글 목록을 로컬 Comment 목록으로 변환
 */
export function normalizeApiComments(apiComments: ApiComment[]): Comment[] {
  return apiComments.map(normalizeApiComment);
}
