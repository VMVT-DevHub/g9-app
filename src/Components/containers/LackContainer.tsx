import { useState } from 'react';
import styled from 'styled-components';
import { IndicatorOptionWithDiscrepancies } from '../../types';
import Button from '../buttons/Button';
import TextAreaField from '../fields/TextAreaField';
import InfoContainer from '../layouts/InfoContainer';

const LackContainer = ({
  lack,
  onUpdate,
}: {
  lack: IndicatorOptionWithDiscrepancies['data']['lack'];
  onUpdate: (value: string) => void;
}) => {
  const [note, setNote] = useState(lack?.notes || '');
  return (
    <InfoContainer
      title={'Trūksta duomenų'}
      description={
        'Pagal planą reikia įvesti 15 tyrimų. Įveskite trūkstamus mėginius arba nurodykite pastabas'
      }
    >
      <Column>
        <StyledTextAreaField
          disabled={!!lack?.notes}
          value={note}
          onChange={(val) => setNote(val)}
        />
        {!lack?.notes && (
          <div>
            <Button onClick={() => onUpdate(note)}>Patvirtinti</Button>
          </div>
        )}
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
