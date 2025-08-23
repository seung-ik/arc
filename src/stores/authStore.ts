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
  setNickname: (nickname: string | null) => void;
  setTokenAmount: (tokenAmount: string | ((prev: string) => string)) => void;
  setAvailableToken: (
    availableToken: string | ((prev: string) => string)
  ) => void;
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
  setNickname: (nickname: string | null) =>
    set(state => ({
      ...state,
      userProfile: {
        ...state.userProfile,
        nickname,
      },
    })),
  setTokenAmount: (tokenAmount: string | ((prev: string) => string)) =>
    set(state => ({
      ...state,
      userProfile: {
        ...state.userProfile,
        tokenAmount:
          typeof tokenAmount === 'function'
            ? tokenAmount(state.userProfile.tokenAmount)
            : tokenAmount,
      },
    })),
  setAvailableToken: (availableToken: string | ((prev: string) => string)) =>
    set(state => ({
      ...state,
      userProfile: {
        ...state.userProfile,
        availableToken:
          typeof availableToken === 'function'
            ? availableToken(state.userProfile.availableToken)
            : availableToken,
      },
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
