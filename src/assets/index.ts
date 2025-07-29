import SHOP_TENNIS from '@/assets/images/business/shop_tennis.png';
import SHOP_TABLE_TENNIS from '@/assets/images/business/shop_pingpong.png';
import SHOP_BADUK from '@/assets/images/business/shop_go.png';
import SHOP_CHESS from '@/assets/images/business/shop_chess.png';
import SHOP_BILLIARDS from '@/assets/images/business/shop_bill.png';
import SHOP_SPORTS from '@/assets/images/business/shop_sports.png';
import SHOP_UNDER from '@/assets/images/business/shop_under.png';
import SHOP_BADMINTON from '@/assets/images/business/shop_badminton.png';

// UI 아이콘들
import SEARCH from '@/assets/images/icons/search.svg';
import BELL from '@/assets/images/icons/bell.svg';
import PLUS_CIRCLE from '@/assets/images/icons/plus_circle.svg';
import ARROW_DOWN from '@/assets/images/icons/arrow_down.svg';
import PLUS from '@/assets/images/icons/plus.svg';

// 탭 아이콘들
import TAB_COMMUNITY from '@/assets/images/icons/tab_community.svg';
import TAB_USER from '@/assets/images/icons/tab_user.svg';
import TAB_ELO from '@/assets/images/icons/tab_elo.svg';

import BANNER_EX01 from '@/assets/images/banners/ex_01.png';

export const BUSINESS_IMAGES = {
  EX_1: SHOP_TENNIS,
  EX_2: SHOP_TABLE_TENNIS,
  EX_3: SHOP_BADUK,
  EX_4: SHOP_CHESS,
  EX_5: SHOP_BILLIARDS,
  EX_6: SHOP_SPORTS,
  EX_7: SHOP_UNDER,
  EX_8: SHOP_BADMINTON,
} as const;

// UI 아이콘들
export const ICONS = {
  SEARCH,
  BELL,
  PLUS_CIRCLE,
  ARROW_DOWN,
  PLUS,
} as const;

// 탭 아이콘들
export const TAB_ICONS = {
  COMMUNITY: TAB_COMMUNITY,
  USER: TAB_USER,
  ELO: TAB_ELO,
} as const;

// 스포츠 아이콘들
export const sportsIcons = {} as const;

// 플레이스홀더 이미지들
export const BANNERS = {
  EX01: BANNER_EX01,
} as const;
