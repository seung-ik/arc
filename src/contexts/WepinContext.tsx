'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { WepinSDK, WepinSDKModule } from '@/types/wepin';

interface WepinContextType {
  wepinSDK: WepinSDK | null;
  isInitialized: boolean;
  isLoggedIn: boolean;
  userInfo: any;
  accounts: any[];
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccounts: () => Promise<any[]>;
  getBalance: (params: { network: string; address: string }) => Promise<any>;
}

const WepinContext = createContext<WepinContextType | undefined>(undefined);

interface WepinProviderProps {
  children: React.ReactNode;
}

export function WepinProvider({ children }: WepinProviderProps) {
  const [wepinSDK, setWepinSDK] = useState<WepinSDK | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR 방지
    let isMounted = true;
    (async () => {
      try {
        // 동적 import로 WepinSDK 로드 (SSR 시 로드되지 않음)
        const { WepinSDK }: WepinSDKModule = await import('@wepin/sdk-js');
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
      } catch (error) {
        console.error('Failed to initialize Wepin SDK:', error);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async () => {
    if (!wepinSDK) return;
    const result = await wepinSDK.loginWithUI();
    console.log('result', result);
    // setIsLoggedIn(true);
    const userAccounts = await wepinSDK.getAccounts();
    console.log('userAccounts', userAccounts);
    // setAccounts(userAccounts || []);
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

  const getBalance = async (params: { network: string; address: string }) => {
    if (!wepinSDK) return null;
    // wepinSDK.getBalance expects an array of params, so wrap in array
    const result = await wepinSDK.getBalance([params]);
    // result is likely an array, return the first element or null if empty
    return Array.isArray(result) && result.length > 0 ? result[0] : null;
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
