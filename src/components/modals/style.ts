import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #666;
  }
`;

const ModalButton = styled.button<{ variant: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;

  ${({ variant, theme }) =>
    variant === 'primary'
      ? `
        background: ${theme.colors.primary};
        color: white;

        &:hover {
          background: ${theme.colors.primaryHover || theme.colors.primary};
          transform: translateY(-1px);
        }
      `
      : `
        background: ${theme.colors.backgroundGray};
        color: ${theme.colors.textBlack};
        border: 1px solid ${theme.colors.borderLight};

        &:hover {
          background: ${theme.colors.borderLight};
          border-color: ${theme.colors.textGray};
        }
      `}

  &:active {
    transform: translateY(0);
  }
`;

export { ModalOverlay, ModalContent, CloseButton, ModalButton };
