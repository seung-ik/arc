import { MatchPostType } from '@/api/useCommunity';

// 일반 포스트 타입
export interface GeneralPostType {
  id: number;
  title: string;
  content: string;
  type: string;
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
export interface GeneralPost extends GeneralPostType {
  // type은 GeneralPostType에서 상속
}

// 매치 포스트 인터페이스는 useCommunity.ts의 MatchPostType으로 대체

// 멘토 포스트 인터페이스
export interface MentorPost extends GeneralPostType {
  // type은 GeneralPostType에서 상속
  // CommunityPost에서 사용하는 필드명
  sport?: string;
  customSport?: string;
  elo?: string | number;
  location?: string;
  tokenReward?: string;
}

// 유니온 타입
export type Post = GeneralPost | MatchPostType | MentorPost;

// 프로필 포스트 인터페이스 (기존 ProfilePost와 호환)
// export interface ProfilePost extends Post {
//   enableHarvest?: boolean;
//   harvestStage?: number;
//   showInProfile?: boolean;
// }
