import styled from 'styled-components';

const ContentWrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: ${(props) => props.theme.spacing.md};

  @media (min-width: 1200px) {
    min-width: 1100px;
    max-width: 1100px;
  }
`;

interface CommunityLayoutProps {
  children: React.ReactNode;
}

export default function CommunityLayout({ children }: CommunityLayoutProps) {
  return <ContentWrapper>{children}</ContentWrapper>;
}
