import { create } from 'zustand';

interface User {
  address: string;
  isLoggedIn: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>(set => ({
  // State
  user: null,
  isLoading: false,
  error: null,

  // Actions
  setUser: user => set({ user, error: null }),
  setLoading: loading => set({ isLoading: loading }),
  setError: error => set({ error, isLoading: false }),
  logout: () => set({ user: null, error: null }),
}));
