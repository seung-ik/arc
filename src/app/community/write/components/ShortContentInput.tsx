import React from 'react';
import styled from 'styled-components';

interface ShortContentInputProps {
  value: string;
  onChange: (value: string) => void;
  postType: string;
  maxLength?: number;
}

const ShortTextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textGray};
  }
`;

const CharCount = styled.div`
  text-align: right;
  font-size: 12px;
  color: ${props => props.theme.colors.textGray};
  margin-top: 4px;
`;

export default function ShortContentInput({
  value,
  onChange,
  postType,
  maxLength = 80,
}: ShortContentInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  const getPlaceholder = () => {
    switch (postType) {
      case '매치':
        return '매칭 요청 내용을 간단히 입력하세요 (80자 이내)';
      case '멘토':
        return '멘토링 요청 내용을 간단히 입력하세요 (80자 이내)';
      default:
        return '내용을 입력하세요';
    }
  };

  return (
    <>
      <ShortTextArea
        id="content"
        value={value}
        onChange={handleChange}
        placeholder={getPlaceholder()}
        maxLength={maxLength}
        required
      />
      <CharCount>
        {value.length}/{maxLength}
      </CharCount>
    </>
  );
}
