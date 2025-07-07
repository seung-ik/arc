'use client';

import styled from 'styled-components';
import { useState } from 'react';
import TwoButtonModal from './TwoButtonModal';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.sm};
`;

const Label = styled.label`
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: ${(props) => props.theme.colors.textBlack};
  font-size: ${(props) => props.theme.typography.fontSizes.base};
`;

const Select = styled.select`
  padding: ${(props) => props.theme.spacing.md};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.textBlack};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const Input = styled.input`
  padding: ${(props) => props.theme.spacing.md};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.textBlack};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const ResultGroup = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
`;

const ResultButton = styled.button<{ $isSelected: boolean; $isWin: boolean }>`
  flex: 1;
  padding: ${(props) => props.theme.spacing.md};
  border: 2px solid
    ${(props) =>
      props.$isSelected
        ? props.$isWin
          ? props.theme.colors.success
          : props.theme.colors.error
        : props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background-color: ${(props) =>
    props.$isSelected
      ? props.$isWin
        ? props.theme.colors.success
        : props.theme.colors.error
      : props.theme.colors.background};
  color: ${(props) =>
    props.$isSelected ? props.theme.colors.textWhite : props.theme.colors.textBlack};
  font-size: ${(props) => props.theme.typography.fontSizes.base};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${(props) =>
      props.$isWin ? props.theme.colors.success : props.theme.colors.error};
  }
`;

const ErrorMessage = styled.div`
  color: ${(props) => props.theme.colors.error};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  margin-top: ${(props) => props.theme.spacing.xs};
`;

interface MatchRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SPORTS = [
  { value: 'table-tennis', label: '탁구', icon: '🏓' },
  { value: 'badminton', label: '배드민턴', icon: '🏸' },
  { value: 'billiards', label: '당구', icon: '🎱' },
  { value: 'go', label: '바둑', icon: '🏁' },
  { value: 'tennis', label: '테니스', icon: '🎾' },
  { value: 'chess', label: '체스', icon: '♟️' },
];

export default function MatchRegistrationModal({ isOpen, onClose }: MatchRegistrationModalProps) {
  const [sport, setSport] = useState('');
  const [opponentId, setOpponentId] = useState('');
  const [result, setResult] = useState<'승' | '패' | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!sport) {
      newErrors.sport = '종목을 선택해주세요';
    }

    if (!opponentId.trim()) {
      newErrors.opponentId = '상대방 ID를 입력해주세요';
    } else if (opponentId.trim().length < 3) {
      newErrors.opponentId = '상대방 ID는 3자 이상이어야 합니다';
    }

    if (!result) {
      newErrors.result = '결과를 선택해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // 실제 제출 로직
      console.log('Match registration:', { sport, opponentId, result });
      onClose();

      // 폼 초기화
      setSport('');
      setOpponentId('');
      setResult(null);
      setErrors({});
    }
  };

  const handleClose = () => {
    onClose();
    // 폼 초기화
    setSport('');
    setOpponentId('');
    setResult(null);
    setErrors({});
  };

  const formContent = (
    <FormContainer>
      <FormGroup>
        <Label>종목</Label>
        <Select value={sport} onChange={(e) => setSport(e.target.value)}>
          <option value="">종목을 선택하세요</option>
          {SPORTS.map((sportOption) => (
            <option key={sportOption.value} value={sportOption.value}>
              {sportOption.icon} {sportOption.label}
            </option>
          ))}
        </Select>
        {errors.sport && <ErrorMessage>{errors.sport}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label>상대방 ID</Label>
        <Input
          type="text"
          value={opponentId}
          onChange={(e) => setOpponentId(e.target.value)}
          placeholder="상대방의 ID를 입력하세요"
        />
        {errors.opponentId && <ErrorMessage>{errors.opponentId}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label>결과</Label>
        <ResultGroup>
          <ResultButton $isSelected={result === '승'} $isWin={true} onClick={() => setResult('승')}>
            승
          </ResultButton>
          <ResultButton
            $isSelected={result === '패'}
            $isWin={false}
            onClick={() => setResult('패')}
          >
            패
          </ResultButton>
        </ResultGroup>
        {errors.result && <ErrorMessage>{errors.result}</ErrorMessage>}
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
