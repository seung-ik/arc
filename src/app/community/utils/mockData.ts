export interface MockPost {
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
  likeCount?: number;
  dislikeCount?: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  // 매치 관련 필드
  sport?: string;
  customSport?: string;
  elo?: string;
  location?: string;
  tokenReward?: string;
  matchLocation?: string;
  myElo?: string;
  preferredElo?: string;
  validityPeriod?: string;
  // 멘토 관련 필드
  skillLevel?: string;
  experience?: string;
}

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

export const createPopularPostsFromMock = (posts: MockPost[], count: number = 3): PopularPost[] => {
  return posts
    .filter(post => post.postType === '일반')
    .sort((a, b) => (b.likeCount ?? 0) - (a.likeCount ?? 0))
    .slice(0, count)
    .map(post => ({
      id: post.id,
      title: post.title,
      author: post.authorName,
      views: post.viewCount ?? 0,
      likes: post.likeCount ?? 0,
      commentCount: post.commentCount ?? 0,
      date: post.date,
      content: post.content,
    }));
};

export const createPopularPostsByViewsFromMock = (posts: MockPost[], count: number = 3): PopularPost[] => {
  return posts
    .filter(post => post.postType === '일반')
    .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
    .slice(0, count)
    .map(post => ({
      id: post.id,
      title: post.title,
      author: post.authorName,
      views: post.viewCount ?? 0,
      likes: 0, // 조회수 기준 정렬이므로 좋아요는 기본값 사용
      commentCount: post.commentCount ?? 0,
      date: post.date,
      content: post.content,
    }));
}; 