'use client';

import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useAuthStore } from '@/stores/authStore';
import { useInitNicknameApi } from '@/api/useUser';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { useLogoutAll } from '@/hooks/useLogoutAll';

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: white;
  max-width: 768px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
`;

const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
  width: 100%;
  margin-top: ${props => props.theme.spacing.xs};
`;

const Title = styled.h1`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSizes['2xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.textGray};
  font-size: ${props => props.theme.typography.fontSizes.base};
`;

const Content = styled.main`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  width: 100%;
  max-width: 420px;
  margin-top: ${props => props.theme.spacing.lg};
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.typography.fontSizes.base};
`;

const Button = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition:
    background 120ms ease,
    transform 80ms ease,
    box-shadow 120ms ease,
    opacity 120ms ease;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
  }

  &:active {
    transform: translateY(1px) scale(0.98);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
    opacity: 0.95;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const HelperText = styled.p`
  color: ${props => props.theme.colors.textLightGray};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

// Removed sticky footer since we place helper + button inline at bottom

const FooterButton = styled(Button)`
  width: 100%;
  max-width: 768px;
`;

const LogoutChip = styled.button`
  border: 1px solid ${props => props.theme.colors.border};
  background: transparent;
  color: ${props => props.theme.colors.textGray};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius['2xl']};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  cursor: pointer;
`;

export default function NicknamePage() {
  const router = useRouter();
  const { userProfile, setProfile } = useAuthStore();
  const { mutate: initNickname, isPending } = useInitNicknameApi();
  const [nickname, setNickname] = useState<string>(userProfile.nickname ?? '');
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const { handleLogout } = useLogoutAll();

  const isValid = useMemo(
    () => nickname.trim().length > 0 && nickname.trim().length <= 10,
    [nickname]
  );

  useEffect(() => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('ACCESS_TOKEN')
        : null;
    if (!token) {
      router.replace(ROUTES.auth.login);
      return;
    }
    if (userProfile.nickname) {
      router.replace(ROUTES.elo.root);
      return;
    }
    setIsAllowed(true);
  }, [router, userProfile.nickname]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    initNickname(
      { nickname: nickname.trim() },
      {
        onSuccess: response => {
          setProfile({ ...userProfile, nickname: response.data.nickname });
          router.push(ROUTES.elo.root);
        },
        onError: error => {
          console.error('닉네임 설정 실패:', error);
          alert('닉네임 설정에 실패했습니다. 다시 시도해주세요.');
        },
      }
    );
  };

  if (!isAllowed) return null;

  return (
    <Wrapper>
      <TopBar>
        <LogoutChip onClick={handleLogout}>로그아웃</LogoutChip>
      </TopBar>
      <Header>
        <Title>닉네임 설정</Title>
        <Subtitle>트리버스에서 당신을 뭐라고 부를까요?</Subtitle>
      </Header>
      <Content>
        <Form onSubmit={onSubmit} id="nickname-form">
          <Input
            value={nickname}
            placeholder="닉네임을 입력해주세요(최대 10자)"
            onChange={e => setNickname(e.target.value)}
            maxLength={10}
            autoFocus
          />
        </Form>
      </Content>
      <HelperText style={{ textAlign: 'center', padding: '0 1rem' }}>
        * 설정에서 언제든 변경할 수 있어요
      </HelperText>
      <FooterButton
        type="submit"
        form="nickname-form"
        disabled={isPending || !isValid}
      >
        다음
      </FooterButton>
    </Wrapper>
  );
}
