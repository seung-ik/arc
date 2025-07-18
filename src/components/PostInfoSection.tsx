import styled from 'styled-components';

const Section = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  border: 1px solid #e9ecef;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.span`
  font-size: 12px;
  color: #666;
  font-weight: 500;
`;

const Value = styled.span<{ highlight?: boolean }>`
  font-size: 14px;
  color: ${({ highlight }) => (highlight ? '#667eea' : '#333')};
  font-weight: 600;
`;

export default function PostInfoSection({
  items,
}: {
  items: { label: string; value?: React.ReactNode; highlight?: boolean }[];
}) {
  return (
    <Section>
      <Grid>
        {items
          .filter(item => item.value !== undefined && item.value !== '')
          .map((item, idx) => (
            <Item key={idx}>
              <Label>{item.label}</Label>
              <Value highlight={item.highlight}>{item.value}</Value>
            </Item>
          ))}
      </Grid>
    </Section>
  );
}
