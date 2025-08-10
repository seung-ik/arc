import { useState, useEffect, useCallback } from 'react';

interface UseInfinitePaginationProps<T> {
  fetchFunction: (
    page: number,
    limit: number
  ) => Promise<{
    data: T[];
    pagination: { hasNext: boolean };
  }>;
  pageSize?: number;
  dependencies?: any[];
}

interface UseInfinitePaginationReturn<T> {
  items: T[];
  isLoading: boolean;
  hasNext: boolean;
  loadMore: () => void;
}

export function useInfinitePagination<T>({
  fetchFunction,
  pageSize = 10,
  dependencies = [],
}: UseInfinitePaginationProps<T>): UseInfinitePaginationReturn<T> {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // 데이터 로드 함수
  const loadData = useCallback(
    async (page: number, append: boolean = false) => {
      try {
        setIsLoading(true);
        const response = await fetchFunction(page, pageSize);

        if (append) {
          setItems(prev => [...prev, ...response.data]);
        } else {
          setItems(response.data);
        }

        setHasNext(response.pagination.hasNext);
        setCurrentPage(page);
      } catch (err) {
        console.error('데이터 로드 실패:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFunction, pageSize]
  );

  // 더보기 로드
  const loadMore = useCallback(() => {
    if (!isLoading && hasNext) {
      loadData(currentPage + 1, true);
    }
  }, [isLoading, hasNext, currentPage, loadData]);

  // 의존성 변경 시 초기화
  useEffect(() => {
    setItems([]);
    setCurrentPage(1);
    setHasNext(true);
    loadData(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return {
    items,
    isLoading,
    hasNext,
    loadMore,
  };
}
