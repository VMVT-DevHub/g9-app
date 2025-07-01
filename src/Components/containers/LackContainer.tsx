import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { IndicatorOptionWithDiscrepancies } from '../../types';
import api from '../../utils/api';
import { useSuccess } from '../../utils/hooks';
import { validationTexts } from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
import TextAreaField from '../fields/TextAreaField';
import InfoContainer from '../layouts/InfoContainer';
import { device } from '../../styles';

const mapPayload = (lack: IndicatorOptionWithDiscrepancies['data']['lack']) => {
  return {
    ID: lack?.id,
    KitasDaznumas: true,
    Patvirtinta: true,
    Pastabos: lack?.notes,
  };
};

const mapPayloadDeleteEntry = (lack: IndicatorOptionWithDiscrepancies['data']['lack']) => {
  return {
    ID: lack?.id,
    KitasDaznumas: false,
    Patvirtinta: false,
    Pastabos: null,
  };
};

const LackContainer = ({
  lack,
  isDeclared,
}: {
  lack: IndicatorOptionWithDiscrepancies['data']['lack'];
  isDeclared: boolean;
}) => {
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

  useEffect(() => {
    setNotes(lack?.notes || '');
    setError('');
  }, [lack]);

  const handleUpdateRepeat = async () => {
    if (!lack) return;

    if (notes.length < 5) {
      return setError(validationTexts.shortDescription);
    }

    await updateRepeat({ Trukumas: [mapPayload({ ...lack, notes })] });
  };
  const handleDelete = async () => {
    if (!lack) return;
    setNotes('');

    await updateRepeat({ Trukumas: [mapPayloadDeleteEntry({ ...lack })] });
  };
  if (isDeclared) {
    return (
      <DisplayContainer>
        <p><b>Pastabos ir trūkstami tyrimai:</b></p>
        {notes}
      </DisplayContainer>
    );
  }
  return (
    <>
      <TitleContainer>
        <ContainerTitle>Neatitiktys</ContainerTitle>
        <Description>
          Pagal stebėsenos programą nepaimta pakankamai mėginių. Įveskite trūkstamus mėginius, arba pagrįskite, kodėl mėginys (-ai) nebuvo paimti. 
        </Description>
      </TitleContainer>
      <StyledTextAreaField
        error={error}
        disabled={isLoading}
        value={notes}
        onChange={(val) => {
          setError('');
          setNotes(val);
        }}
      />
      <ButtonContainer>
        {lack?.notes && (
          <Button
            variant={ButtonColors.BACK}
            disabled={isLoading}
            loading={isLoading}
            onClick={handleDelete}
          >
            Išvalyti
          </Button>
        )}
        <Button disabled={isLoading} loading={isLoading} onClick={handleUpdateRepeat}>
          Patvirtinti
        </Button>
      </ButtonContainer>
    </>
  );
};
const ContainerTitle = styled.div`
  font-weight: bold;
  line-height: 22px;
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Description = styled.div`
  font-size: 1.4rem;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.text.secondary};
  opacity: 1;
  @media ${device.mobileL} {
    margin: 16px 0;
  }
`;
const TitleContainer = styled.div`
  padding-top: 32px;
  
`;

const DisplayContainer = styled.div`
  margin-top: 0;
`
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-self: flex-end;

`;

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
