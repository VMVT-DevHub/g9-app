import styled from 'styled-components';

export const CubicMeter = () => (
  <Container>
    <MeasurementUnit>
      m<Sup>3</Sup>
    </MeasurementUnit>
  </Container>
);

const MeasurementUnit = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-right: 13px;
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Sup = styled.sup``;
