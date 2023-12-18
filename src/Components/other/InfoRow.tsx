import styled from 'styled-components';
import { device } from '../../styles';

const InfoRow = ({ info }: { info: string[] }) => (
  <Row>
    {info
      ?.filter((text: string) => text)
      .map((item: string, index: number) => {
        return (
          <InnerRow key={`info-${index}`}>
            <Label>{item}</Label> {index !== info.length - 1 && <Dot />}
          </InnerRow>
        );
      })}
  </Row>
);
const InnerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  @media ${device.mobileL} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Dot = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  @media ${device.mobileL} {
    flex-direction: column;
    margin-top: 12px;
    align-items: flex-start;
  }
`;

const Label = styled.div`
  font-size: 1.6rem;
  line-height: 20px;
  color: #697586;
  opacity: 1;
`;

export default InfoRow;
