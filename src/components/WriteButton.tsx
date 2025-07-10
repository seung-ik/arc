import styled from 'styled-components';

const WriteButtonContainer = styled.button`
  position: fixed;
  right: 24px;
  bottom: 75px;
  z-index: 100;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #007aff;
  color: #fff;
  font-size: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: #0056cc;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

interface WriteButtonProps {
  onClick: () => void;
}

export default function WriteButton({ onClick }: WriteButtonProps) {
  return <WriteButtonContainer onClick={onClick}>+</WriteButtonContainer>;
}
