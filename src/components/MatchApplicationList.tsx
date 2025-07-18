'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';

interface MatchApplication {
  id: number;
  userId: string;
  userName: string;
  userElo: number;
  message: string;
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface MatchApplicationListProps {
  applications: MatchApplication[];
  onApprove: (applicationId: number) => void;
  onReject: (applicationId: number) => void;
}

const ApplicationsSection = styled.div`
  margin: ${(props) => props.theme.spacing.lg} 0;
  padding: ${(props) => props.theme.spacing.md};
  background-color: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
`;

const ApplicationsHeader = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  font-weight: ${(props) => props.theme.typography.fontWeights.bold};
  color: ${(props) => props.theme.colors.textBlack};
  margin: 0 0 ${(props) => props.theme.spacing.md} 0;
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
`;

const ApplicationCount = styled.span`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
`;

const ApplicationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
`;

const ApplicationItem = styled.div<{ $status: 'pending' | 'approved' | 'rejected' }>`
  padding: ${(props) => props.theme.spacing.md};
  border: 1px solid
    ${(props) => {
      switch (props.$status) {
        case 'approved':
          return '#28a745';
        case 'rejected':
          return '#dc3545';
        default:
          return props.theme.colors.border;
      }
    }};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background-color: ${(props) => {
    switch (props.$status) {
      case 'approved':
        return '#f8fff9';
      case 'rejected':
        return '#fff8f8';
      default:
        return props.theme.colors.background;
    }
  }};
`;

const ApplicationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const ApplicationUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
`;

const ApplicationUserName = styled.span`
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.textBlack};
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const ApplicationElo = styled.span`
  background-color: ${(props) => props.theme.colors.secondary};
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
`;

const ApplicationDate = styled.span`
  color: ${(props) => props.theme.colors.textGray};
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
`;

const ApplicationStatus = styled.span<{ $status: 'pending' | 'approved' | 'rejected' }>`
  padding: 2px 8px;
  border-radius: 8px;
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  background-color: ${(props) => {
    switch (props.$status) {
      case 'approved':
        return '#28a745';
      case 'rejected':
        return '#dc3545';
      default:
        return props.theme.colors.primary;
    }
  }};
  color: white;
`;

const ApplicationMessage = styled.p`
  color: ${(props) => props.theme.colors.textGray};
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
  margin: ${(props) => props.theme.spacing.sm} 0;
  line-height: 1.5;
`;

const ApplicationActions = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
  margin-top: ${(props) => props.theme.spacing.sm};
`;

const ApplicationButton = styled.button<{ $variant: 'approve' | 'reject' }>`
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s;

  background-color: ${(props) => (props.$variant === 'approve' ? '#28a745' : '#dc3545')};
  color: white;

  &:hover {
    background-color: ${(props) => (props.$variant === 'approve' ? '#218838' : '#c82333')};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const NoApplications = styled.div`
  text-align: center;
  padding: ${(props) => props.theme.spacing.lg};
  color: ${(props) => props.theme.colors.textGray};
  font-size: ${(props) => props.theme.typography.fontSizes.base};
`;

export default function MatchApplicationList({
  applications,
  onApprove,
  onReject,
}: MatchApplicationListProps) {
  const router = useRouter();

  const handleApplicationUserClick = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  const getStatusText = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'pending':
        return '대기중';
      case 'approved':
        return '승인됨';
      case 'rejected':
        return '거절됨';
    }
  };

  return (
    <ApplicationsSection>
      <ApplicationsHeader>
        매치 참가 신청
        <ApplicationCount>{applications.length}</ApplicationCount>
      </ApplicationsHeader>

      {applications.length > 0 ? (
        <ApplicationList>
          {applications.map((application) => (
            <ApplicationItem key={application.id} $status={application.status}>
              <ApplicationHeader>
                <ApplicationUserInfo>
                  <ApplicationUserName
                    onClick={() => handleApplicationUserClick(application.userId)}
                  >
                    {application.userName}
                  </ApplicationUserName>
                  <ApplicationElo>ELO {application.userElo}</ApplicationElo>
                  <ApplicationDate>{application.appliedAt}</ApplicationDate>
                </ApplicationUserInfo>
                <ApplicationStatus $status={application.status}>
                  {getStatusText(application.status)}
                </ApplicationStatus>
              </ApplicationHeader>

              <ApplicationMessage>{application.message}</ApplicationMessage>

              {application.status === 'pending' && (
                <ApplicationActions>
                  <ApplicationButton $variant="approve" onClick={() => onApprove(application.id)}>
                    승인
                  </ApplicationButton>
                  <ApplicationButton $variant="reject" onClick={() => onReject(application.id)}>
                    거절
                  </ApplicationButton>
                </ApplicationActions>
              )}
            </ApplicationItem>
          ))}
        </ApplicationList>
      ) : (
        <NoApplications>아직 참가 신청이 없습니다.</NoApplications>
      )}
    </ApplicationsSection>
  );
}
