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

// Create Comment Types
export interface CreateCommentRequest {
  postId: number;
  content: string;
}

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

// Create Reply Types
export interface CreateReplyRequest {
  commentId: string;
  content: string;
}

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

// Comment List Types
export interface CommentUser {
  id: number;
  nickname: string | null;
  profileImageUrl: string | null;
}

export interface Reply {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: CommentUser;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: CommentUser;
  postId: number;
  replies: Reply[];
  likeCount: number;
}

export interface CommentsResponse {
  success: boolean;
  data: Comment[];
  message: string;
}

// Delete Post Types
export interface DeletePostResponse {
  success: boolean;
  data: {
    deleted: boolean;
  };
  message: string;
}

// Delete Comment Types
export interface DeleteCommentResponse {
  success: boolean;
  data: {
    deleted: boolean;
  };
  message: string;
}

// Delete Reply Types
export interface DeleteReplyResponse {
  success: boolean;
  data: {
    deleted: boolean;
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

// Like Post Types
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

// Hate Post Types
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

// Like Comment Types
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

export const useCreateCommentMutation = () => {
  return useMutation({
    mutationFn: async (
      data: CreateCommentRequest
    ): Promise<CreateCommentResponse> => {
      const response = await api.post('/comments', data);
      return response.data;
    },
    onSuccess: data => {
      console.log('댓글 작성 성공:', data);
    },
    onError: error => {
      console.error('댓글 작성 실패:', error);
    },
  });
};

export const useCreateReplyMutation = () => {
  return useMutation({
    mutationFn: async (
      data: CreateReplyRequest
    ): Promise<CreateReplyResponse> => {
      const response = await api.post('/replies', data);
      return response.data;
    },
    onSuccess: data => {
      console.log('대댓글 작성 성공:', data);
    },
    onError: error => {
      console.error('대댓글 작성 실패:', error);
    },
  });
};

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

export const useDeletePostMutation = () => {
  return useMutation({
    mutationFn: async (postId: number): Promise<DeletePostResponse> => {
      const response = await api.delete(`/posts/${postId}`);
      return response.data;
    },
    onSuccess: data => {
      console.log('글 삭제 성공:', data);
    },
    onError: error => {
      console.error('글 삭제 실패:', error);
    },
  });
};

export const useDeleteCommentMutation = () => {
  return useMutation({
    mutationFn: async (commentId: number): Promise<DeleteCommentResponse> => {
      const response = await api.delete(`/comments/${commentId}`);
      return response.data;
    },
    onSuccess: data => {
      console.log('댓글 삭제 성공:', data);
    },
    onError: error => {
      console.error('댓글 삭제 실패:', error);
    },
  });
};

export const useDeleteReplyMutation = () => {
  return useMutation({
    mutationFn: async (replyId: number): Promise<DeleteReplyResponse> => {
      const response = await api.delete(`/replies/${replyId}`);
      return response.data;
    },
    onSuccess: data => {
      console.log('대댓글 삭제 성공:', data);
    },
    onError: error => {
      console.error('대댓글 삭제 실패:', error);
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

export const useLikePostMutation = () => {
  return useMutation({
    mutationFn: async (postId: number): Promise<LikePostResponse> => {
      const response = await api.post(`/posts/${postId}/likes`);
      return response.data;
    },
    onSuccess: data => {
      console.log('좋아요 성공:', data);
    },
    onError: error => {
      console.error('좋아요 실패:', error);
    },
  });
};

export const useHatePostMutation = () => {
  return useMutation({
    mutationFn: async (postId: number): Promise<HatePostResponse> => {
      const response = await api.post(`/posts/${postId}/hates`);
      return response.data;
    },
    onSuccess: data => {
      console.log('싫어요 성공:', data);
    },
    onError: error => {
      console.error('싫어요 실패:', error);
    },
  });
};

export const useLikeCommentMutation = () => {
  return useMutation({
    mutationFn: async (commentId: number): Promise<LikeCommentResponse> => {
      const response = await api.post(`/comments/${commentId}/likes`);
      return response.data;
    },
    onSuccess: data => {
      console.log('댓글 좋아요 성공:', data);
    },
    onError: error => {
      console.error('댓글 좋아요 실패:', error);
    },
  });
};
