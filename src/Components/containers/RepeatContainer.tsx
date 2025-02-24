import { useState } from 'react';
import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { IndicatorOptionWithDiscrepancies } from '../../types';
import api from '../../utils/api';
import { useSuccess } from '../../utils/hooks';
import Button, { ButtonColors } from '../buttons/Button';
import InfoContainer from '../layouts/InfoContainer';
import { BlueText, SuccessText, TableActionContainer } from '../other/CommonStyles';
import Loader from '../other/Loader';
import Table from '../Table/Table';

const labels = {
  date: 'Data',
  value: 'Reikšmė',
  approve: '',
};

const mapPayload = (item) => {
  return { ID: item.id, Patvirtinta: true, Pastabos: '' };
};

const RepeatContainer = ({
  repeats,
  unit,
  isDeclared,
}: {
  repeats: IndicatorOptionWithDiscrepancies['data']['repeats'];
  unit: string;
  isDeclared: IndicatorOptionWithDiscrepancies['isDeclared'];
}) => {
  const { id = '' } = useParams();
  const { handleSuccess } = useSuccess();

  const [rowLoadingId, setRowLoadingId] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const { mutateAsync: updateRepeat } = useMutation(
    (values: any) => api.updateDiscrepancies(id, values),
    {},
  );

  const handleUpdateRepeat = async (values) => {
    setRowLoadingId(values.id);
    setDisabled(true);
    await updateRepeat({ Kartojasi: [mapPayload(values)] });
    setDisabled(false);
    setRowLoadingId('');
    handleSuccess();
  };

  const handleUpdateAllRepeat = async () => {
    setDisabled(true);
    setButtonLoading(true);
    await Promise.all(
      repeats.map(async (item) => {
        await updateRepeat({ Kartojasi: [mapPayload(item)] });
      }),
    );
    handleSuccess();
    setDisabled(false);
    setButtonLoading(false);
  };

  const handleRenderApprove = (item) => {
    if (rowLoadingId == item.id) {
      return (
        <LoaderComponent>
          <Loader size={20} />;
        </LoaderComponent>
      );
    }

    if (item.approved) {
      return <SuccessText>Patvirtinta</SuccessText>;
    }

    return (
      <BlueText disabled={disabled} onClick={() => !disabled && handleUpdateRepeat(item)}>
        Patvirtinti
      </BlueText>
    );
  };

  const mapValues =
    repeats
      ?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map((item) => {
        return {
          ...item,
          value: `${item.value} ${unit}`,
          approve: <TableActionContainer>{handleRenderApprove(item)}</TableActionContainer>,
        };
      }) || [];

  const isAllApproved = repeats.filter((item) => item.approved).length === repeats.length;
  return (
    <InfoContainer
      title={'Tyrimų datos sutampa'}
      description={
        !isDeclared
          ? 'Ištrinkite iš reikšmių lentelės perteklinius duomenis arba patvirtinkite, kad duomenys suvesti teisingai.'
          : 'Pakartotinai suvesti duomenys buvo patvirtinti.'
      }
    >
      <Column>
        {!isAllApproved && (
          <ButtonContainer>
            <div>
              <Button
                loading={buttonLoading}
                disabled={disabled || buttonLoading}
                height={40}
                variant={ButtonColors.ALL}
                onClick={() => handleUpdateAllRepeat()}
              >
                Patvirtinti visus
              </Button>
            </div>
          </ButtonContainer>
        )}
        <TableContainer>
          <StyledTable tableData={mapValues} labels={labels} />
        </TableContainer>
      </Column>
    </InfoContainer>
  );
};

const StyledTable = styled(Table)`
  max-width: 550px;
`;

const LoaderComponent = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  overflow-x: auto;
`;

const TableContainer = styled.div`
  min-width: 0;
  overflow-x: auto;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default RepeatContainer;
