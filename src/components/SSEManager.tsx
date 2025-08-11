'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useSSE, SseMessage } from '@/hooks/useSSE';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';

export default function SSEManager() {
  const pathname = usePathname();

  const queryClient = useQueryClient();

  const refetchMatchResult = () => {
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.matchResult.received,
    });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.matchResult.sent });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.matchResult.history });
  };

  const { close, reconnect } = useSSE({
    onOpen: () => {
      console.log('[SSE] connected');
    },
    onError: err => {
      console.warn('[SSE] error', err);
    },
    onMessage: (msg: SseMessage) => {
      switch (msg.type) {
        case 'CONNECTION_ESTABLISHED':
          console.log('[SSE]', msg.data.message, msg.timestamp);
          break;
        case 'MATCH_RESULT_REQUEST':
          console.log('[SSE] MATCH_RESULT_REQUEST', msg.data);
          refetchMatchResult();
          break;
        case 'MATCH_RESULT_STATUS_CHANGED':
          console.log('[SSE] MATCH_RESULT_STATUS_CHANGED', msg.data);
          refetchMatchResult();
          break;
      }
    },
  });

  useEffect(() => {
    // auth 페이지에서는 연결하지 않도록 즉시 종료
    if (pathname.includes('auth')) {
      close();
    }
  }, [pathname, close]);

  useEffect(() => {
    const onVisibility = async () => {
      if (document.visibilityState === 'visible') {
        // 성공/실패와 무관하게 가시화 시 재연결 시도
        reconnect();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [reconnect]);

  return null;
}
