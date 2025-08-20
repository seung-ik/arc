// 기본 포스트 인터페이스
export interface BasePost {
  id: number;
  title: string;
  content: string;
  type: string; // type을 BasePost로 이동 (모든 포스트에 공통)
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
  // type은 BasePost에서 상속
}

// 매치 포스트 인터페이스
export interface MatchPost extends BasePost {
  // API 응답에 포함된 필드들
  imageUrls: string[];
  comments: any[]; // 실제 댓글 타입으로 나중에 수정 필요

  // 매치 관련 필드들 (API에서 제공되지 않는 경우 optional)
  myElo?: string;
  matchLocation?: string;
  preferredElo?: string;
  validityPeriod?: string;
  elo?: string | number;
  location?: string;
  desiredSkillLevel?: string;
  participants?: string[];
  maxParticipants?: number;
}

// 멘토 포스트 인터페이스
export interface MentorPost extends BasePost {
  // type은 BasePost에서 상속
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
