import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import {
  CommentsResponse,
  CreateCommentRequest,
  CreateCommentResponse,
  CreateReplyRequest,
  CreateReplyResponse,
  DeleteCommentResponse,
  DeleteReplyResponse,
} from '@/types/comment';

// ===== 댓글 관련 API =====

/**
 * 댓글 목록 조회
 * - 특정 포스트의 모든 댓글을 조회
 * - 댓글과 답글을 포함한 전체 댓글 구조 반환
 */
export const useCommentsApi = (postId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async (): Promise<CommentsResponse> => {
      const response = await api.get(`/posts/${postId}/comments`);
      return response.data;
    },
    enabled: enabled && !!postId,
  });
};

/**
 * 댓글 작성
 * - 포스트에 새로운 댓글을 추가
 * - 댓글 내용과 포스트 ID 필요
 * - 성공 시 댓글 목록과 포스트 상세 정보 자동 갱신
 */
export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreateCommentRequest
    ): Promise<CreateCommentResponse> => {
      const response = await api.post('/comments', data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      console.log('댓글 작성 성공:', data);
      // 댓글 목록 다시 불러오기
      queryClient.invalidateQueries({
        queryKey: ['comments', variables.postId],
      });
      // 포스트 상세 정보 다시 불러오기 (댓글 수 업데이트)
      queryClient.invalidateQueries({
        queryKey: ['post-detail', variables.postId],
      });
      queryClient.invalidateQueries({
        queryKey: ['match-post-detail', variables.postId],
      });
    },
    onError: error => {
      console.error('댓글 작성 실패:', error);
    },
  });
};

/**
 * 답글 작성
 * - 기존 댓글에 답글을 추가
 * - 답글 내용과 부모 댓글 ID 필요
 * - 성공 시 댓글 목록 자동 갱신
 */
export const useCreateReplyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreateReplyRequest
    ): Promise<CreateReplyResponse> => {
      const response = await api.post('/replies', data);
      return response.data;
    },
    onSuccess: data => {
      console.log('대댓글 작성 성공:', data);
      // 댓글 목록 다시 불러오기 (답글이 포함된 댓글 구조 업데이트)
      // commentId로는 postId를 알 수 없으므로, 모든 comments 쿼리를 무효화
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
    onError: error => {
      console.error('대댓글 작성 실패:', error);
    },
  });
};

/**
 * 댓글 삭제
 * - 작성자가 자신의 댓글을 삭제
 * - 댓글에 달린 답글도 함께 삭제됨
 * - 성공 시 댓글 목록과 포스트 상세 정보 자동 갱신
 */
export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: number): Promise<DeleteCommentResponse> => {
      const response = await api.delete(`/comments/${commentId}`);
      return response.data;
    },
    onSuccess: data => {
      console.log('댓글 삭제 성공:', data);
      // 모든 댓글 목록 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      // 포스트 상세 정보 다시 불러오기 (댓글 수 업데이트)
      queryClient.invalidateQueries({ queryKey: ['post-detail'] });
      queryClient.invalidateQueries({ queryKey: ['match-post-detail'] });
    },
    onError: error => {
      console.error('댓글 삭제 실패:', error);
    },
  });
};

/**
 * 답글 삭제
 * - 작성자가 자신의 답글을 삭제
 * - 부모 댓글은 영향받지 않음
 * - 성공 시 댓글 목록 자동 갱신
 */
export const useDeleteReplyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (replyId: number): Promise<DeleteReplyResponse> => {
      const response = await api.delete(`/replies/${replyId}`);
      return response.data;
    },
    onSuccess: data => {
      console.log('대댓글 삭제 성공:', data);
      // 댓글 목록 다시 불러오기 (답글이 포함된 댓글 구조 업데이트)
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
    onError: error => {
      console.error('대댓글 삭제 실패:', error);
    },
  });
};
