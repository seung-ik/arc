'use client';

import styled from 'styled-components';

interface MatchPostFormSectionProps {
  formData: {
    matchLocation: string;
    myElo: string;
    preferredElo: string;
    validityPeriod: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const VALIDITY_PERIODS = [
  { value: '1day', label: '1일', token: 10 },
  { value: '3days', label: '3일', token: 25 },
  { value: '7days', label: '7일', token: 50 },
  { value: '14days', label: '14일', token: 90 },
  { value: '30days', label: '30일', token: 150 },
];

const MatchFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const FieldDescription = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FieldLabel = styled.label`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.textBlack};
`;

const FieldHelp = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.textGray};
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.textBlack};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textGray};
  }
`;

const Select = styled.select`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.textBlack};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TimeLocationRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.md};
`;

const ValidityPeriodSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const ValidityTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.textBlack};
  margin: 0;
`;

const ValidityCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${props => props.theme.spacing.xs};
`;

const ValidityCard = styled.div<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${props => props.theme.spacing.sm};
  border: 2px solid
    ${props =>
      props.$selected ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  background-color: ${props =>
    props.$selected
      ? props.theme.colors.primaryLight
      : props.theme.colors.background};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primaryLight};
  }
`;

const ValidityPeriod = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.textBlack};
  margin-bottom: 4px;
`;

const ValidityToken = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.textGray};
`;

const TokenInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.sm};
`;

const TokenLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textBlack};
`;

const TokenAmount = styled.span<{ $insufficient: boolean }>`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props =>
    props.$insufficient
      ? props.theme.colors.error
      : props.theme.colors.primary};
`;

export default function MatchPostFormSection({
  formData,
  onInputChange,
}: MatchPostFormSectionProps) {
  return (
    <>
      <div
        style={{
          background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%)',
          border: '1px solid #4caf50',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
        }}
      >
        <h3
          style={{
            color: '#4caf50',
            margin: '0 0 8px 0',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          🏓 매칭 요청 안내
        </h3>
        <p
          style={{
            color: '#666',
            margin: 0,
            fontSize: '14px',
            lineHeight: '1.5',
          }}
        >
          매칭을 원하는 장소, 상대 실력을 설정하고 유효기간을 선택하세요. AI
          추천 시스템을 통해 적합한 상대를 찾아드립니다.
        </p>
      </div>

      <MatchFields>
        <FormGroup>
          <FieldDescription>
            <FieldLabel htmlFor="matchLocation">선호 장소</FieldLabel>
            <FieldHelp>매칭을 원하는 장소를 입력하세요 (선택사항)</FieldHelp>
          </FieldDescription>
          <Input
            id="matchLocation"
            type="text"
            value={formData.matchLocation}
            onChange={e => onInputChange('matchLocation', e.target.value)}
            placeholder="예: 강남구 테니스장, 협의 가능"
          />
        </FormGroup>

        <TimeLocationRow>
          <FormGroup>
            <FieldDescription>
              <FieldLabel htmlFor="myElo">내 실력 (Elo)</FieldLabel>
              <FieldHelp>현재 Elo 점수를 입력하세요</FieldHelp>
            </FieldDescription>
            <Input
              id="myElo"
              type="number"
              value={formData.myElo}
              onChange={e => onInputChange('myElo', e.target.value)}
              placeholder="예: 1200"
              min="0"
            />
          </FormGroup>

          <FormGroup>
            <FieldDescription>
              <FieldLabel htmlFor="preferredElo">희망 상대 실력</FieldLabel>
              <FieldHelp>희망하는 상대의 실력 범위</FieldHelp>
            </FieldDescription>
            <Select
              id="preferredElo"
              value={formData.preferredElo}
              onChange={e => onInputChange('preferredElo', e.target.value)}
            >
              <option value="">실력 무관</option>
              <option value="similar">비슷한 실력</option>
              <option value="higher">더 높은 실력</option>
              <option value="lower">더 낮은 실력</option>
              <option value="any">모든 실력</option>
            </Select>
          </FormGroup>
        </TimeLocationRow>
      </MatchFields>

      <ValidityPeriodSection>
        <ValidityTitle>유효기간 선택 *</ValidityTitle>
        <ValidityCards>
          {VALIDITY_PERIODS.map(period => (
            <ValidityCard
              key={period.value}
              $selected={formData.validityPeriod === period.value}
              onClick={() => onInputChange('validityPeriod', period.value)}
            >
              <ValidityPeriod>{period.label}</ValidityPeriod>
              <ValidityToken>{period.token} 토큰</ValidityToken>
            </ValidityCard>
          ))}
        </ValidityCards>

        <TokenInfo>
          <TokenLabel>필요 토큰:</TokenLabel>
          <TokenAmount $insufficient={false}>
            {formData.validityPeriod
              ? VALIDITY_PERIODS.find(p => p.value === formData.validityPeriod)
                  ?.token || 0
              : 0}{' '}
            토큰
          </TokenAmount>
        </TokenInfo>
      </ValidityPeriodSection>
    </>
  );
}
