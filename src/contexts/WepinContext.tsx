'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import type { WepinSDK, WepinSDKModule, WepinLogin, WepinLoginModule } from '@/types/wepin';

interface WepinContextType {
  wepinLogin: WepinLogin | null;
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
  const router = useRouter();
  const [wepinLogin, setWepinLogin] = useState<any | null>(null);
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
        // Wepin Login Library 초기화
        const { WepinLogin } = await import('@wepin/login-js');
        const loginInstance = new WepinLogin({
          appId: process.env.NEXT_PUBLIC_WEPIN_APP_ID || '',
          appKey: process.env.NEXT_PUBLIC_WEPIN_APP_KEY || '',
        });
        await loginInstance.init();

        // Wepin Widget SDK 초기화
        const { WepinSDK }: WepinSDKModule = await import('@wepin/sdk-js');
        const widgetInstance = new WepinSDK({
          appId: process.env.NEXT_PUBLIC_WEPIN_APP_ID || '',
          appKey: process.env.NEXT_PUBLIC_WEPIN_APP_KEY || '',
        });
        await widgetInstance.init({ loginProviders: ['google'] });

        if (!isMounted) return;
        setWepinLogin(loginInstance);
        setWepinSDK(widgetInstance);
        setIsInitialized(true);

        // 로그인 상태 확인
        const status = await widgetInstance.getStatus();
        if (status === 'login' || status === 'login_before_register') {
          setIsLoggedIn(true);

          const userAccounts = await widgetInstance.getAccounts();
          setAccounts(userAccounts || []);
        }
      } catch (error) {
        console.error('Failed to initialize Wepin libraries:', error);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async () => {
    if (!wepinLogin) return;

    try {
      const oauthResult = await wepinLogin.loginWithOauthProvider({ provider: 'google' });
      console.log('OAuth 로그인 성공, idToken:', oauthResult.token.idToken);

      // 2. Firebase Token으로 위핀 로그인
      const wepinUser = await wepinLogin.loginWepin({
        provider: oauthResult.provider,
        token: {
          idToken: oauthResult.token.idToken,
          refreshToken: oauthResult.token.refreshToken,
        },
      });

      console.log('Wepin 로그인 성공, wepinUserInfo:', wepinUser);

      setIsLoggedIn(true);
      setUserInfo(wepinUser);

      if (wepinSDK) {
        wepinSDK.setUserInfo(wepinUser);

        const statusAfterSetUser = await wepinSDK.getStatus();
        if (statusAfterSetUser === 'login_before_register') {
          await wepinSDK.register();
        }
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  };

  const logout = async () => {
    // 상태 초기화
    setIsLoggedIn(false);
    setUserInfo(null);
    setAccounts([]);

    // Wepin SDK 로그아웃 (선택적)
    if (wepinSDK) {
      try {
        await wepinSDK.logout();
      } catch (error) {
        console.log('Wepin SDK 로그아웃 실패, 계속 진행');
      }
    }

    window.location.href = ROUTES.auth.login;
  };

  const getAccounts = async () => {
    if (!wepinSDK) return [];
    return await wepinSDK.getAccounts();
  };

  const getBalance = async (params: { network: string; address: string }) => {
    if (!wepinSDK) return null;
    const result = await wepinSDK.getBalance([params]);
    return Array.isArray(result) && result.length > 0 ? result[0] : null;
  };

  return (
    <WepinContext.Provider
      value={{
        wepinLogin,
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
