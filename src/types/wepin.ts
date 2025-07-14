// 실제 WepinSDK 라이브러리에서 타입을 가져옴
export type { WepinSDK } from '@wepin/sdk-js';

// 동적 import를 위한 타입
export type WepinSDKModule = {
  WepinSDK: typeof import('@wepin/sdk-js').WepinSDK;
};
