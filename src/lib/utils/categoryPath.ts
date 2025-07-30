export const getCategoryPath = (name: string): string => {
  const pathMap: Record<string, string> = {
    자유글: '/community',
    테니스: '/community/tennis',
    배드민턴: '/community/badminton',
    탁구: '/community/table-tennis',
    당구: '/community/billiards',
    바둑: '/community/go',
    체스: '/community/chess',
    공지사항: '/community/notice',
  };

  return pathMap[name] || '/community';
};
