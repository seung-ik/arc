import { create } from 'zustand';
import { User, UserElo } from '@/api/useUser';

interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  userElos: UserElo[];
  userProfile: User;
}

interface AuthActions {
  setProfile: (profile: User) => void;
  setUserElos: (userElos: UserElo[]) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  reset: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>(set => ({
  // State
  isLoggedIn: false,
  isLoading: false,
  userElos: [],
  userProfile: {
    id: 0,
    nickname: null,
    email: '',
    profileImageUrl: null,
    availableToken: '',
    tokenAmount: '',
    walletAddress: '',
  },
  // Actions
  setProfile: (profile: User) =>
    set(state => ({
      ...state,
      userProfile: profile,
    })),
  setUserElos: (userElos: UserElo[]) =>
    set(state => ({
      ...state,
      userElos,
    })),
  setIsLoggedIn: (isLoggedIn: boolean) =>
    set(state => ({
      ...state,
      isLoggedIn,
    })),
  setIsLoading: (isLoading: boolean) =>
    set(state => ({
      ...state,
      isLoading,
    })),
  reset: () =>
    set({
      isLoggedIn: false,
      isLoading: false,
      userElos: [],
      userProfile: {
        id: 0,
        nickname: null,
        email: '',
        profileImageUrl: null,
        availableToken: '',
        tokenAmount: '',
        walletAddress: '',
      },
    }),
}));
