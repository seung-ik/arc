export const ROUTES = {
  elo: {
    root: '/elo',
    management: '/elo/management',
    history: '/elo/history',
  },
  profile: {
    root: '/profile',
    user: (userId: string) => `/profile/${userId}`,
  },
  community: {
    root: '/community',
    free: '/community/free',
    qna: '/community/qna',
    review: '/community/review',
  },
};
