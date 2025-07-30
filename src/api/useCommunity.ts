import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

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

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  date: string;
  category: string;
  postType: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
  dislikeCount: number;
  isLiked: boolean;
  isDisliked: boolean;
}

export interface PostsResponse {
  success: boolean;
  message: string;
  data: Post[];
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
