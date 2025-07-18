'use client';

import styled from 'styled-components';

interface ApplicationStatus {
  status: 'pending' | 'approved' | 'rejected';
  comment: string;
  date: string;
}

interface MatchApplicationStatusProps {
  totalApplications: number;
  myApplication: ApplicationStatus | null;
}

const ApplicationSection = styled.div`
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
`;

const ApplicationCount = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const CountBadge = styled.div`
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

const CountText = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const MyApplication = styled.div`
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  margin-top: 15px;
`;

const ApplicationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const ApplicationTitle = styled.h4`
  margin: 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    switch (props.status) {
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
  color: ${props => {
    switch (props.status) {
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
`;

export default function MatchApplicationStatus({
  totalApplications,
  myApplication,
}: MatchApplicationStatusProps) {
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

  return (
    <ApplicationSection>
      <ApplicationCount>
        <CountBadge>{totalApplications}</CountBadge>
        <CountText>참가 신청</CountText>
      </ApplicationCount>

      {myApplication && (
        <MyApplication>
          <ApplicationHeader>
            <ApplicationTitle>내 신청 현황</ApplicationTitle>
            <StatusBadge status={myApplication.status}>
              {getStatusText(myApplication.status)}
            </StatusBadge>
          </ApplicationHeader>
          <ApplicationDate>신청일: {myApplication.date}</ApplicationDate>
          <ApplicationComment>{myApplication.comment}</ApplicationComment>
        </MyApplication>
      )}
    </ApplicationSection>
  );
}
