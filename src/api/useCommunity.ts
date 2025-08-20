import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  pagination: {
    page: string;
    limit: string;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Hot Posts Types
export interface HotPostAuthor {
  id: number;
  nickname: string;
}

export interface HotPostSportCategory {
  id: number;
  name: string;
}

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

export interface HotPostCategoryGroup {
  categoryId: number;
  categoryName: string;
  posts: HotPostItem[];
}

export interface HotPostsResponse {
  success: boolean;
  data: HotPostCategoryGroup[];
  message: string;
}

// Create Post Types
export interface CreatePostRequest {
  sportCategoryId: number;
  title: string;
  content: string;
  type: string;
}

// Create Match Post Types
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

export interface MatchPostSportCategory {
  id: number;
  name: string;
  sortOrder: number;
}

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

// 인기 글 목록 조회
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
      }
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: error => {
      console.error('좋아요 실패:', error);
    },
  });
};

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
      }
      queryClient.invalidateQueries({ queryKey: ['posts'] });
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

// Image Upload Types
export interface ImageUploadRequest {
  image: File;
}

export interface ImageUploadResponse {
  success: boolean;
  imageUrl: string;
  tempImageId: number;
}

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

// 글 작성 검증 함수들
export interface FormData {
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
}

export const validateGeneralPost = (formData: FormData): boolean => {
  if (!formData.title.trim()) {
    alert('제목을 입력해주세요.');
    return false;
  }
  if (!formData.content.trim() || formData.content.trim() === '<p><br></p>') {
    alert('내용을 입력해주세요.');
    return false;
  }
  if (!formData.category) {
    alert('카테고리를 선택해주세요.');
    return false;
  }
  return true;
};

export const validateMatchPost = (formData: FormData): boolean => {
  if (!formData.title.trim()) {
    alert('제목을 입력해주세요.');
    return false;
  }
  if (!formData.content.trim()) {
    alert('내용을 입력해주세요.');
    return false;
  }
  if (!formData.category) {
    alert('카테고리를 선택해주세요.');
    return false;
  }
  if (!formData.matchLocation.trim()) {
    alert('매치 장소를 입력해주세요.');
    return false;
  }
  if (!formData.myElo) {
    alert('내 ELO 점수를 입력해주세요.');
    return false;
  }
  if (!formData.preferredElo) {
    alert('선호하는 ELO 범위를 선택해주세요.');
    return false;
  }
  if (!formData.participantCount) {
    alert('참가 인원을 선택해주세요.');
    return false;
  }
  return true;
};

export const validateMentorPost = (formData: FormData): boolean => {
  if (!formData.title.trim()) {
    alert('제목을 입력해주세요.');
    return false;
  }
  if (!formData.content.trim()) {
    alert('내용을 입력해주세요.');
    return false;
  }
  if (!formData.category) {
    alert('카테고리를 선택해주세요.');
    return false;
  }
  if (!formData.elo) {
    alert('ELO 점수를 입력해주세요.');
    return false;
  }
  if (!formData.location.trim()) {
    alert('지역을 입력해주세요.');
    return false;
  }
  if (!formData.tokenReward) {
    alert('토큰 보상을 입력해주세요.');
    return false;
  }
  return true;
};
