// 페이지네이션 관련 상수
export const PAGINATION = {
  POSTS_PER_PAGE: 6,
  COMMENTS_PER_PAGE: 10,
  SEARCH_RESULTS_PER_PAGE: 20,
} as const;

// 게시글 관련 상수
export const POSTS = {
  POPULAR_POSTS_COUNT: 3,
  MAX_TITLE_LENGTH: 100,
  MAX_CONTENT_LENGTH: 2000,
} as const;

// UI 관련 상수
export const UI = {
  LOAD_MORE_INCREMENT: 12,
  INFINITE_SCROLL_THRESHOLD: 100,
} as const;
