import { useState, useEffect } from 'react';
import { useMutation, useQueryClient  } from 'react-query';
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
import * as Yup from 'yup';
import { validationTexts } from '../utils/texts';
import { last } from 'lodash';
import { device } from '../styles';
import TextField from '../Components/fields/TextField';
import NumericTextField from '../Components/fields/NumericTextField';
import InfoContainer from '../Components/layouts/InfoContainer';
import { Form, Formik } from 'formik';
import { handleSuccessToast } from '../utils/functions';
import { useAppSelector } from '../state/hooks';
import PopUpWithTitles from '../Components/layouts/PopUpWithTitle';

const phoneRegExp = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/

export const declarationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required(validationTexts.requireText),
  lastName: Yup.string()
    .required(validationTexts.requireText),
  email: Yup.string()
    .required(validationTexts.requireText),
  phone: Yup.string().matches(phoneRegExp, validationTexts.phoneNumber)
    .required(validationTexts.requireText),
});

const SubmitDeclaration = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUser = useAppSelector((state) => state.user.userData);
  const [showPopup, setShowPopup] = useState(false);

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

  const { mutateAsync: updateDeclarationMutation, isLoading: updateLoading } = useMutation(
    (values: any) => api.updateDeclaration(id, values),
    {
      onError: () => {},
      onSuccess: async () => {
        handleSuccessToast('Deklaracija sėkmingai pateikta');
        await queryClient.invalidateQueries(['declaration', id]);
      },
      retry: false,
    },
  );


  useEffect(() => {
    if (isLoading) return;

    if (!isAllApproved) {
      navigate(slugs.discrepancies(businessPlaceId, id));
    }
  }, [isLoading]);

  if (isLoading) return <FullscreenLoader />;

  const handleSubmit = async (values: typeof formValues) => {
    const params = {
      KontaktaiVardas: values.firstName,
      KontaktaiPavarde: values.lastName,
      KontaktaiEmail: values.email,
      KontaktaiPhone: values.phone,
    };
    await updateDeclarationMutation(params);
    await submitDeclaration();
    setShowPopup(false);
  };

  const formValues = {
    firstName: currentUser.firstName || '',
    lastName: currentUser.lastName || '',
    email: currentUser.email || '',
    phone: currentUser.phone as string || '',
  };

  return (
    <PageContainer>
      <Formik
        enableReinitialize={true}
        initialValues={formValues}
        onSubmit={handleSubmit}
        validationSchema={declarationSchema}
        validateOnChange={true}
      >
        {({ values, errors, setFieldValue }) => {
          return (
            <FormContainer>
              <TitleContainer>
                <div>
                  <Title>{'Patvirtinti deklaraciją'}</Title>
                  <InfoRow
                    info={['Pateikite užpildytą geriamo vandens stebėsenos duomenų deklaraciją']}
                  />
                </div>

                <ButtonContainer>
                  <ButtonRow>
                    <Button
                      disabled={updateLoading || submitLoading}
                      onClick={() => navigate(slugs.discrepancies(businessPlaceId, id))}
                      variant={ButtonColors.BACK}
                      type="button"
                    >
                      {'Grįžti atgal'}
                    </Button>
                    <Button
                      type="button"
                      disabled={Object.values(errors).some((error) => error)}
                      onClick={() => setShowPopup(true)}
                    >
                      {'Pateikti deklaraciją'}
                    </Button>
                  </ButtonRow>
                </ButtonContainer>
              </TitleContainer>

              <Notification
                description={
                  'Paspaudus mygtuką “Pateikti deklaraciją”, nebebus galima atlikti jokių papildomų pakeitimų ataskaitos turiniui.'
                }
              />
              <InfoContainer
                title={'Kontaktinis asmuo'}
                description={
                  'Prašome pateikti kontaktinius duomenis asmens, kuris galėtų teikti informaciją dėl pateiktos deklaracijos.'
                }
              >
                <Column>
                  <InnerContainerLine>
                    <FormLine>
                      <StyledTextField
                        label={'Vardas'}
                        value={values.firstName}
                        error={errors.firstName}
                        name="firstName"
                        onChange={(el) => setFieldValue('firstName', el)}
                        showError={true}
                      />
                      <StyledTextField
                        label={'Pavardė'}
                        value={values.lastName}
                        error={errors.lastName}
                        name="lastName"
                        onChange={(el) => setFieldValue('lastName', el)}
                        showError={true}
                      />
                    </FormLine>
                    <FormLine>
                      <StyledTextField
                        label={'Telefono numeris'}
                        value={values.phone}
                        error={errors.phone}
                        name="phone"
                        onChange={(el) => setFieldValue('phone', el)}
                        showError={true}
                      />
                      <StyledTextField
                        label={'El. pašto adresas'}
                        value={values.email}
                        error={errors.email}
                        name="email"
                        onChange={(el) => setFieldValue('email', el)}
                        showError={true}
                      />
                    </FormLine>
                  </InnerContainerLine>
                </Column>
              </InfoContainer>

              <PopUpWithTitles
                title={'Ar tikrai norite pateikti deklaraciją?'}
                visible={showPopup}
                onClose={() => setShowPopup(false)}
              >
                <ConfirmDeclarationContainer>
                  <p>
                    Paspaudus mygtuką “Pateikti deklaraciją”, nebebus galima atlikti jokių papildomų
                    pakeitimų ataskaitos turiniui.
                  </p>
                  <Button
                    type="submit"
                    loading={updateLoading || submitLoading}
                    disabled={updateLoading || submitLoading}
                  >
                    {'Pateikti deklaraciją'}
                  </Button>
                </ConfirmDeclarationContainer>
              </PopUpWithTitles>
            </FormContainer>
          );
        }}
      </Formik>
    </PageContainer>
  );
};

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const ConfirmDeclarationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 16px;
`;

const StyledTextField = styled(TextField)`
  min-width: 150px;
  flex: 1;
  padding-bottom: 32px;
  @media ${device.mobileL} {
    width: 100%;
  }
  ${({ error }) => error && `
    padding-bottom: 0px;
  `}
`;
const StyledNumericTextField = styled(NumericTextField)`
  min-width: 150px;
  flex: 1;
  @media ${device.mobileL} {
    width: 100%;
  }
`;

const FormLine = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
  max-width: 616px;
  width: 100%;
  @media ${device.mobileL} {
    flex-direction: column;
    max-width: 100%;
    width: 100%;
  }
`;

const InnerContainerLine = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
  align-items: flex-end;
  @media ${device.mobileL} {
    width: 100%;
  }
`;

const FormContainer = styled(Form)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export default SubmitDeclaration;
