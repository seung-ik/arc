import { create } from 'zustand';

interface CommunityTab {
  id: number;
  sortOrder: number;
  name: string;
  path: string;
}

interface CommunityState {
  communityTabs: Record<string, CommunityTab>;
}

interface CommunityActions {
  setCommunityTabs: (tabs: Record<string, CommunityTab>) => void;
}

export const useCommunityStore = create<CommunityState & CommunityActions>(
  set => ({
    communityTabs: {},
    setCommunityTabs: tabs => set({ communityTabs: tabs }),
  })
);
