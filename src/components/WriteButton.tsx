import styled from 'styled-components';
import { ICONS } from '@/assets';

const WriteButtonContainer = styled.button`
  position: fixed;
  right: 24px;
  bottom: 75px;
  z-index: 100;
  width: px;
  height: 56px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

interface WriteButtonProps {
  onClick: () => void;
}

export default function WriteButton({ onClick }: WriteButtonProps) {
  return (
    <WriteButtonContainer onClick={onClick}>
      <div
        style={{
          width: 56,
          height: 56,
          backgroundColor: '#007aff',
          WebkitMaskImage: `url(${ICONS.PLUS_CIRCLE.src})`,
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskSize: 'contain',
          maskImage: `url(${ICONS.PLUS_CIRCLE.src})`,
          maskRepeat: 'no-repeat',
          maskSize: 'contain',
        }}
      />
    </WriteButtonContainer>
  );
}
