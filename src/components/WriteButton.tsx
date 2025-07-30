import styled from 'styled-components';
import { ICONS } from '@/assets';
import Image from 'next/image';
import Link from 'next/link';

const WriteButtonContainer = styled.div`
  position: fixed;
  width: 100%;
  max-width: 768px;
  height: calc(100vh - 62px);
  top: 0;
  left: 50%;
  transform: translateX(-50%);
`;

const WriteButtonLink = styled(Link)`
  position: absolute;
  bottom: 12px;
  right: 16px;
  z-index: 10;

  display: flex;
  gap: ${props => props.theme.spacing.xs};
  align-items: center;

  background: #111;
  color: #fff;
  border: none;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background 0.2s;
  text-decoration: none;

  &:hover {
    background: #222;
  }

  &:active {
    transform: translateY(1px);
  }
`;

interface WriteButtonProps {
  href: string;
}

export default function WriteButton({ href }: WriteButtonProps) {
  return (
    <WriteButtonContainer>
      <WriteButtonLink href={href} prefetch={true}>
        <Image src={ICONS.PLUS} alt="plus" width={20} height={20} />
        <span>글쓰기</span>
      </WriteButtonLink>
    </WriteButtonContainer>
  );
}
