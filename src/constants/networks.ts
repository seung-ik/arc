/**
 * 블록체인 네트워크 설정 상수
 * 네트워크 변경 시 이 파일만 수정하면 됩니다.
 */

export const NETWORKS = {
  VERYNETWORK_MAINNET: 'evmvery',
  POLYGON_MAINNET: 'evmpolygon-mainnet',
  POLYGON_TESTNET: 'evmpolygon-amoy',
  // 다른 네트워크들 추가 가능
} as const;

export type NetworkType = (typeof NETWORKS)[keyof typeof NETWORKS];

/**
 * 기본 네트워크 설정
 * 개발/프로덕션 환경에 따라 변경
 */
export const DEFAULT_NETWORK = NETWORKS.VERYNETWORK_MAINNET;

/**
 * 네트워크별 설정 정보
 */
export const NETWORK_CONFIG = {
  [NETWORKS.VERYNETWORK_MAINNET]: {
    name: 'VERYNETWORK Mainnet',
    chainId: 1, // 실제 체인 ID로 수정 필요
    explorer: 'https://explorer.very.network',
    rpcUrl: 'https://rpc.very.network',
  },
  [NETWORKS.POLYGON_MAINNET]: {
    name: 'Polygon Mainnet',
    chainId: 137,
    explorer: 'https://polygonscan.com',
    rpcUrl: 'https://polygon-rpc.com',
  },
  [NETWORKS.POLYGON_TESTNET]: {
    name: 'Polygon Amoy Testnet',
    chainId: 80002,
    explorer: 'https://www.oklink.com/amoy',
    rpcUrl: 'https://rpc-amoy.polygon.technology',
  },
} as const;
