import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

// Types
export interface SportCategory {
  id: number;
  name: string;
  sortOrder: number;
}

export interface SportCategoriesResponse {
  success: boolean;
  message: string;
  data: SportCategory[];
}

// API Hooks
export const useSportCategoriesApi = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['sport-categories'],
    queryFn: async (): Promise<SportCategoriesResponse> => {
      const response = await api.get('/sport-categories');
      return response.data;
    },
    enabled,
  });
};
