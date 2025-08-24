'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useWepin } from '@/contexts/WepinContext';
import { ROUTES } from '@/constants/routes';
import { useLoginApi } from '@/api/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { useLogoutAll } from '@/hooks/useLogoutAll';
import { IMAGES } from '@/assets';
import Image from 'next/image';
import FullPageLoading from '@/components/layout/FullPageLoading';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 0;
  background-color: white;
  max-width: 768px;
  margin: 0 auto;
  padding: 10vh 12vw 8vh;
  background: linear-gradient(to bottom, #ffffff, #f5fffb);

  img {
    background-color: transparent;
  }
`;

const BrandSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-top: 0;
`;

const BrandTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes['4xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.textBlack};
  margin: 0;
  margin-top: ${props => props.theme.spacing.lg};
`;

const Slogan = styled.p`
  text-align: center;
  margin: 0;
  color: #555;
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.normal};
  line-height: 1.8;
`;

const LoginButton = styled.button`
  background: ${props => props.theme.colors.primaryHover};
  border: 2px solid ${props => props.theme.colors.primaryDark};
  border-radius: ${props => props.theme.borderRadius['2xl']};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.xl};
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.md};
  color: white;
  margin-top: ${props => props.theme.spacing.lg};

  &:hover,
  &:active {
    background: ${props => props.theme.colors.primaryHover};
    color: white;
    transform: none;
    box-shadow: none;
  }

  &:disabled {
    background: ${props => props.theme.colors.textLightGray};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export default function LoginClient() {
  const router = useRouter();
  const { isInitialized, loginByWepin } = useWepin();
  const { mutate: login } = useLoginApi();
  const { setProfile, setIsLoggedIn } = useAuthStore();
  const { handleLogout } = useLogoutAll();

  const handleGoogleLogin = async () => {
    if (!isInitialized) {
      alert('Wepin SDK가 초기화되지 않았습니다.');
      return;
    }

    try {
      // Wepin SDK를 통한 구글 로그인 및 지갑 생성
      const data = await loginByWepin();

      if (data) {
        const params = {
          idToken: data.idToken,
          email: data.wepinUser.userInfo.email,
          accounts: data.accounts,
        };

        login(params, {
          onSuccess: ({ data, success, message }) => {
            if (success === true) {
              // API 요청 시 헤더에 사용할 토큰 저장
              localStorage.setItem('ACCESS_TOKEN', data.accessToken);

              // userStore에 사용자 정보 저장
              setProfile({
                availableToken: data.user.availableToken,
                email: data.user.email,
                id: data.user.id,
                nickname: data.user.nickname,
                profileImageUrl: data.user.profileImageUrl,
                tokenAmount: data.user.tokenAmount,
                walletAddress: data.user.walletAddress,
              });
              setIsLoggedIn(true);

              router.push(ROUTES.elo.root);
            } else {
              alert(message);
            }
          },
          onError: err => {
            console.error('Login failed:', err);
          },
        });
      }
    } catch (error) {
      handleLogout();
      console.error('Wepin login failed:', error);
    }
  };

  if (!isInitialized) {
    return <FullPageLoading />;
  }

  return (
    <LoginContainer>
      <BrandSection>
        <Image
          src={IMAGES.LOGO_TRIVUS}
          alt="Trivus logo"
          width={100}
          style={{ marginTop: '4vh' }}
        />
        <BrandTitle>Trivus</BrandTitle>
        <Slogan>
          기록은 온라인에, 경험은 오프라인에,
          <br />
          가치는 모두에게.
        </Slogan>
      </BrandSection>
      <LoginButton onClick={handleGoogleLogin}>
        <Image src={IMAGES.LOGO_GOOGLE} alt="logo" width={30} />
        <span>구글 계정으로 시작하기</span>
      </LoginButton>
    </LoginContainer>
  );
}
