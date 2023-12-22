import styled from 'styled-components';
import { IndicatorOption } from '../../types';
import Button from '../buttons/Button';
import PopUpWithTitles from '../layouts/PopUpWithTitle';

const InfoPopUp = ({
  showPopup,
  setShowPopup,
  indicator,
}: {
  setShowPopup: any;
  showPopup: any;
  indicator: IndicatorOption;
}) => {
  const data = [
    {
      label: 'Min. reikšmė',
      value: indicator.min,
    },
    {
      label: 'Maks. reikšmė',
      value: indicator.max,
    },
    {
      label: 'Žingsnis',
      value: indicator.step,
    },
    {
      label: 'Vienetai',
      value: indicator.unit,
    },
    {
      label: 'Kodas',
      value: indicator.code,
    },
  ];

  return (
    <PopUpWithTitles
      title={'Rodiklio pavadinimas'}
      visible={showPopup}
      onClose={() => setShowPopup(false)}
    >
      <Container>
        {data.map((item) => (
          <Column>
            <Label>{item.label}</Label>
            <Value>{typeof item.value !== 'undefined' ? item.value : '-'}</Value>
          </Column>
        ))}
      </Container>
      <Column>
        <Label>{'Aprašymas'}</Label>
        <Value>{indicator.description || '-'}</Value>
      </Column>
      <ButtonRow>
        <div>
          <Button height={40} onClick={() => setShowPopup(false)}>
            Uždaryti
          </Button>
        </div>
      </ButtonRow>
    </PopUpWithTitles>
  );
};

const Label = styled.div`
  font-size: 1.2rem;
  color: #6b7280;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
`;

const Value = styled.div`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex-basis: 33.333333%;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  row-gap: 20px;
  height: 100%;
  width: 100%;
  margin-bottom: 32px;
`;

export default InfoPopUp;
