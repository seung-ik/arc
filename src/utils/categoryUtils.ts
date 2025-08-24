import { ROUTES } from '@/constants/routes';
import { BUSINESS_IMAGES } from '@/assets';

interface Category {
  id: string;
  label: string;
  path: string;
  order: number;
}

interface CommunityTab {
  id: number;
  sortOrder: number;
  name: string;
  path: string;
}

export const generateCategories = (
  communityTabs: Record<string, CommunityTab>
): Category[] => {
  const categories: Category[] = [];

  // communityTabs에서 카테고리 추가
  if (Object.keys(communityTabs).length > 0) {
    const sortedTabs = Object.values(communityTabs).sort(
      (a, b) => a.sortOrder - b.sortOrder
    );

    sortedTabs.forEach(tab => {
      categories.push({
        id: tab.name,
        label: tab.name,
        path: tab.path,
        order: tab.sortOrder,
      });
    });
  } else {
    // communityTabs가 비어있을 때 기본 카테고리 사용
    const defaultCategories: Category[] = [
      {
        id: 'trending',
        label: '자유글',
        path: ROUTES.community.root,
        order: 1,
      },
      {
        id: 'tennis',
        label: '테니스',
        path: ROUTES.community.tennis,
        order: 2,
      },
      {
        id: 'badminton',
        label: '배드민턴',
        path: ROUTES.community.badminton,
        order: 3,
      },
      {
        id: 'table-tennis',
        label: '탁구',
        path: ROUTES.community.tableTennis,
        order: 4,
      },
      {
        id: 'billiards',
        label: '당구',
        path: ROUTES.community.billiards,
        order: 5,
      },
      { id: 'go', label: '바둑', path: ROUTES.community.go, order: 6 },
      { id: 'chess', label: '체스', path: ROUTES.community.chess, order: 7 },
      {
        id: 'notice',
        label: '공지사항',
        path: ROUTES.community.notice,
        order: 999,
      },
    ];
    categories.push(...defaultCategories);
  }

  return categories;
};

/**
 * 카테고리명에 따른 비즈니스 이미지 반환
 * @param category 카테고리명 (영문 또는 한글)
 * @returns 해당 카테고리의 비즈니스 이미지
 */
export const getCategoryImg = (category: string) => {
  switch (category) {
    case 'tennis':
    case '테니스':
      return BUSINESS_IMAGES.EX_1;
    case 'badminton':
    case '배드민턴':
      return BUSINESS_IMAGES.EX_2;
    case 'table_tennis':
    case '탁구':
      return BUSINESS_IMAGES.EX_3;
    case 'billiards':
    case '당구':
      return BUSINESS_IMAGES.EX_4;
    case 'go':
    case '바둑':
      return BUSINESS_IMAGES.EX_5;
    case 'chess':
    case '체스':
      return BUSINESS_IMAGES.EX_6;
    case 'general':
    case '자유글':
      return BUSINESS_IMAGES.EX_8;
  }
  return BUSINESS_IMAGES.EX_8;
};
