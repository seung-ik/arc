'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ROUTES } from '@/constants/routes';
import type { WepinSDK, WepinSDKModule, WepinLogin } from '@/types/wepin';

interface WepinContextType {
  wepinLogin: WepinLogin | null;
  wepinSDK: WepinSDK | null;
  isInitialized: boolean;
  isLoggedIn: boolean;
  userInfo: any;
  accounts: any[];
  login: () => Promise<
    { idToken: string; wepinUser: any; accounts: any[] } | undefined
  >;
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
        try {
          const status = await widgetInstance.getStatus();
          console.log('Wepin 로그인 상태:', status);

          if (status === 'login') {
            console.log('기존 사용자 로그인 상태 확인');
            setIsLoggedIn(true);

            // 기존 사용자 계정 정보 조회
            try {
              const userAccounts = await widgetInstance.getAccounts();
              console.log('기존 사용자 계정 정보 조회 성공:', userAccounts);
              setAccounts(userAccounts || []);
            } catch (accountsError) {
              console.warn('기존 사용자 계정 정보 조회 실패:', accountsError);
              setAccounts([]);
            }
          } else if (status === 'login_before_register') {
            console.log('새로운 사용자 - 지갑 생성 필요');
            setIsLoggedIn(true);

            // 새로운 사용자는 지갑이 아직 생성되지 않았으므로 빈 배열로 설정
            setAccounts([]);
          } else {
            console.log('사용자가 로그인되어 있지 않습니다. 상태:', status);
            setIsLoggedIn(false);
            setAccounts([]);
          }
        } catch (statusError) {
          console.warn('로그인 상태 확인 실패:', statusError);
          setIsLoggedIn(false);
          setAccounts([]);
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
    if (!wepinLogin) return undefined;

    try {
      const oauthResult = await wepinLogin.loginWithOauthProvider({
        provider: 'google',
      });

      // 2. Firebase Token으로 위핀 로그인
      const wepinUser = await wepinLogin.loginWepin({
        provider: oauthResult.provider,
        token: {
          idToken: oauthResult.token.idToken,
          refreshToken: oauthResult.token.refreshToken,
        },
      });

      let userAccounts: any[] = [];
      if (wepinSDK) {
        wepinSDK.setUserInfo(wepinUser);

        // 계정 정보 조회 시도
        try {
          userAccounts = await wepinSDK.getAccounts();
        } catch (accountsError) {
          console.log(accountsError);
          // 계정 조회 실패 시 새로운 사용자 등록 시도
          try {
            await wepinSDK.register();

            // 등록 후 바로 계정 정보 조회 시도
            try {
              userAccounts = await wepinSDK.getAccounts();
            } catch (finalAccountsError) {
              console.log(finalAccountsError);
              userAccounts = [];
            }
          } catch (registerError) {
            console.warn('사용자 등록 실패:', registerError);
            userAccounts = [];
          }
        }

        setIsLoggedIn(true);
        setUserInfo(wepinUser);
        setAccounts(userAccounts);
      }

      return {
        idToken: oauthResult.token.idToken,
        wepinUser,
        accounts: userAccounts,
      };
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
        console.log('Wepin SDK 로그아웃 실패, 계속 진행', error);
      }
    }

    window.location.href = ROUTES.auth.login;
  };

  const getAccounts = async () => {
    if (!wepinSDK) {
      console.warn('Wepin SDK가 초기화되지 않았습니다.');
      return [];
    }

    try {
      return await wepinSDK.getAccounts();
    } catch (error) {
      console.warn('계정 정보 조회 실패:', error);
      return [];
    }
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
