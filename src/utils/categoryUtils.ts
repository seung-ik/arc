import { ROUTES } from '@/constants/routes';

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
