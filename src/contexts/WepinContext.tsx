'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { WepinSDK, WepinSDKModule } from '@/types/wepin';

interface WepinContextType {
  wepinLogin: any | null;
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
        const loginInstance = new (WepinLogin as any)({
          appId: process.env.NEXT_PUBLIC_WEPIN_APP_ID || '',
          appKey: process.env.NEXT_PUBLIC_WEPIN_APP_KEY || '',
        });

        // Wepin Login Library 초기화
        if (typeof loginInstance.init === 'function') {
          await loginInstance.init();
        }

        // Wepin SDK 초기화
        const { WepinSDK }: WepinSDKModule = await import('@wepin/sdk-js');
        const sdk = new WepinSDK({
          appId: process.env.NEXT_PUBLIC_WEPIN_APP_ID || '',
          appKey: process.env.NEXT_PUBLIC_WEPIN_APP_KEY || '',
        });
        await sdk.init({
          loginProviders: ['google'],
        });

        if (!isMounted) return;
        setWepinLogin(loginInstance);
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
      // 1. OAuth Provider로 로그인 (Firebase 인증)
      const oauthResult = await wepinLogin.loginWithOauthProvider({ provider: 'google' });
      console.log('idToken:', oauthResult.token.idToken);

      // 2. Firebase Token으로 위핀 로그인
      const wepinUser = await wepinLogin.loginWepin({
        provider: oauthResult.provider,
        token: {
          idToken: oauthResult.token.idToken,
          refreshToken: oauthResult.token.refreshToken,
        },
      });

      console.log('wepinUserInfo:', wepinUser);

      // 로그인 성공 시 상태 업데이트
      setIsLoggedIn(true);
      setUserInfo(wepinUser);

      // Wepin SDK에도 사용자 정보 설정
      if (wepinSDK) {
        try {
          // 현재 상태 확인
          const currentStatus = await wepinSDK.getStatus();
          console.log('로그인 전 SDK 상태:', currentStatus);

          // 사용자 정보 설정
          wepinSDK.setUserInfo(wepinUser);

          // 강제로 로그인 상태로 설정 (이벤트 발생)
          wepinSDK.setUserInfo(wepinUser, true);

          await wepinSDK.register();

          // 잠시 대기 후 상태 다시 확인
          setTimeout(async () => {
            const finalStatus = await wepinSDK.getStatus();
            console.log('최종 Wepin SDK 상태:', finalStatus);
          }, 1000);
        } catch (sdkError) {
          console.error('Wepin SDK 사용자 정보 설정 실패:', sdkError);
        }
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  };

  const logout = async () => {
    // 로그인 상태가 아니면 바로 로그인 페이지로
    if (!isLoggedIn) {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      return;
    }

    // Wepin SDK 로그아웃
    if (wepinSDK) {
      try {
        await wepinSDK.logout();
      } catch (error) {
        // 로그아웃 실패해도 계속 진행
        console.log('Wepin SDK 로그아웃 실패, 계속 진행');
      }
    }

    // 상태 초기화
    setIsLoggedIn(false);
    setUserInfo(null);
    setAccounts([]);

    // 로그인 페이지로 리다이렉트
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
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
