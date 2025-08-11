export const QUERY_KEYS = {
  profile: ['profile'] as const,
  // Match Result related
  matchResult: {
    received: ['match-result', 'received'] as const,
    sent: ['match-result', 'sent'] as const,
    history: ['match-result', 'history'] as const,
  },
};

export type QueryKey = ReadonlyArray<string | number>;
