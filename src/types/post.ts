// 기본 포스트 인터페이스
export interface BasePost {
  id: number;
  title: string;
  content: string;
  isHidden: boolean;
  viewCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    nickname: string;
    profileImageUrl: string | null;
  };
  sportCategoryId: number;
  sportCategoryName: string;
  isLiked: boolean;
  isHated: boolean;
  likeCount: number;
  hateCount: number;
}

// 일반 포스트 인터페이스
export interface GeneralPost extends BasePost {
  type: '일반' | '공지';
}

// 매치 포스트 인터페이스
export interface MatchPost extends BasePost {
  type: 'match' | '매치';
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
  type: 'mentor' | '멘토';
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
// export interface ProfilePost extends Post {
//   enableHarvest?: boolean;
//   harvestStage?: number;
//   showInProfile?: boolean;
// }
