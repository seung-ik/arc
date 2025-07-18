import styled from 'styled-components';

const Section = styled.div`
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
`;

const Count = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const Badge = styled.div`
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

const MyApp = styled.div`
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  margin-top: 15px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const Title = styled.h4`
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

const DateText = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
`;

const Comment = styled.div`
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid #667eea;
`;

export default function MentorApplicationStatus({
  total,
  label,
  myApplication,
  statusText = { pending: '대기중', approved: '승인됨', rejected: '거절됨' },
}: {
  total: number;
  label: string;
  myApplication: { status: string; comment: string; date: string } | null;
  statusText?: Record<string, string>;
}) {
  return (
    <Section>
      <Count>
        <Badge>{total}</Badge>
        <CountText>{label}</CountText>
      </Count>
      {myApplication && (
        <MyApp>
          <Header>
            <Title>내 신청 현황</Title>
            <StatusBadge status={myApplication.status}>
              {statusText[myApplication.status] || myApplication.status}
            </StatusBadge>
          </Header>
          <DateText>신청일: {myApplication.date}</DateText>
          <Comment>{myApplication.comment}</Comment>
        </MyApp>
      )}
    </Section>
  );
}
