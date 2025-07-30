'use client';

import { useProfileApi } from '@/api/useUser';
import { useSportCategoriesApi } from '@/api/useCommunity';
import { useAuthStore } from '@/stores/authStore';
import { useCommunityStore } from '@/stores/communityStore';
import { useEffect } from 'react';
import { getCategoryPath } from '@/lib/utils/categoryPath';

interface PrefetchProviderProps {
  children: React.ReactNode;
}

export default function PrefetchProvider({ children }: PrefetchProviderProps) {
  const { data: profileData } = useProfileApi();
  const { setProfile, setUserElos, setIsLoggedIn, isLoggedIn } = useAuthStore();
  const { setCommunityTabs } = useCommunityStore();

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

      setCommunityTabs(transformedTabs);
    }
  }, [sportCategoriesData, setCommunityTabs]);

  return <>{children}</>;
}
