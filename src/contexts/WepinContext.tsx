'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface WepinContextType {
  wepinSDK: any;
  isInitialized: boolean;
  isLoggedIn: boolean;
  userInfo: any;
  accounts: any[];
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccounts: () => Promise<any[]>;
  getBalance: (network: string, address: string) => Promise<any>;
}

const WepinContext = createContext<WepinContextType | undefined>(undefined);

interface WepinProviderProps {
  children: React.ReactNode;
}

export function WepinProvider({ children }: WepinProviderProps) {
  const [wepinSDK, setWepinSDK] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR 방지
    let isMounted = true;
    (async () => {
      const { WepinSDK } = await import('@wepin/sdk-js');
      const sdk = new WepinSDK({
        appId: process.env.NEXT_PUBLIC_WEPIN_APP_ID || '',
        appKey: process.env.NEXT_PUBLIC_WEPIN_APP_KEY || '',
      });
      await sdk.init();
      if (!isMounted) return;
      setWepinSDK(sdk);
      setIsInitialized(true);
      // 로그인 상태 확인
      const status = await sdk.getStatus();
      if (status === 'login' || status === 'login_before_register') {
        setIsLoggedIn(true);
        try {
          const userAccounts = await sdk.getAccounts();
          setAccounts(userAccounts || []);
        } catch (error) {
          console.error('Failed to get accounts:', error);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async () => {
    if (!wepinSDK) return;
    await wepinSDK.loginWithUI();
    setIsLoggedIn(true);
    const userAccounts = await wepinSDK.getAccounts();
    setAccounts(userAccounts || []);
  };

  const logout = async () => {
    if (!wepinSDK) return;
    await wepinSDK.logout();
    setIsLoggedIn(false);
    setAccounts([]);
  };

  const getAccounts = async () => {
    if (!wepinSDK) return [];
    return await wepinSDK.getAccounts();
  };

  const getBalance = async (network: string, address: string) => {
    if (!wepinSDK) return null;
    return await wepinSDK.getBalance(network, address);
  };

  return (
    <WepinContext.Provider
      value={{
        wepinSDK,
        isInitialized,
        isLoggedIn,
        userInfo,
        accounts,
        login,
        logout,
        getAccounts,
        getBalance,
      }}
    >
      {children}
    </WepinContext.Provider>
  );
}

export function useWepin() {
  const context = useContext(WepinContext);
  if (!context) {
    throw new Error('useWepin must be used within a WepinProvider');
  }
  return context;
}
