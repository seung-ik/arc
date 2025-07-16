export type { WepinSDK } from '@wepin/sdk-js';
export type { WepinLogin } from '@wepin/login-js';

export type WepinSDKModule = {
  WepinSDK: typeof import('@wepin/sdk-js').WepinSDK;
};

export type WepinLoginModule = {
  WepinLogin: typeof import('@wepin/login-js').WepinLogin;
};
