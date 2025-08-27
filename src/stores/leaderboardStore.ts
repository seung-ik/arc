import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LeaderboardState {
  currentSportId: number;
  currentSport: {
    id: number;
    label: string;
    icon: string;
  };
}

interface LeaderboardActions {
  setCurrentSport: (sport: { id: number; label: string; icon: string }) => void;
  setCurrentSportId: (id: number) => void;
  clearCurrentSport: () => void;
}

export const useLeaderboardStore = create<
  LeaderboardState & LeaderboardActions
>()(
  persist(
    set => ({
      currentSportId: 1,
      currentSport: {
        id: 1,
        label: '테니스',
        icon: '',
      },

      setCurrentSport: sport =>
        set({
          currentSportId: sport.id,
          currentSport: sport,
        }),

      setCurrentSportId: id => set({ currentSportId: id }),

      clearCurrentSport: () =>
        set({
          currentSportId: 1,
          currentSport: {
            id: 1,
            label: '테니스',
            icon: '',
          },
        }),
    }),
    {
      name: 'leaderboard-storage',
      partialize: state => ({ currentSportId: state.currentSportId }),
    }
  )
);
