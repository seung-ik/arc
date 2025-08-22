'use client';

import { PostFormData } from '@/types/post';
import styled from 'styled-components';

interface MatchPostFormSectionProps {
  formData: PostFormData;
  onInputChange: (field: string, value: string) => void;
}

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
              <option value="any">실력 무관</option>
              <option value="similar">비슷한 실력</option>
              <option value="higher">더 높은 실력</option>
              <option value="lower">더 낮은 실력</option>
            </Select>
          </FormGroup>
        </TimeLocationRow>

        <FormGroup>
          <FieldDescription>
            <FieldLabel htmlFor="participantCount">참가 인원</FieldLabel>
            <FieldHelp>매칭에 참가할 총 인원 수를 설정하세요</FieldHelp>
          </FieldDescription>
          <Select
            id="participantCount"
            value={formData.participantCount}
            onChange={e => onInputChange('participantCount', e.target.value)}
          >
            <option value="">인원 수 선택</option>
            <option value="2">1:1 (2명)</option>
            <option value="4">2:2 (4명)</option>
            <option value="6">3:3 (6명)</option>
            <option value="8">4:4 (8명)</option>
            <option value="custom">직접 입력</option>
          </Select>
        </FormGroup>

        {formData.participantCount === 'custom' && (
          <FormGroup>
            <FieldDescription>
              <FieldLabel htmlFor="customParticipantCount">
                직접 입력
              </FieldLabel>
              <FieldHelp>원하는 참가 인원 수를 직접 입력하세요</FieldHelp>
            </FieldDescription>
            <Input
              id="customParticipantCount"
              type="number"
              value={formData.customParticipantCount || ''}
              onChange={e =>
                onInputChange('customParticipantCount', e.target.value)
              }
              placeholder="예: 10"
              min="2"
              max="20"
            />
          </FormGroup>
        )}

        <FormGroup>
          <FieldDescription>
            <FieldLabel htmlFor="matchDate">매치 날짜</FieldLabel>
            <FieldHelp>희망하는 매치 날짜를 선택하세요 (선택사항)</FieldHelp>
          </FieldDescription>
          <Input
            id="matchDate"
            type="date"
            value={formData.matchDate || ''}
            onChange={e => onInputChange('matchDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]} // 오늘 이후 날짜만 선택 가능
          />
        </FormGroup>
      </MatchFields>
    </>
  );
}
