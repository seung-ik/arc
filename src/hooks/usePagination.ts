import { useState, useMemo, useCallback } from 'react';
import { PAGINATION } from '@/constants/pagination';

interface UsePaginationProps<T> {
  items: T[];
  itemsPerPage?: number;
  initialPage?: number;
}

interface UsePaginationReturn<T> {
  currentItems: T[];
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  loadMore: () => void;
  resetPagination: () => void;
}

// 기존 클라이언트 사이드 페이지네이션 훅
export function usePagination<T>({
  items,
  itemsPerPage = PAGINATION.POSTS_PER_PAGE,
  initialPage = 1,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [visibleItems, setVisibleItems] = useState(itemsPerPage);

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // 현재 페이지의 아이템들
  const currentItems = useMemo(() => {
    return items.slice(0, visibleItems);
  }, [items, visibleItems]);

  // 페이지네이션 상태
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // 페이지 이동 함수들
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  // 더보기 기능 (무한 스크롤 스타일)
  const loadMore = () => {
    setVisibleItems(prev => Math.min(prev + itemsPerPage, items.length));
  };

  // 페이지네이션 초기화
  const resetPagination = () => {
    setCurrentPage(initialPage);
    setVisibleItems(itemsPerPage);
  };

  return {
    currentItems,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToPage,
    goToNextPage,
    goToPrevPage,
    goToFirstPage,
    goToLastPage,
    loadMore,
    resetPagination,
  };
}

// API fetch를 지원하는 무한 스크롤 훅
interface UseInfinitePaginationProps<T> {
  fetchFunction: (
    page: number,
    limit: number
  ) => Promise<{
    data: T[];
    hasNextPage: boolean;
    totalCount?: number;
  }>;
  itemsPerPage?: number;
  initialData?: T[];
}

interface UseInfinitePaginationReturn<T> {
  items: T[];
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => void;
}

export function useInfinitePagination<T>({
  fetchFunction,
  itemsPerPage = PAGINATION.POSTS_PER_PAGE,
  initialData = [],
}: UseInfinitePaginationProps<T>): UseInfinitePaginationReturn<T> {
  const [items, setItems] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // 데이터 로드 함수
  const loadData = useCallback(
    async (page: number, append: boolean = false) => {
      try {
        setIsLoading(true);
        setIsError(false);

        const response = await fetchFunction(page, itemsPerPage);

        if (append) {
          setItems(prev => [...prev, ...response.data]);
        } else {
          setItems(response.data);
        }

        setHasNextPage(response.hasNextPage);
        setCurrentPage(page);
      } catch (error) {
        console.error('페이지네이션 데이터 로드 실패:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFunction, itemsPerPage]
  );

  // 더보기 로드
  const loadMore = useCallback(async () => {
    if (!isLoading && hasNextPage) {
      await loadData(currentPage + 1, true);
    }
  }, [isLoading, hasNextPage, currentPage, loadData]);

  // 새로고침
  const refresh = useCallback(async () => {
    setCurrentPage(1);
    await loadData(1, false);
  }, [loadData]);

  // 초기화
  const reset = useCallback(() => {
    setItems(initialData);
    setIsLoading(false);
    setIsError(false);
    setHasNextPage(true);
    setCurrentPage(1);
  }, [initialData]);

  // 초기 데이터 로드
  useMemo(() => {
    if (initialData.length === 0) {
      loadData(1, false);
    }
  }, [loadData, initialData.length]);

  return {
    items,
    isLoading,
    isError,
    hasNextPage,
    loadMore,
    refresh,
    reset,
  };
}
