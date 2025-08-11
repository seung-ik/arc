'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuthStore } from '@/stores/authStore';
import { useInitNicknameApi } from '@/api/useUser';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl};
  gap: ${props => props.theme.spacing.lg};
  background-color: white;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  width: 100%;
  max-width: 420px;
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
`;

export default function NicknamePage() {
  const router = useRouter();
  const { userProfile, setProfile } = useAuthStore();
  const { mutate: initNickname, isPending } = useInitNicknameApi();
  const [nickname, setNickname] = useState<string>(userProfile.nickname ?? '');
  const [isAllowed, setIsAllowed] = useState<boolean>(false);

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
    if (!nickname.trim()) return;
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
    <Container>
      <h2>닉네임을 설정해주세요</h2>
      <Form onSubmit={onSubmit}>
        <Input
          value={nickname}
          placeholder="닉네임"
          onChange={e => setNickname(e.target.value)}
          maxLength={20}
        />
        <Button type="submit" disabled={isPending || !nickname.trim()}>
          완료
        </Button>
      </Form>
    </Container>
  );
}
