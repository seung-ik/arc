'use client';

import styled from 'styled-components';
import { useState } from 'react';

const SearchContainer = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInputStyled = styled.input`
  width: 100%;
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
  padding-left: 40px;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.textBlack};
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.textGray};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${(props) => props.theme.spacing.sm};
  color: ${(props) => props.theme.colors.textGray};
  font-size: 16px;
`;

const ClearButton = styled.button`
  position: absolute;
  right: ${(props) => props.theme.spacing.sm};
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.textGray};
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.colors.backgroundGray};
  }
`;

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchInput({
  onSearch,
  placeholder = '게시글 검색...',
}: SearchInputProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <SearchContainer>
      <SearchInputWrapper>
        <SearchIcon>🔍</SearchIcon>
        <SearchInputStyled
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
        />
        {searchQuery && (
          <ClearButton onClick={handleClear} type="button">
            ✕
          </ClearButton>
        )}
      </SearchInputWrapper>
    </SearchContainer>
  );
}
