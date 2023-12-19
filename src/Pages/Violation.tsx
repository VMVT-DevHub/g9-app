import styled from 'styled-components';
import Button from '../Components/buttons/Button';
import { PageContainer, Title } from '../Components/other/CommonStyles';
import InfoRow from '../Components/other/InfoRow';
import { device } from '../styles';

const Violation = () => {
  return (
    <PageContainer>
      <TopRow>
        <div>
          <Title>{'Neatitikčių peržiūra ir patvirtinimas'}</Title>

          <InfoRow info={['Prašome pateikite pastabas prie rodiklių kurie viršija ribas.']} />
        </div>
        <FlexItem $flex={0.25}>
          <Button type="button">{'Deklaruoti'}</Button>
        </FlexItem>
      </TopRow>
    </PageContainer>
  );
};

const FlexItem = styled.div<{ $flex }>`
  flex: ${({ $flex }) => $flex};

  @media ${device.mobileL} {
    flex: 1;
  }
`;

export const IndicatorText = styled.div<{ $isActive: boolean }>`
  font-size: 1.4rem;
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.text.active : theme.colors.text.secondary};
  cursor: pointer;
  width: 200px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default Violation;
