import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { LikePostResponse, HatePostResponse } from '@/types/post';
import { LikeCommentResponse } from '@/types/comment';

// ===== 포스트 반응 관련 API =====

/**
 * 포스트 좋아요
 * - 포스트에 좋아요를 추가하거나 취소
 * - 토글 방식으로 동작 (이미 좋아요한 경우 취소)
 * - 성공 시 관련 쿼리들 자동 갱신
 */
export const useLikePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: number): Promise<LikePostResponse> => {
      const response = await api.post(`/posts/${postId}/likes`);
      return response.data;
    },
    onSuccess: (data, postId) => {
      console.log('좋아요 성공:', data);
      // 관련 목록/상세 쿼리 무효화
      if (typeof postId === 'number') {
        queryClient.invalidateQueries({ queryKey: ['post-detail', postId] });
        queryClient.invalidateQueries({
          queryKey: ['match-post-detail', postId],
        });
        queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      }
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['hot-posts'] });
    },
    onError: error => {
      console.error('좋아요 실패:', error);
    },
  });
};

/**
 * 포스트 싫어요
 * - 포스트에 싫어요를 추가하거나 취소
 * - 토글 방식으로 동작 (이미 싫어요한 경우 취소)
 * - 성공 시 관련 쿼리들 자동 갱신
 */
export const useHatePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: number): Promise<HatePostResponse> => {
      const response = await api.post(`/posts/${postId}/hates`);
      return response.data;
    },
    onSuccess: (data, postId) => {
      console.log('싫어요 성공:', data);
      // 관련 목록/상세 쿼리 무효화
      if (typeof postId === 'number') {
        queryClient.invalidateQueries({ queryKey: ['post-detail', postId] });
        queryClient.invalidateQueries({
          queryKey: ['match-post-detail', postId],
        });
        queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      }
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['hot-posts'] });
    },
    onError: error => {
      console.error('싫어요 실패:', error);
    },
  });
};

// ===== 댓글 반응 관련 API =====

/**
 * 댓글 좋아요
 * - 댓글에 좋아요를 추가하거나 취소
 * - 토글 방식으로 동작
 * - 성공 시 댓글 목록과 포스트 정보 자동 갱신
 */
export const useLikeCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: number): Promise<LikeCommentResponse> => {
      const response = await api.post(`/comments/${commentId}/likes`);
      return response.data;
    },
    onSuccess: data => {
      console.log('댓글 좋아요 성공:', data);
      // 댓글 목록 다시 불러오기 (좋아요 수 업데이트)
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      // 포스트 상세 정보도 다시 불러오기 (댓글 관련 상태 변경)
      queryClient.invalidateQueries({ queryKey: ['post-detail'] });
      queryClient.invalidateQueries({ queryKey: ['match-post-detail'] });
    },
    onError: error => {
      console.error('댓글 좋아요 실패:', error);
    },
  });
};
