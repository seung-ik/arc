'use client';

import styled from 'styled-components';
import Image from 'next/image';
import { ICONS } from '@/assets';

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textGray};
  text-align: center;
  gap: 16px;
  flex: 1;
`;

export default function NoData({ message }: { message: string }) {
  return (
    <EmptyState>
      <Image src={ICONS.NO_DATA} alt="no data" width={80} />
      <p>{message}</p>
    </EmptyState>
  );
}
