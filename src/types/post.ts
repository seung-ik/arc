// 기본 포스트 인터페이스
export interface BasePost {
  id: number;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  date: string;
  category: string;
  postType: string;
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  isLiked: boolean;
  isDisliked: boolean;
}

// 일반 포스트 인터페이스
export interface GeneralPost extends BasePost {
  postType: 'general' | '일반' | '공지';
}

// 매치 포스트 인터페이스
export interface MatchPost extends BasePost {
  postType: 'match' | '매치';
  // CommunityPost에서 사용하는 필드명
  myElo?: string;
  matchLocation?: string;
  preferredElo?: string;
  validityPeriod?: string;
  // 상세 페이지에서 사용하는 필드명
  elo?: string | number;
  location?: string;
  desiredSkillLevel?: string;
  participants?: string[];
  maxParticipants?: number;
}

// 멘토 포스트 인터페이스
export interface MentorPost extends BasePost {
  postType: 'mentor' | '멘토';
  // CommunityPost에서 사용하는 필드명
  sport?: string;
  customSport?: string;
  elo?: string | number;
  location?: string;
  tokenReward?: string;
}

// 유니온 타입
export type Post = GeneralPost | MatchPost | MentorPost;

// 프로필 포스트 인터페이스 (기존 ProfilePost와 호환)
export interface ProfilePost extends BasePost {
  enableHarvest?: boolean;
  harvestStage?: number;
  showInProfile?: boolean;
}
