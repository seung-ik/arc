import { WepinSDK } from '@wepin/sdk-js';

// Wepin SDK 인스턴스
let wepinSDK: WepinSDK | null = null;

// Wepin SDK 초기화
export const initializeWepin = async () => {
  if (wepinSDK) {
    return wepinSDK;
  }

  try {
    wepinSDK = new WepinSDK({
      appId: process.env.NEXT_PUBLIC_WEPIN_APP_ID || 'your_app_id_here',
      appKey: process.env.NEXT_PUBLIC_WEPIN_APP_KEY || 'your_app_key_here',
    });

    await wepinSDK.init();
    console.log('Wepin SDK initialized successfully');

    return wepinSDK;
  } catch (error) {
    console.error('Failed to initialize Wepin SDK:', error);
    throw error;
  }
};

// Wepin SDK 인스턴스 가져오기
export const getWepinSDK = () => {
  if (!wepinSDK) {
    throw new Error('Wepin SDK is not initialized. Call initializeWepin() first.');
  }
  return wepinSDK;
};

// 로그인 상태 확인
export const checkLoginStatus = async () => {
  try {
    const sdk = getWepinSDK();
    const accounts = await sdk.getAccounts();
    return accounts && accounts.length > 0;
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};

// 로그아웃
export const logout = async () => {
  try {
    const sdk = getWepinSDK();
    await sdk.logout();
    console.log('Logged out successfully');
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

// 계정 정보 가져오기
export const getAccounts = async () => {
  try {
    const sdk = getWepinSDK();
    return await sdk.getAccounts();
  } catch (error) {
    console.error('Error getting accounts:', error);
    throw error;
  }
};

// 잔액 조회
export const getBalance = async (network: string, address: string) => {
  try {
    const sdk = getWepinSDK();
    return await sdk.getBalance([{ network, address }]);
  } catch (error) {
    console.error('Error getting balance:', error);
    throw error;
  }
};
