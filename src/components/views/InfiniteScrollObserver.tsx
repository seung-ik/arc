'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';

interface InfiniteScrollObserverProps {
  onIntersect: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  loadingText?: string;
  height?: string;
  margin?: string;
}

const ObserverContainer = styled.div<{ height: string; margin: string }>`
  height: ${props => props.height};
  margin: ${props => props.margin};
`;

const LoadingText = styled.div`
  text-align: center;
  color: #888;
  font-size: 14px;
`;

const InfiniteScrollObserver: React.FC<InfiniteScrollObserverProps> = ({
  onIntersect,
  hasNextPage,
  isFetchingNextPage,
  loadingText = '더 많은 데이터를 불러오는 중...',
  height = '20px',
  margin = '20px 0',
}) => {
  const observerRef = useRef<HTMLDivElement>(null);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        onIntersect();
      }
    },
    [onIntersect, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [observerCallback]);

  return (
    <ObserverContainer ref={observerRef} height={height} margin={margin}>
      {isFetchingNextPage && <LoadingText>{loadingText}</LoadingText>}
    </ObserverContainer>
  );
};

export default InfiniteScrollObserver;
