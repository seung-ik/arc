import { Post, GeneralPost } from '@/types/post';

export interface PopularPost {
  id: number;
  title: string;
  author: string;
  views: number;
  likes: number;
  commentCount: number;
  date: string;
  content: string;
}

export const createPopularPosts = (posts: Post[], count: number = 3): PopularPost[] => {
  return posts
    .filter((post): post is GeneralPost => post.type === '일반')
    .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
    .slice(0, count)
    .map(post => ({
      id: post.id,
      title: post.title,
      author: post.author.nickname,
      views: post.viewCount ?? 0,
      likes: 0, // API에서 좋아요 수를 제공하지 않으므로 기본값 사용
      commentCount: post.commentCount ?? 0,
      date: post.createdAt,
      content: post.content,
    }));
};

export const createPopularPostsByViews = (posts: Post[], count: number = 3): PopularPost[] => {
  return posts
    .filter((post): post is GeneralPost => post.type === '일반')
    .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
    .slice(0, count)
    .map(post => ({
      id: post.id,
      title: post.title,
      author: post.author.nickname,
      views: post.viewCount ?? 0,
      likes: 0, // 조회수 기준 정렬이므로 좋아요는 기본값 사용
      commentCount: post.commentCount ?? 0,
      date: post.createdAt,
      content: post.content,
    }));
}; 