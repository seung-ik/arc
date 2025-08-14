'use client';

import styled from 'styled-components';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ROUTES } from '@/constants/routes';

import ProfileChip from '@/components/ProfileChip';

const TabContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.theme.colors.background};
  width: 100%;
  margin-bottom: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.xs};
  position: relative;
  z-index: 10;
`;

const TabButton = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSizes['xl']};
  font-weight: ${props =>
    props.$active
      ? props.theme.typography.fontWeights.bold
      : props.theme.typography.fontWeights.medium};
  color: ${props =>
    props.$active ? props.theme.colors.textBlack : props.theme.colors.textGray};
  transition: color 0.2s;
  outline: none;

  &:hover {
    color: ${props => props.theme.colors.textBlack};
  }
`;

const TabDivider = styled.div`
  width: 3px;
  height: 20px;
  background-color: #e5e7eb;
  margin: 0 2px;
  border-radius: 8px;
`;

export default function EloTabCards() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = [
    {
      key: 'management',
      label: '매치관리',
      href: ROUTES.elo.management,
      active: mounted && pathname === ROUTES.elo.management,
    },
    {
      key: 'history',
      label: '매치기록',
      href: ROUTES.elo.history,
      active: mounted && pathname === ROUTES.elo.history,
    },
  ];

  return (
    <TabContainer suppressHydrationWarning>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {tabs.map((tab, index) => (
          <div key={tab.key} style={{ display: 'flex', alignItems: 'center' }}>
            <Link href={tab.href} style={{ textDecoration: 'none' }}>
              <TabButton $active={tab.active} type="button">
                {tab.label}
              </TabButton>
            </Link>
            {index < tabs.length - 1 && <TabDivider />}
          </div>
        ))}
      </div>
      <div>
        <ProfileChip />
        {/* <Image src={ICONS.BELL} alt="bell" width={24} height={24} /> */}
        {/* <div
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'green',
            borderRadius: '50%',
            color: 'white',
            border: '2px solid silver',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          승
        </div> */}
      </div>
    </TabContainer>
  );
}
