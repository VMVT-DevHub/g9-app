import styled from 'styled-components';
import { IndicatorOptionWithDiscrepancies } from '../../types';
import Button, { ButtonColors } from '../buttons/Button';
import InfoContainer from '../layouts/InfoContainer';
import { BlueText, SuccessText } from '../other/CommonStyles';
import Table from '../Table/Table';

const labels = {
  date: 'Data',
  value: 'Reikšmė',
  approve: '',
};

const RepeatContainer = ({
  repeats,
  unit,
  onUpdate,
  onUpdateAll,
}: {
  repeats: IndicatorOptionWithDiscrepancies['data']['repeats'];
  unit: string;
  onUpdate: (id: string) => void;
  onUpdateAll: () => void;
}) => {
  const mapValues =
    repeats?.map((item) => {
      return {
        ...item,
        value: `${item.value} ${unit}`,
        approve: item.approved ? (
          <SuccessText>Patvirtinta</SuccessText>
        ) : (
          <BlueText onClick={() => onUpdate(item.id)}>Patvirtinti</BlueText>
        ),
      };
    }) || [];
  return (
    <InfoContainer
      title={'Tyrimų datos sutampa'}
      description={
        'Ištrinkite iš reikšmių lentelės perteklinius duomenis arba patvirtinkite, kad duomenys suvesti teisingai.'
      }
    >
      <Column>
        <div>
          <Button height={40} variant={ButtonColors.ALL} onClick={() => onUpdateAll()}>
            Patvirtinti visus
          </Button>
        </div>
        <StyledTable tableData={mapValues} labels={labels} />
      </Column>
    </InfoContainer>
  );
};

const StyledTable = styled(Table)`
  width: 550px;
`;

const Column = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
`;

export default RepeatContainer;
