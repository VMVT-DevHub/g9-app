import { useEffect } from 'react';
import { useMutation } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Button, { ButtonColors } from '../Components/buttons/Button';
import { PageContainer, Title } from '../Components/other/CommonStyles';
import FullscreenLoader from '../Components/other/FullscreenLoader';
import InfoRow from '../Components/other/InfoRow';
import Notification from '../Components/other/Notification';
import api from '../utils/api';
import { useMappedIndicatorsWithDiscrepancies } from '../utils/hooks';
import { slugs } from '../utils/routes';

const SubmitDeclaration = () => {
  const navigate = useNavigate();
  const { businessPlaceId = '', id = '' } = useParams();

  const { isLoading, isAllApproved } = useMappedIndicatorsWithDiscrepancies();

  const { mutateAsync: submitDeclaration, isLoading: submitLoading } = useMutation(
    () => api.submitDeclaration(id),
    {
      onSuccess: () => {
        navigate(slugs.businessPlaceDeclarations(businessPlaceId));
      },
    },
  );

  useEffect(() => {
    if (isLoading) return;

    if (!isAllApproved) {
      navigate(slugs.discrepancies(businessPlaceId, id));
    }
  }, [isLoading]);

  if (isLoading) return <FullscreenLoader />;

  return (
    <PageContainer>
      <div>
        <Title>{'Patvirtinti deklaracija'}</Title>

        <InfoRow info={['Pateikite užpildytą geriamo vandens stebėsenos duomenų deklaraciją']} />
      </div>

      <Notification
        description={
          'Paspaudus mygtuką “Pateikti deklaraciją”, nebebus galima atlikti jokių papildomų pakeitimų ataskaitos turiniui.'
        }
      />

      <ButtonContainer>
        <ButtonRow>
          <Button
            disabled={submitLoading}
            onClick={() => navigate(slugs.discrepancies(businessPlaceId, id))}
            variant={ButtonColors.BACK}
            type="button"
          >
            {'Grįžti atgal'}
          </Button>
          <Button
            loading={submitLoading}
            disabled={submitLoading}
            onClick={() => submitDeclaration()}
            type="button"
          >
            {'Pateikti deklaraciją'}
          </Button>
        </ButtonRow>
      </ButtonContainer>
    </PageContainer>
  );
};

const ButtonContainer = styled.div`
  display: flex;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
`;

export default SubmitDeclaration;
