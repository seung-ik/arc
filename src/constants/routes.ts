export const ROUTES = {
  elo: {
    root: '/elo',
    management: '/elo/management',
    history: '/elo/history',
  },
  profile: {
    root: '/profile',
    user: (userId: string) => `/profile/${userId}`,
    tokenHistory: '/profile/token_history',
  },
  community: {
    root: '/community',
    write: '/community/write',
    post: (postId: string) => `/community/post/${postId}`,
    tennis: '/community/tennis',
    badminton: '/community/badminton',
    go: '/community/go',
    tableTennis: '/community/table-tennis',
    chess: '/community/chess',
    billiards: '/community/billiards',
    notice: '/community/notice',
  },
};
