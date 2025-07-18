'use client';

import styled from 'styled-components';

interface MentorApplication {
  id: number;
  mentorId: string;
  mentorName: string;
  mentorElo: number;
  status: 'pending' | 'approved' | 'rejected';
  comment: string;
  date: string;
}

interface MentorApplicationListProps {
  applications: MentorApplication[];
  onApprove: (applicationId: number) => void;
  onReject: (applicationId: number) => void;
  onPayment: (applicationId: number) => void;
}

const ApplicationsSection = styled.div`
  margin-top: 30px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e9ecef;
`;

const ApplicationsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const ApplicationsCount = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
`;

const ApplicationsTitle = styled.h3`
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
`;

const ApplicationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ApplicationCard = styled.div<{ $status: string }>`
  border: 2px solid
    ${(props) => {
      switch (props.$status) {
        case 'pending':
          return '#e3f2fd';
        case 'approved':
          return '#e8f5e8';
        case 'rejected':
          return '#ffebee';
        default:
          return '#e9ecef';
      }
    }};
  border-radius: 8px;
  padding: 16px;
  background: white;
`;

const ApplicationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const MentorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MentorName = styled.span`
  font-weight: 600;
  color: #333;
  font-size: 16px;
`;

const MentorElo = styled.span`
  background: #f8f9fa;
  color: #666;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${(props) => {
    switch (props.$status) {
      case 'pending':
        return '#e3f2fd';
      case 'approved':
        return '#e8f5e8';
      case 'rejected':
        return '#ffebee';
      default:
        return '#f5f5f5';
    }
  }};
  color: ${(props) => {
    switch (props.$status) {
      case 'pending':
        return '#1976d2';
      case 'approved':
        return '#2e7d32';
      case 'rejected':
        return '#d32f2f';
      default:
        return '#666';
    }
  }};
`;

const ApplicationDate = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
`;

const ApplicationComment = styled.div`
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid #667eea;
  margin-bottom: 12px;
`;

const ApplicationActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button<{ $variant: 'approve' | 'reject' | 'pay' }>`
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${(props) => {
    if (props.$variant === 'approve') {
      return `
        background: #28a745;
        color: white;
        &:hover { background: #218838; }
      `;
    } else if (props.$variant === 'reject') {
      return `
        background: #dc3545;
        color: white;
        &:hover { background: #c82333; }
      `;
    } else {
      return `
        background: #007bff;
        color: white;
        &:hover { background: #0056b3; }
      `;
    }
  }}
`;

export default function MentorApplicationList({
  applications,
  onApprove,
  onReject,
  onPayment,
}: MentorApplicationListProps) {
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '대기중';
      case 'approved':
        return '승인됨';
      case 'rejected':
        return '거절됨';
      default:
        return '알 수 없음';
    }
  };

  const pendingApplications = applications.filter((app) => app.status === 'pending');

  return (
    <ApplicationsSection>
      <ApplicationsHeader>
        <ApplicationsCount>2</ApplicationsCount>
        <ApplicationsTitle>멘토 신청</ApplicationsTitle>
      </ApplicationsHeader>

      <ApplicationList>
        {applications.map((application) => (
          <ApplicationCard key={application.id} $status={application.status}>
            <ApplicationHeader>
              <MentorInfo>
                <MentorName>{application.mentorName}</MentorName>
                <MentorElo>ELO {application.mentorElo}</MentorElo>
              </MentorInfo>
              <StatusBadge $status={application.status}>
                {getStatusText(application.status)}
              </StatusBadge>
            </ApplicationHeader>
            <ApplicationDate>신청일: {application.date}</ApplicationDate>
            <ApplicationComment>{application.comment}</ApplicationComment>
            {application.status === 'pending' && (
              <ApplicationActions>
                <ActionButton onClick={() => onApprove(application.id)} $variant="approve">
                  승인
                </ActionButton>
                <ActionButton onClick={() => onReject(application.id)} $variant="reject">
                  거절
                </ActionButton>
              </ApplicationActions>
            )}
            {application.status === 'approved' && (
              <ApplicationActions>
                <ActionButton onClick={() => onPayment(application.id)} $variant="pay">
                  지불하기
                </ActionButton>
              </ApplicationActions>
            )}
          </ApplicationCard>
        ))}
      </ApplicationList>
    </ApplicationsSection>
  );
}
