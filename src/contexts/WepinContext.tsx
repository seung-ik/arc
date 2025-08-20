'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ROUTES } from '@/constants/routes';
import type { WepinSDK, WepinSDKModule, WepinLogin } from '@/types/wepin';
import { WepinProvider as WepinProviderSDK } from '@wepin/provider-js';

interface WepinContextType {
  wepinLogin: WepinLogin | null;
  wepinSDK: WepinSDK | null;
  isInitialized: boolean;
  isLoggedIn: boolean;
  userInfo: any;
  accounts: any[];
  initWepinSDK: () => Promise<WepinSDK | null>;
  loginByWepin: () => Promise<
    { idToken: string; wepinUser: any; accounts: any[] } | undefined
  >;
  logout: () => Promise<void>;
  getAccounts: () => Promise<any[]>;
  getBalance: (params: { network: string; address: string }) => Promise<any>;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUserInfo: (userInfo: any) => void;
  setAccounts: (accounts: any[]) => void;
  // 컨트랙트 함수 콜 (읽기 전용)
  callContract: (
    network: string,
    contractAddress: string,
    abi: any[],
    methodName: string,
    params: any[]
  ) => Promise<any>;
  // 컨트랙트 함수 콜 (상태 변경)
  executeContract: (
    network: string,
    contractAddress: string,
    abi: any[],
    methodName: string,
    params: any[],
    value?: string
  ) => Promise<any>;
}

const WepinContext = createContext<WepinContextType | undefined>(undefined);

interface WepinProviderProps {
  children: React.ReactNode;
}

