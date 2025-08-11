'use client';

import { useEffect, useRef } from 'react';

type ConnectionEstablished = {
  type: 'CONNECTION_ESTABLISHED';
  data: { message: string; userId: number };
  timestamp: string;
};

type MatchResultRequest = {
  type: 'MATCH_RESULT_REQUEST';
  data: {
    matchResultId: number;
    sportCategory: string;
    message: string;
    timestamp: string;
  };
  userId: number;
};

type MatchResultStatusChanged = {
  type: 'MATCH_RESULT_STATUS_CHANGED';
  data: {
    matchResultId: number;
    status: 'approved' | 'rejected';
    sportCategory: string;
    message: string;
    timestamp: string;
  };
  userId: number;
};

export type SseMessage =
  | ConnectionEstablished
  | MatchResultRequest
  | MatchResultStatusChanged;

interface UseSSEOptions {
  onMessage?: (msg: SseMessage) => void;
  onOpen?: () => void;
  onError?: (err: any) => void;
}

export function useSSE({ onMessage, onOpen, onError }: UseSSEOptions = {}) {
  const esRef = useRef<EventSource | null>(null);
  const onMessageRef = useRef<typeof onMessage>(onMessage);
  const onOpenRef = useRef<typeof onOpen>(onOpen);
  const onErrorRef = useRef<typeof onError>(onError);

  onMessageRef.current = onMessage;
  onOpenRef.current = onOpen;
  onErrorRef.current = onError;

  const open = () => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('ACCESS_TOKEN')
        : null;
    if (!token) return;

    const base = process.env.NEXT_PUBLIC_API_URL;
    if (!base) return;

    const url = `${base}/api/v1/sse/subscribe?token=${encodeURIComponent(
      token
    )}`;

    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }

    const es = new EventSource(url);
    esRef.current = es;

    es.onopen = () => {
      onOpenRef.current?.();
    };

    es.onerror = evt => {
      onErrorRef.current?.(evt);
    };

    es.onmessage = evt => {
      console.log('onmessage', evt);
      try {
        const parsed: SseMessage = JSON.parse(evt.data);
        onMessageRef.current?.(parsed);
      } catch (e) {
        onErrorRef.current?.(e);
      }
    };
  };

  useEffect(() => {
    console.log('open');
    open();
    return () => {
      esRef.current?.close();
      esRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    close: () => {
      esRef.current?.close();
      esRef.current = null;
    },
    reconnect: () => {
      console.log('reconnect');
      open();
    },
  };
}

export async function fetchSseHealth(): Promise<any | null> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('ACCESS_TOKEN') : null;
  if (!token) return null;

  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return null;

  const res = await fetch(
    `${base}/api/v1/sse/health?token=${encodeURIComponent(token)}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );
  return res.json();
}
