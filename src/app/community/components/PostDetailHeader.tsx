'use client';

import { ICONS } from '@/assets';
import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.background};
  border-bottom: 5px solid ${props => props.theme.colors.borderLight};
  height: 56px;
`;

const ImgWrapper = styled.button`
  border-radius: 50%;
  padding: ${props => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.colors.backgroundGray};
  }
`;

interface PostDetailHeaderProps {
  onBackClick: () => void;
}

const PostDetailHeader: React.FC<PostDetailHeaderProps> = ({ onBackClick }) => {
  return (
    <HeaderContainer>
      <ImgWrapper>
        <Image src={ICONS.ARROW_LEFT} alt="뒤로가기" onClick={onBackClick} />
      </ImgWrapper>
      <ImgWrapper>
        <Image src={ICONS.HAMBURGER} alt="메뉴" />
      </ImgWrapper>
    </HeaderContainer>
  );
};

export default PostDetailHeader;
