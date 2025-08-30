'use client';

import styled from 'styled-components';
import Modal from '@/components/modals/Modal';

interface TokenHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 목업 데이터
const mockTokenHistory = [
  {
    id: 1,
    action: '좋아요',
    target: '게시글 #8',
    reason: '좋아요 시 토큰 차감',
    amount: '1 EXP',
    direction: 'spent',
    timestamp: '2025. 8. 29. 오후 3:19:14',
  },
  {
    id: 2,
    action: '누적 토큰 수령',
    target: '블록체인',
    reason: '누적 토큰 수령',
    amount: '3 EXP',
    direction: 'earned',
    timestamp: '2025. 8. 29. 오후 1:29:09',
  },
  {
    id: 3,
    action: '닉네임 변경',
    target: '시스템',
    reason: '닉네임 변경 시 토큰 차감',
    amount: '1 EXP',
    direction: 'spent',
    timestamp: '2025. 8. 28. 오후 2:15:30',
  },
  {
    id: 4,
    action: '매치 승리',
    target: '테니스',
    reason: '매치 승리 보상',
    amount: '5 EXP',
    direction: 'earned',
    timestamp: '2025. 8. 28. 오전 11:20:15',
  },
];

const ModalContent = styled.div`
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const HistoryItem = styled.div`
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ActionTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const Amount = styled.div<{ $isPositive: boolean }>`
  font-size: 16px;
  font-weight: 700;
  color: ${props => (props.$isPositive ? '#22c55e' : '#ef4444')};
`;

const ItemDetails = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const Timestamp = styled.div`
  font-size: 12px;
  color: #999;
  text-align: right;
`;

const TokenHistoryModal: React.FC<TokenHistoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="수확 가능한 EXP">
      <ModalContent>
        <HistoryList>
          {mockTokenHistory.map(item => (
            <HistoryItem key={item.id}>
              <ItemHeader>
                <ActionTitle>{item.action}</ActionTitle>
                <Amount $isPositive={item.direction === 'earned'}>
                  {item.direction === 'earned' ? '+' : '-'}
                  {item.amount}
                </Amount>
              </ItemHeader>
              <ItemDetails>
                {item.target} • {item.reason}
              </ItemDetails>
              <Timestamp>{item.timestamp}</Timestamp>
            </HistoryItem>
          ))}
        </HistoryList>
      </ModalContent>
    </Modal>
  );
};

export default TokenHistoryModal;
