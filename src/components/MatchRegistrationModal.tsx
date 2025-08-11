'use client';

import styled from 'styled-components';
import { useState } from 'react';
import TwoButtonModal from './modals/TwoButtonModal';
import { useCommunityStore } from '@/stores/communityStore';
import { useCreateMatchResultMutation } from '@/api/useMatch';
import { useCheckNickname } from '@/api/useUser';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const Label = styled.label`
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.textBlack};
  font-size: ${props => props.theme.typography.fontSizes.base};
`;

const Select = styled.select`
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.base};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.textBlack};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.base};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.textBlack};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ResultGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
`;

const HandicapGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.xs};
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textGray};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`;

const ResultButton = styled.button<{ $isSelected: boolean; $isWin: boolean }>`
  flex: 1;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border: 2px solid
    ${props =>
      props.$isSelected
        ? props.$isWin
          ? props.theme.colors.success
          : props.theme.colors.error
        : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props =>
    props.$isSelected
      ? props.$isWin
        ? props.theme.colors.success
        : props.theme.colors.error
      : props.theme.colors.background};
  color: ${props =>
    props.$isSelected
      ? props.theme.colors.textWhite
      : props.theme.colors.textBlack};
  font-size: ${props => props.theme.typography.fontSizes.base};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${props =>
      props.$isWin ? props.theme.colors.success : props.theme.colors.error};
  }
`;

// ErrorMessage 스타일 컴포넌트 제거 - 사용하지 않음

interface MatchRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// SPORTS 상수 제거 - sportOptions 사용

export default function MatchRegistrationModal({
  isOpen,
  onClose,
}: MatchRegistrationModalProps) {
  const { sportOptions } = useCommunityStore();
  const createMatchResult = useCreateMatchResultMutation();

  const [sport, setSport] = useState('');
  const [opponentId, setOpponentId] = useState('');
  const [result, setResult] = useState<'win' | 'lose' | null>(null);
  const [isHandicap, setIsHandicap] = useState(false);
  const [nicknameError, setNicknameError] = useState<string>('');

  // 닉네임 체크
  const { checkNickname } = useCheckNickname();

  // 폼 초기화 함수
  const initForm = () => {
    setSport('');
    setOpponentId('');
    setResult(null);
    setIsHandicap(false);
    setNicknameError('');
  };

  // 닉네임 체크 핸들러
  const handleNicknameBlur = async () => {
    return;
    if (opponentId.trim()) {
      try {
        const result = await checkNickname(opponentId.trim());
        if (!result.status) {
          setNicknameError('존재하지 않는 사용자입니다');
        } else {
          setNicknameError('');
        }
      } catch {
        setNicknameError('사용자 확인 중 오류가 발생했습니다');
      }
    } else {
      setNicknameError('');
    }
  };

  const validateForm = () => {
    if (!sport) {
      alert('종목을 선택해주세요');
      return false;
    }

    if (!opponentId.trim()) {
      alert('상대방 ID를 입력해주세요');
      return false;
    }

    if (opponentId.trim().length < 3) {
      alert('상대방 ID는 3자 이상이어야 합니다');
      return false;
    }

    if (!result) {
      alert('결과를 선택해주세요');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const selectedSport = sportOptions.find(
          s => s.value.toString() === sport
        );

        if (!selectedSport) {
          alert('유효하지 않은 종목입니다');
          return;
        }

        const matchData = {
          partnerNickname: opponentId,
          sportCategoryId: selectedSport.value,
          senderResult: result as 'win' | 'lose',
          isHandicap,
        };

        await createMatchResult.mutateAsync(matchData);

        onClose();
        initForm();
      } catch (error) {
        console.error('매치 결과 등록 실패:', error);
        alert('매치 결과 등록에 실패했습니다');
      }
    }
  };

  const handleClose = () => {
    onClose();
    initForm();
  };

  const formContent = (
    <FormContainer>
      <FormGroup>
        <Label>종목</Label>
        <Select value={sport} onChange={e => setSport(e.target.value)}>
          <option value="">종목을 선택하세요</option>
          {sportOptions.map(sportOption => (
            <option
              key={sportOption.value}
              value={sportOption.value.toString()}
            >
              {sportOption.icon} {sportOption.label}
            </option>
          ))}
        </Select>
      </FormGroup>

      <FormGroup>
        <Label>상대방 ID</Label>
        <Input
          type="text"
          value={opponentId}
          onChange={e => setOpponentId(e.target.value)}
          onBlur={handleNicknameBlur}
          placeholder="상대방의 ID를 입력하세요"
        />
        {nicknameError && (
          <div style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}>
            {nicknameError}
          </div>
        )}
      </FormGroup>

      <FormGroup>
        <Label>결과</Label>
        <ResultGroup>
          <ResultButton
            $isSelected={result === 'win'}
            $isWin={true}
            onClick={() => setResult('win')}
          >
            승
          </ResultButton>
          <ResultButton
            $isSelected={result === 'lose'}
            $isWin={false}
            onClick={() => setResult('lose')}
          >
            패
          </ResultButton>
        </ResultGroup>
        <HandicapGroup>
          <Checkbox
            type="checkbox"
            id="handicap"
            checked={isHandicap}
            onChange={e => setIsHandicap(e.target.checked)}
          />
          <CheckboxLabel htmlFor="handicap">핸디캡 매치</CheckboxLabel>
        </HandicapGroup>
      </FormGroup>
    </FormContainer>
  );

  return (
    <TwoButtonModal
      isOpen={isOpen}
      onClose={handleClose}
      title="매치결과 등록"
      content={formContent}
      cancelText="취소"
      confirmText="등록"
      onSubmit={handleSubmit}
    />
  );
}
