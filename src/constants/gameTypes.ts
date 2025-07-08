export const GAME_TYPES = {
  BILLIARDS: 'billiards',
  TABLE_TENNIS: 'table_tennis',
  BADMINTON: 'badminton',
  CHESS: 'chess',
  GO: 'go',
  TENNIS: 'tennis',
} as const;

export const GAME_NAMES = {
  [GAME_TYPES.BILLIARDS]: '당구',
  [GAME_TYPES.TABLE_TENNIS]: '탁구',
  [GAME_TYPES.BADMINTON]: '배드민턴',
  [GAME_TYPES.CHESS]: '체스',
  [GAME_TYPES.GO]: '바둑',
  [GAME_TYPES.TENNIS]: '테니스',
} as const;

export const GAME_ICONS = {
  [GAME_TYPES.BILLIARDS]: '🎱',
  [GAME_TYPES.TABLE_TENNIS]: '🏓',
  [GAME_TYPES.BADMINTON]: '🏸',
  [GAME_TYPES.CHESS]: '♟️',
  [GAME_TYPES.GO]: '⚫',
  [GAME_TYPES.TENNIS]: '🎾',
} as const;

export type GameType = (typeof GAME_TYPES)[keyof typeof GAME_TYPES];

export interface GameStat {
  elo: number;
  percentile: number;
  isActive: boolean;
  gamesPlayed: number;
}

export interface UserProfile {
  id: string;
  name: string;
  profileImage?: string;
  tokens?: number; // 마이 프로필에서만
  gameStats: Record<GameType, GameStat>;
}
