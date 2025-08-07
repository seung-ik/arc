import { create } from 'zustand';

interface CommunityTab {
  id: number;
  sortOrder: number;
  name: string;
  path: string;
}

interface SportOption {
  value: number;
  label: string;
  icon: string;
}

interface CommunityState {
  communityTabs: Record<string, CommunityTab>;
  sportOptions: SportOption[];
}

interface CommunityActions {
  setCommunityTabs: (tabs: Record<string, CommunityTab>) => void;
  setSportOptions: (options: SportOption[]) => void;
}

export const useCommunityStore = create<CommunityState & CommunityActions>(
  set => ({
    communityTabs: {},
    sportOptions: [],
    setCommunityTabs: tabs => set({ communityTabs: tabs }),
    setSportOptions: options => set({ sportOptions: options }),
  })
);
