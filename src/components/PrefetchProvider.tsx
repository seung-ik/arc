'use client';

import { useProfileApi } from '@/api/useUser';
import { useSportCategoriesApi } from '@/api/useCommunity';
import { useAuthStore } from '@/stores/authStore';
import { useCommunityStore } from '@/stores/communityStore';
import { useEffect } from 'react';
import { getCategoryPath } from '@/utils/categoryPath';

// 스포츠 아이콘 매핑
const getSportIcon = (sportName: string): string => {
  const iconMap: Record<string, string> = {
    탁구: '🏓',
    배드민턴: '🏸',
    당구: '🎱',
    바둑: '🏁',
    테니스: '🎾',
    체스: '♟️',
    자유글: '💬',
    공지사항: '📢',
  };
  return iconMap[sportName] || '⚽';
};

interface PrefetchProviderProps {
  children: React.ReactNode;
}

export default function PrefetchProvider({ children }: PrefetchProviderProps) {
  const { data: profileData } = useProfileApi();
  const { setProfile, setUserElos, setIsLoggedIn, isLoggedIn } = useAuthStore();
  const { setCommunityTabs, setSportOptions } = useCommunityStore();

  const { data: sportCategoriesData } = useSportCategoriesApi(isLoggedIn);

  useEffect(() => {
    if (profileData) {
      setProfile(profileData.user);
      setUserElos(profileData.userElos);
      setIsLoggedIn(true);
    }
  }, [profileData, setProfile, setUserElos, setIsLoggedIn]);

  useEffect(() => {
    if (sportCategoriesData?.data) {
      const transformedTabs = sportCategoriesData.data.reduce(
        (acc, category) => {
          acc[category.name] = {
            id: category.id,
            sortOrder: category.sortOrder,
            name: category.name,
            path: getCategoryPath(category.name),
          };
          return acc;
        },
        {} as Record<string, any>
      );

      // sportOptions 변환
      const sportOptions = sportCategoriesData.data
        .filter(
          category => category.name !== '자유글' && category.name !== '공지사항'
        )
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(category => ({
          value: category.id,
          label: category.name,
          icon: getSportIcon(category.name),
        }));

      setCommunityTabs(transformedTabs);
      setSportOptions(sportOptions);
    }
  }, [sportCategoriesData, setCommunityTabs, setSportOptions]);

  return <>{children}</>;
}