export function WepinProvider({ children }: WepinProviderProps) {
  const [wepinLogin, setWepinLogin] = useState<any | null>(null);
  const [wepinSDK, setWepinSDK] = useState<WepinSDK | null>(null);
  const [wepinProvider, setWepinProvider] = useState<WepinProviderSDK | null>(
    null
  );
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
          appId: '3f2b52c0c69e1c63ad720046a6977c0b',
          appKey: 'ak_live_TN4xwt5fFxoxfhV67etTmg1neIZi1mz9tE1AfIarghl',
        });
        await widgetInstance.init({ loginProviders: ['google'] });

        // Wepin Provider 초기화
        const providerInstance = new WepinProviderSDK({
          appId: '3f2b52c0c69e1c63ad720046a6977c0b',
          appKey: 'ak_live_TN4xwt5fFxoxfhV67etTmg1neIZi1mz9tE1AfIarghl',
        });
        await providerInstance.init({
          defaultLanguage: 'ko',
          defaultCurrency: 'KRW',
        });

        console.log(providerInstance.isInitialized(), '초기화 완료?');

        if (!isMounted) return;
        setWepinLogin(loginInstance);
        setWepinSDK(widgetInstance);
        setWepinProvider(providerInstance);
        setIsInitialized(true);

        // 로그인 상태 확인
        try {
          const status = await widgetInstance.getStatus();

          if (status === 'login') {
            setIsLoggedIn(true);

            // 기존 사용자 정보 조회
            try {
              const sdkUserInfo = (widgetInstance as any)._userInfo?.userInfo;
              if (sdkUserInfo) {
                setUserInfo(sdkUserInfo);
              }
            } catch (userInfoError) {
              console.warn('기존 사용자 정보 조회 실패:', userInfoError);
            }

            // 기존 사용자 계정 정보 조회
            try {
              const userAccounts = await widgetInstance.getAccounts();
              setAccounts(userAccounts || []);
            } catch (accountsError) {
              console.warn('기존 사용자 계정 정보 조회 실패:', accountsError);
              setAccounts([]);
            }
          } else if (status === 'login_before_register') {
            setIsLoggedIn(true);

            // 새로운 사용자 정보 조회
            try {
              const sdkUserInfo = (widgetInstance as any)._userInfo?.userInfo;
              if (sdkUserInfo) {
                setUserInfo(sdkUserInfo);
              }
            } catch (userInfoError) {
              console.warn('새로운 사용자 정보 조회 실패:', userInfoError);
            }

            // 새로운 사용자는 지갑이 아직 생성되지 않았으므로 빈 배열로 설정
            setAccounts([]);
          } else {
            setIsLoggedIn(false);
            setUserInfo(null);
            setAccounts([]);
          }
        } catch (statusError) {
          console.error(statusError);
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

  const loginByWepin = async () => {
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
          console.error(accountsError);
          // 계정 조회 실패 시 새로운 사용자 등록 시도
          try {
            await wepinSDK.register();

            // 등록 후 바로 계정 정보 조회 시도
            try {
              userAccounts = await wepinSDK.getAccounts();
            } catch (finalAccountsError) {
              console.error(finalAccountsError);
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
        console.error('Wepin SDK 로그아웃 실패, 계속 진행', error);
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

  // 컨트랙트 함수 콜 (읽기 전용)
  const callContract = async (
    network: string,
    contractAddress: string,
    abi: any[],
    methodName: string,
    params: any[]
  ) => {
    if (!wepinProvider) {
      throw new Error('Wepin Provider가 초기화되지 않았습니다.');
    }
    try {
      // 위핀 프로바이더에서 이더리움 프로바이더 가져오기
      const provider = await wepinProvider.getProvider(network);

      // ethers.js로 컨트랙트 인스턴스 생성
      const { ethers } = await import('ethers');

      // BrowserProvider로 EIP-1193 provider를 래핑
      const browserProvider = new ethers.BrowserProvider(provider);
      const contract = new ethers.Contract(
        contractAddress,
        abi,
        browserProvider
      );

      // 컨트랙트 함수 호출
      const result = await contract[methodName](...params);
      return result;
    } catch (error) {
      console.error('Error calling contract:', error);
      throw error;
    }
  };

  // 컨트랙트 함수 콜 (상태 변경)
  const executeContract = async (
    network: string,
    contractAddress: string,
    abi: any[],
    methodName: string,
    params: any[]
  ) => {
    if (!wepinProvider) {
      throw new Error('Wepin Provider가 초기화되지 않았습니다.');
    }
    try {
      // 위핀 프로바이더에서 이더리움 프로바이더 가져오기
      const provider = await wepinProvider.getProvider(network);
      console.log(provider);
      // ethers.js로 컨트랙트 인스턴스 생성 (서명자 연결)
      const { ethers } = await import('ethers');

      // BrowserProvider로 EIP-1193 provider를 래핑하여 getSigner() 사용 가능하게 함
      const browserProvider = new ethers.BrowserProvider(provider);
      const signer = await browserProvider.getSigner();
      console.log(signer, 'signer');
      const contract = new ethers.Contract(contractAddress, abi, signer);
      console.log(contract, 'contract');
      // 컨트랙트 함수 호출
      const tx = await contract[methodName](...params);
      console.log(tx, 'tx');

      return await tx.wait();
    } catch (error) {
      console.error('Error executing contract:', error);
      throw error;
    }
  };

  const initWepinSDK = async (): Promise<WepinSDK | null> => {
    if (wepinSDK) {
      return wepinSDK; // 이미 초기화된 경우
    }

    try {
      // Wepin Widget SDK 초기화
      const { WepinSDK }: WepinSDKModule = await import('@wepin/sdk-js');
      const widgetInstance = new WepinSDK({
        appId: '3f2b52c0c69e1c63ad720046a6977c0b',
        appKey: 'ak_live_TN4xwt5fFxoxfhV67etTmg1neIZi1mz9tE1AfIarghl',
      });
      await widgetInstance.init({ loginProviders: ['google'] });

      setWepinSDK(widgetInstance);
      setIsInitialized(true);

      return widgetInstance;
    } catch (error) {
      console.error('Wepin SDK 초기화 실패:', error);
      return null;
    }
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
        initWepinSDK,
        setIsLoggedIn,
        setUserInfo,
        setAccounts,
        loginByWepin,
        logout,
        getAccounts,
        getBalance,
        callContract,
        executeContract,
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
