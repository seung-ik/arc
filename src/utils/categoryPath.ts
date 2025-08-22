export const getCategoryPath = (category: string): string => {
  const pathMap: Record<string, string> = {
    // 한글 이름으로 접근
    자유글: '/community',
    테니스: '/community/tennis',
    배드민턴: '/community/badminton',
    탁구: '/community/table-tennis',
    당구: '/community/billiards',
    바둑: '/community/go',
    체스: '/community/chess',
    공지사항: '/community/notice',
    // 영문 value로 접근
    tennis: '/community/tennis',
    badminton: '/community/badminton',
    'table-tennis': '/community/table-tennis',
    billiards: '/community/billiards',
    go: '/community/go',
    chess: '/community/chess',
    notice: '/community/notice',
  };

  return pathMap[category] || '/community';
};

export const getCategoryLabel = (categoryValue: string): string => {
  const categoryMap: Record<string, string> = {
    tennis: '테니스',
    badminton: '배드민턴',
    'table-tennis': '탁구',
    billiards: '당구',
    go: '바둑',
    chess: '체스',
    notice: '공지사항',
  };
  return categoryMap[categoryValue] || '자유글';
};
