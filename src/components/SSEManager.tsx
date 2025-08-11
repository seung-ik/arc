'use client';

import { useEffect } from 'react';
import { useSSE, SseMessage, fetchSseHealth } from '@/hooks/useSSE';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function SSEManager() {
  const queryClient = useQueryClient();

  const refetchMatchResult = () => {
    // 수신/발신 매치 요청 리스트 즉시 리패치
    queryClient.refetchQueries({
      queryKey: ['received-match-results'],
      type: 'active',
    });
    queryClient.refetchQueries({
      queryKey: ['sent-match-results'],
      type: 'active',
    });
    // 히스토리는 파라미터가 다양하므로 첫 키로 매칭해 활성 쿼리만 리패치
    queryClient.refetchQueries({
      predicate: q =>
        Array.isArray(q.queryKey) && q.queryKey[0] === 'matchHistory',
      type: 'active',
    });
  };

  const { reconnect } = useSSE({
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
          toast.success('상대가 매치 결과 승인을 요청했어요.');
          break;
        case 'MATCH_RESULT_STATUS_CHANGED':
          console.log('[SSE] MATCH_RESULT_STATUS_CHANGED', msg.data);
          refetchMatchResult();
          toast.success('매치 결과 상태가 업데이트되었습니다.');
          break;
      }
    },
  });

  useEffect(() => {
    const onVisibility = async () => {
      if (document.visibilityState === 'visible') {
        // 헬스체크 후 비정상일 때만 재연결
        try {
          const health = await fetchSseHealth();
          console.log('[SSE] health', health);
          const isHealthy = health.data.isConnected;
          if (!isHealthy) {
            reconnect();
          }
        } catch {
          // 헬스체크 실패 시 보수적으로 재연결 시도
          reconnect();
        }
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [reconnect]);

  return null;
}
