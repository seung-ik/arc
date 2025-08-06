'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWepin } from '@/contexts/WepinContext';
import { IWepinUser } from '@wepin/sdk-js';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 20px;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 600;
`;

const StatusText = styled.p`
  color: #666;
  margin-bottom: 20px;
  font-size: 16px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #23424a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default function LoginBridgePage() {
  const { wepinSDK, setIsLoggedIn, setUserInfo, setAccounts } = useWepin();
  const [status, setStatus] = useState('WEPIN 사용자 정보를 기다리는 중...');
  const [isLoading, setIsLoading] = useState(true);

  // 웹에서 React Native로 로그 전송
  const sendLogToRN = (message: string) => {
    (window as any).ReactNativeWebView.postMessage(
      JSON.stringify({
        type: 'DEBUG_LOG',
        message: message,
      })
    );
  };

  // WEPIN 사용자 데이터 처리 함수
  const handleWepinUserData = async (payload: {
    wepinUser: IWepinUser;
    idToken: string;
  }) => {
    sendLogToRN('=== WEPIN 사용자 데이터 처리 시작 ===');
    sendLogToRN('받은 payload: ' + JSON.stringify(payload));
    sendLogToRN('WEPIN 사용자 정보 받음: ' + JSON.stringify(payload));

    if (!payload.wepinUser) {
      setStatus('WEPIN 사용자 정보가 없습니다');
      setIsLoading(false);
      return;
    }

    try {
      const wepinUser = payload.wepinUser;
      let userAccounts: any[] = [];

      if (!wepinSDK) {
        sendLogToRN('ERROR: wepinSDK가 초기화되지 않음');
        setStatus('WEPIN SDK 초기화 실패');
        setIsLoading(false);
        return;
      }
      sendLogToRN('wepinUser 정보: ' + JSON.stringify(wepinUser));
      wepinSDK.setUserInfo(wepinUser);
      sendLogToRN('wepinSDK.setUserInfo 완료');

      // 계정 정보 조회 시도
      try {
        sendLogToRN('계정 정보 조회 시도...');
        userAccounts = await wepinSDK.getAccounts();
        sendLogToRN('계정 정보 조회 성공: ' + JSON.stringify(userAccounts));
      } catch (accountsError) {
        sendLogToRN('ERROR: 계정 정보 조회 실패 - ' + accountsError);
        // 계정 조회 실패 시 새로운 사용자 등록 시도
        try {
          sendLogToRN('새로운 사용자 등록 시도...');
          await wepinSDK.register();
          sendLogToRN('사용자 등록 성공');

          // 등록 후 바로 계정 정보 조회 시도
          try {
            userAccounts = await wepinSDK.getAccounts();
            sendLogToRN(
              '등록 후 계정 정보 조회 성공: ' + JSON.stringify(userAccounts)
            );
          } catch (finalAccountsError) {
            sendLogToRN(
              'ERROR: 등록 후 계정 정보 조회 실패 - ' + finalAccountsError
            );
            userAccounts = [];
          }
        } catch (registerError) {
          sendLogToRN('WARN: 사용자 등록 실패 - ' + registerError);
          userAccounts = [];
          return;
        }
      }
      sendLogToRN('계정 정보 처리 완료');

      setIsLoggedIn(true);
      setUserInfo(wepinUser);
      setAccounts(userAccounts);
      sendLogToRN('상태 업데이트 완료');

      // 백엔드 로그인 처리
      //   await handleBackendLogin({
      //     idToken: wepinUser.idToken,
      //     email: wepinUser?.userInfo?.email,
      //     accounts: userAccounts,
      //   });
    } catch (error) {
      sendLogToRN('ERROR: WEPIN 사용자 정보 설정 실패 - ' + error);
      setStatus('WEPIN 사용자 정보 설정 실패');
      setIsLoading(false);
    }
  };

  // 알 수 없는 메시지 타입 처리 함수
  const handleUnknownMessageType = (type: string) => {
    sendLogToRN('알 수 없는 메시지 타입: ' + type);
  };

  useEffect(() => {
    // WebView에서 메시지를 받는 이벤트 리스너
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        sendLogToRN('React Native에서 받은 메시지: ' + JSON.stringify(data));

        switch (data.type) {
          case 'WEPIN_USER_DATA':
            handleWepinUserData(data.payload);
            break;
          default:
            handleUnknownMessageType(data.type);
        }
      } catch (error) {
        sendLogToRN('ERROR: 메시지 파싱 오류 - ' + error);
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener('message', handleMessage);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // 백엔드 로그인 처리
  //   const handleBackendLogin = async (wepinUser: any, userAccounts: any[]) => {
  //
  //   };

  return (
    <Container>
      <LoginCard>
        <Title>로그인 브리지</Title>
        {isLoading && <LoadingSpinner />}
        <StatusText>{status}</StatusText>
      </LoginCard>
    </Container>
  );
}
