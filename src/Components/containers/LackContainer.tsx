import { useState } from 'react';
import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { IndicatorOptionWithDiscrepancies } from '../../types';
import api from '../../utils/api';
import { useSuccess } from '../../utils/hooks';
import { validationTexts } from '../../utils/texts';
import Button from '../buttons/Button';
import TextAreaField from '../fields/TextAreaField';
import InfoContainer from '../layouts/InfoContainer';

const mapPayload = (lack: IndicatorOptionWithDiscrepancies['data']['lack']) => {
  return {
    ID: lack?.id,
    KitasDaznumas: true,
    Patvirtinta: true,
    Pastabos: lack?.notes,
  };
};

const LackContainer = ({ lack }: { lack: IndicatorOptionWithDiscrepancies['data']['lack'] }) => {
  const [notes, setNotes] = useState(lack?.notes || '');
  const [error, setError] = useState('');
  const { handleSuccess } = useSuccess();
  const { id = '' } = useParams();
  const { mutateAsync: updateRepeat, isLoading } = useMutation(
    (values: any) => api.updateDiscrepancies(id, values),
    {
      onSuccess: () => {
        handleSuccess();
      },
    },
  );

  const handleUpdateRepeat = async () => {
    if (!lack) return;

    if (notes.length < 5) {
      return setError(validationTexts.shortDescription);
    }

    await updateRepeat({ Trukumas: [mapPayload({ ...lack, notes })] });
  };

  return (
    <InfoContainer
      title={'Trūksta duomenų'}
      description={
        'Pagal planą reikia įvesti 15 tyrimų. Įveskite trūkstamus mėginius arba nurodykite pastabas'
      }
    >
      <Column>
        <StyledTextAreaField
          error={error}
          disabled={isLoading}
          value={notes}
          onChange={(val) => {
            setError('');
            setNotes(val);
          }}
        />
        <div>
          <Button disabled={isLoading} loading={isLoading} onClick={handleUpdateRepeat}>
            Patvirtinti
          </Button>
        </div>
      </Column>
    </InfoContainer>
  );
};

const StyledTextAreaField = styled(TextAreaField)`
  width: 100%;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  align-items: flex-end;
`;

export default LackContainer;
