'use client';

import styled from 'styled-components';

interface MentorPostFormSectionProps {
  formData: {
    sport: string;
    customSport: string;
    elo: string;
    location: string;
    tokenReward: string;
  };
  onInputChange: (field: string, value: string) => void;
  categories: Array<{ value: string; label: string }>;
}

const MentorFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
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
  font-style: italic;
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

export default function MentorPostFormSection({
  formData,
  onInputChange,
  categories,
}: MentorPostFormSectionProps) {
  return (
    <>
      <div
        style={{
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
          border: '1px solid #2196f3',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
        }}
      >
        <h3
          style={{
            color: '#2196f3',
            margin: '0 0 8px 0',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          📚 멘토링 요청 안내
        </h3>
        <p
          style={{
            color: '#666',
            margin: 0,
            fontSize: '14px',
            lineHeight: '1.5',
          }}
        >
          멘토링을 받고 싶은 종목, 희망하는 멘토의 실력 수준, 지역, 보상 토큰
          등을 상세히 작성해주세요. 멘토가 요청을 보고 연락을 드릴 예정입니다.
        </p>
      </div>

      <MentorFields>
        <FieldRow>
          <FormGroup>
            <FieldDescription>
              <FieldLabel htmlFor="sport">종목 *</FieldLabel>
              <FieldHelp>
                멘토링을 받고 싶은 종목을 선택하거나 직접 입력하세요
              </FieldHelp>
            </FieldDescription>
            <Select
              id="sport"
              value={formData.sport || ''}
              onChange={e => onInputChange('sport', e.target.value)}
              required
            >
              <option value="">종목 선택</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
              <option value="직접입력">직접 입력</option>
            </Select>
            {formData.sport === '직접입력' && (
              <Input
                type="text"
                value={formData.customSport || ''}
                onChange={e => onInputChange('customSport', e.target.value)}
                placeholder="종목을 직접 입력하세요"
                style={{ marginTop: '8px' }}
                required
              />
            )}
          </FormGroup>

          <FormGroup>
            <FieldDescription>
              <FieldLabel htmlFor="elo">희망 멘토 실력 *</FieldLabel>
              <FieldHelp>희망하는 멘토의 최소 실력 수준</FieldHelp>
            </FieldDescription>
            <Select
              id="elo"
              value={formData.elo || ''}
              onChange={e => onInputChange('elo', e.target.value)}
              required
            >
              <option value="">실력 선택</option>
              <option value="1000-1200">1000-1200 (초급)</option>
              <option value="1200-1400">1200-1400 (중급)</option>
              <option value="1400-1600">1400-1600 (고급)</option>
              <option value="1600+">1600+ (전문가)</option>
            </Select>
          </FormGroup>
        </FieldRow>

        <FieldRow>
          <FormGroup>
            <FieldDescription>
              <FieldLabel htmlFor="location">지역 *</FieldLabel>
              <FieldHelp>멘토링을 받을 수 있는 지역</FieldHelp>
            </FieldDescription>
            <Input
              id="location"
              type="text"
              value={formData.location || ''}
              onChange={e => onInputChange('location', e.target.value)}
              placeholder="예: 서울 강남구"
              required
            />
          </FormGroup>

          <FormGroup>
            <FieldDescription>
              <FieldLabel htmlFor="tokenReward">보상 토큰 *</FieldLabel>
              <FieldHelp>멘토에게 지급할 토큰 수량 (숫자만 입력)</FieldHelp>
            </FieldDescription>
            <Input
              id="tokenReward"
              type="number"
              value={formData.tokenReward || ''}
              onChange={e => {
                const value = e.target.value;
                // 숫자만 허용
                if (value === '' || /^\d+$/.test(value)) {
                  onInputChange('tokenReward', value);
                }
              }}
              onKeyPress={e => {
                // 숫자와 백스페이스, 화살표 키만 허용
                if (
                  !/[0-9]/.test(e.key) &&
                  e.key !== 'Backspace' &&
                  e.key !== 'Delete' &&
                  e.key !== 'ArrowLeft' &&
                  e.key !== 'ArrowRight'
                ) {
                  e.preventDefault();
                }
              }}
              placeholder="예: 100"
              min="1"
              required
            />
          </FormGroup>
        </FieldRow>
      </MentorFields>
    </>
  );
}
