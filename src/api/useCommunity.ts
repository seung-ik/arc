import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import {
  CreateMatchPostRequest,
  CreateMatchPostResponse,
  CreatePostRequest,
  CreatePostResponse,
  DeletePostResponse,
  HotPostsResponse,
  MatchPostDetailResponse,
  PostDetailResponse,
  PostsResponse,
  SportCategoriesResponse,
  StoredHotPostsResponse,
} from '@/types/post';
import { ImageUploadRequest, ImageUploadResponse } from '@/types/upload';

// ===== 스포츠 카테고리 관련 API =====

/**
 * 스포츠 카테고리 목록 조회
 * - 모든 스포츠 카테고리 정보를 가져옴
 * - 글 작성 시 카테고리 선택에 사용
 */
export const useSportCategoriesApi = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['sport-categories'],
    queryFn: async (): Promise<SportCategoriesResponse> => {
      const response = await api.get('/sport-categories');
      return response.data;
    },
    enabled,
  });
};

// ===== 포스트 관련 API =====

/**
 * 포스트 목록 조회
 * - 특정 스포츠 카테고리의 포스트들을 페이지네이션으로 조회
 * - 스포츠 카테고리별 필터링 지원
 * - fetchPosts 함수를 통해 수동으로 데이터 갱신 가능
 */
export const usePostsApi = (
  sportCategoryId?: number,
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true
) => {
  const query = useQuery({
    queryKey: ['posts', sportCategoryId, page, limit],
    queryFn: async (): Promise<PostsResponse> => {
      const params = {
        ...(sportCategoryId ? { sport: sportCategoryId } : {}),
        page: page.toString(),
        limit: limit.toString(),
      };
      const response = await api.get('/posts', { params });
      return response.data;
    },
    enabled: enabled && !!sportCategoryId,
  });

  // fetchPosts 함수를 직접 제공
  const fetchPosts = async (
    newPage?: number,
    newLimit?: number
  ): Promise<PostsResponse> => {
    const targetPage = newPage ?? page;
    const targetLimit = newLimit ?? limit;

    const params = {
      ...(sportCategoryId ? { sport: sportCategoryId } : {}),
      page: targetPage.toString(),
      limit: targetLimit.toString(),
    };

    const response = await api.get('/posts', { params });
    return response.data;
  };

  return {
    ...query,
    fetchPosts,
  };
};

/**
 * 일반 포스트 작성
 * - 새로운 일반 포스트를 생성
 * - 제목, 내용, 카테고리, 타입 정보 필요
 */
export const useCreatePostMutation = () => {
  return useMutation({
    mutationFn: async (
      data: CreatePostRequest
    ): Promise<CreatePostResponse> => {
      const response = await api.post('/posts', data);
      return response.data;
    },
    onSuccess: data => {
      console.log('글 작성 성공:', data);
    },
    onError: error => {
      console.error('글 작성 실패:', error);
    },
  });
};

/**
 * 매치 포스트 작성
 * - 새로운 매치 포스트를 생성
 * - 매치 관련 정보(장소, ELO, 참가인원 등) 포함
 * - 작성 성공 시 포스트 목록 자동 갱신
 */
export const useCreateMatchPostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      data: CreateMatchPostRequest
    ): Promise<CreateMatchPostResponse> => {
      const response = await api.post('/match-posts', data);
      return response.data;
    },
    onSuccess: data => {
      console.log('매치글 작성 성공:', data);
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: error => {
      console.error('매치글 작성 실패:', error);
    },
  });
};

/**
 * 포스트 상세 조회
 * - 특정 포스트의 상세 정보를 조회
 * - 포스트 ID를 기반으로 단일 포스트 정보 반환
 */
export const usePostDetailApi = (postId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['post-detail', postId],
    queryFn: async (): Promise<PostDetailResponse> => {
      const response = await api.get(`/posts/${postId}`);
      return response.data;
    },
    enabled: enabled && !!postId,
  });
};

