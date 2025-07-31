import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Post } from '@/types/post';

// Types
export interface SportCategory {
  id: number;
  name: string;
  sortOrder: number;
}

export interface SportCategoriesResponse {
  success: boolean;
  message: string;
  data: SportCategory[];
}



export interface PostsResponse {
  success: boolean;
  message: string;
  data: Post[];
}

// Create Post Types
export interface CreatePostRequest {
  sportCategoryId: number;
  title: string;
  content: string;
  type: string;
}

export interface Author {
  id: number;
  nickname: string | null;
  profileImageUrl: string | null;
}

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

// API Hooks
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

export const usePostsApi = (
  sportCategoryId?: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['posts', sportCategoryId],
    queryFn: async (): Promise<PostsResponse> => {
      const params = sportCategoryId ? { sport: sportCategoryId } : {};
      const response = await api.get('/posts', { params });
      return response.data;
    },
    enabled: enabled && !!sportCategoryId,
  });
};

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
