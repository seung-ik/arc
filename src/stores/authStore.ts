import { create } from 'zustand';

interface User {
  availableToken: string;
  email: string;
  id: number;
  nickname: string;
  profileImageUrl: string;
  tokenAmount: string;
  walletAddress: string;
  isLoggedIn: boolean;
}

interface AuthState extends User {
  isLoading: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>(set => ({
  // State
  availableToken: '',
  email: '',
  id: 0,
  nickname: '',
  profileImageUrl: '',
  tokenAmount: '',
  walletAddress: '',
  isLoggedIn: false,
  isLoading: false,
  // Actions
  setUser: (user: User | null) =>
    set(state => ({
      ...state,
      ...user,
    })),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  reset: () =>
    set({
      availableToken: '',
      email: '',
      id: 0,
      nickname: '',
      profileImageUrl: '',
      tokenAmount: '',
      walletAddress: '',
      isLoggedIn: false,
    }),
}));