/**
 * 포스트 삭제
 * - 작성자가 자신의 포스트를 삭제
 * - 삭제된 포스트는 복구 불가능
 * - 성공 시 관련 쿼리들 자동 갱신
 */
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number): Promise<DeletePostResponse> => {
      const response = await api.delete(`/posts/${postId}`);
      return response.data;
    },
    onSuccess: (data, postId) => {
      console.log('글 삭제 성공:', data);
      // 관련 쿼리들 무효화하여 최신 데이터 반영
      if (typeof postId === 'number') {
        // 포스트 상세 정보 무효화
        queryClient.invalidateQueries({ queryKey: ['post-detail', postId] });
        queryClient.invalidateQueries({
          queryKey: ['match-post-detail', postId],
        });
        // 댓글 목록 무효화
        queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      }
      // 포스트 목록 무효화
      queryClient.invalidateQueries({ queryKey: ['my-posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['hot-posts'] });
      queryClient.invalidateQueries({ queryKey: ['match-posts'] });
      queryClient.invalidateQueries({ queryKey: ['recommended-match-posts'] });
    },
    onError: error => {
      console.error('글 삭제 실패:', error);
    },
  });
};

// ===== 인기글 관련 API =====

/**
 * 인기글 목록 조회
 * - 인기도 점수가 높은 포스트들을 조회
 * - 스포츠 카테고리별로 그룹화되어 반환
 * - 메인 페이지나 사이드바에서 사용
 */
export const useHotPostsApi = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['hot-posts'],
    queryFn: async (): Promise<HotPostsResponse> => {
      const response = await api.get('/posts/hot');
      return response.data;
    },
    enabled,
  });
};

/**
 * 실시간 인기글 목록 조회
 * - 실시간으로 업데이트되는 인기글들을 조회
 * - 스포츠 카테고리별로 그룹화되어 반환
 * - 실시간 순위나 트렌딩 콘텐츠에 사용
 */
export const useRealtimeHotPostsApi = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['realtime-hot-posts'],
    queryFn: async (): Promise<StoredHotPostsResponse> => {
      const response = await api.get('/posts/hot/realtime');
      return response.data;
    },
    enabled,
  });
};

/**
 * 보상용 인기글 목록 조회
 * - 보상 지급 대상이 되는 인기글들을 조회
 * - 스포츠 카테고리별로 그룹화되어 반환
 * - 토큰 보상 시스템이나 리더보드에 사용
 */
export const useStoredHotPostsApi = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['stored-hot-posts'],
    queryFn: async (): Promise<StoredHotPostsResponse> => {
      const response = await api.get('/posts/hot/stored');
      return response.data;
    },
    enabled,
  });
};

// ===== 매치 포스트 관련 API =====

/**
 * 매치 포스트 상세 조회
 * - 특정 매치 포스트의 상세 정보를 조회
 * - 매치 정보, 참가자 목록, 신청 현황 등 포함
 * - 일반 포스트와 다른 구조를 가짐
 */
export const useMatchPostDetailApi = (
  postId: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['match-post-detail', postId],
    queryFn: async (): Promise<MatchPostDetailResponse> => {
      const response = await api.get(`/match-posts/${postId}`);
      return response.data;
    },
    enabled: enabled && !!postId,
  });
};

// ===== 이미지 업로드 관련 API =====

/**
 * 이미지 업로드
 * - 포스트 작성 시 이미지를 서버에 업로드
 * - FormData를 사용하여 파일 전송
 * - 업로드 성공 시 이미지 URL과 임시 ID 반환
 */
export const useImageUploadMutation = () => {
  return useMutation({
    mutationFn: async (
      data: ImageUploadRequest
    ): Promise<ImageUploadResponse> => {
      const formData = new FormData();
      formData.append('image', data.image);
      const response = await api.post('/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: data => {
      console.log('이미지 업로드 성공:', data);
    },
    onError: error => {
      console.error('이미지 업로드 실패:', error);
    },
  });
};
