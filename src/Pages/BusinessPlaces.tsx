import { useNavigate } from 'react-router-dom';
import { BoldText, PageContainer, Title } from '../Components/other/CommonStyles';
import FullscreenLoader from '../Components/other/FullscreenLoader';
import Table from '../Components/Table/Table';
import { useBusinessPlaces, useJAContacts } from '../utils/hooks';
import { slugs } from '../utils/routes';
import styled from 'styled-components';
import { useAppSelector } from '../state/hooks';
import React from 'react';
import PopUpWithTitles from '../Components/layouts/PopUpWithTitle';
import Button from '../Components/buttons/Button';
import { Form, Formik } from 'formik';
import TextField from '../Components/fields/TextField';
import NumericTextField from '../Components/fields/NumericTextField';
import { handleSuccessToast } from '../utils/functions';
import { useMutation, useQueryClient } from 'react-query';
import api from '../utils/api';
import { device } from '../styles';
import { declarationSchema } from './SubmitDeclaration';

const labels = {
  fis: 'Kodas',
  name: 'Pavadinimas',
  code: 'Teritorijos kodas',
  address: 'Teritorija',
};

const BusinessPlaces = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAppSelector((state) => state.user?.userData);
  const [showPopup, setShowPopup] = React.useState(false);

  let id = user?.companyID;
  let hasRoles = user?.adminRoles.length > 0;

  const { data: contactsData, isLoading: contactsLoading } = id
    ? useJAContacts()
    : { data: null, isLoading: false };

  const { mutateAsync: updateJAContactsMutation, isLoading: updateLoading } = useMutation(
    (values: any) => api.updateJAContacts(values),
    {
      onError: () => {},
      onSuccess: async () => {
        handleSuccessToast();
        await queryClient.invalidateQueries(['jacontacts']);
        await queryClient.invalidateQueries(['businessPlaces']);
      },
      retry: false,
    },
  );

  const { data, JA_data, isLoading } = useBusinessPlaces();
  if (isLoading) return <FullscreenLoader />;

  const mappedData = data.map((item) => {
    return { ...item, fis: item.id, name: <BoldText>{item.name}</BoldText> };
  });

  const showEditContactsButton =
    id !== undefined && user?.companyID == JA_data[0].id ? true : false;

  const tablesJA = JA_data.map((JA) => {
    const hasContactInfo =
      JA && JA.contactName && JA.contactLastName && JA.contactPhone && JA.contactEmail;
    const contactInfo = hasContactInfo
      ? `${JA.contactName} ${JA.contactLastName}, ${JA.contactPhone}, ${JA.contactEmail}`
      : 'Kontaktinis asmuo nenurodytas';

    let mappedJAData = mappedData.filter((data) => data.ja == JA.id);
    return (
      <OuterTableContainer key={JA.id}>
        <TableDiv>
          <InfoTitle>{JA.name}</InfoTitle>
          <StyledTable
            onClick={(businessPlace) => navigate(slugs.businessPlaceDeclarations(businessPlace.id))}
            tableData={mappedJAData}
            labels={labels}
          />
        </TableDiv>
        <OuterContactContainer>
          <ContactContainer>
            <Label>
              Kontaktinis asmuo, įvykus cheminiam, biologiniam, radiologiniam ar branduoliniui
              incidentui:
            </Label>
            <Label>{contactInfo}</Label>
          </ContactContainer>
          {showEditContactsButton && (
            <AddIndicatorButton disabled={false} onClick={() => setShowPopup(true)}>
              Redaguoti kontaktus
            </AddIndicatorButton>
          )}
        </OuterContactContainer>
      </OuterTableContainer>
    );
  });

  const handleSubmit = async (values: typeof formValues) => {
    const params = {
      ID: id,
      KontaktaiVardas: values.firstName,
      KontaktaiPavarde: values.lastName,
      KontaktaiEmail: values.email,
      KontaktaiPhone: values.phone,
    };
    await updateJAContactsMutation(params);
    setShowPopup(false);
  };

  const formValues = {
    firstName: contactsData?.KontaktaiVardas || '',
    lastName: contactsData?.KontaktaiPavarde || '',
    email: contactsData?.KontaktaiEmail || '',
    phone: contactsData?.KontaktaiPhone || '',
  };
  return (
    <PageContainer>
      <Title>Geriamojo vandens tiekimo sistemos</Title>
      {!hasRoles && (
        <p>
          Jūs nesate priskirti jokiam Juridiniam Asmeniui. Susisiekite su savo administratoriumi.
        </p>
      )}
      {tablesJA}
      <PopUpWithTitles
        title={'Redaguoti kontaktinius duomenis'}
        visible={showPopup}
        onClose={() => setShowPopup(false)}
      >
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
                <InnerContainerLine>
                  <FormLine>
                    <StyledTextField
                      label={'Vardas'}
                      value={values.firstName}
                      error={errors.firstName}
                      name="firstName"
                      onChange={(el) => setFieldValue('firstName', el)}
                      showError={false}
                    />
                    <StyledTextField
                      label={'Pavardė'}
                      value={values.lastName}
                      error={errors.lastName}
                      name="lastName"
                      onChange={(el) => setFieldValue('lastName', el)}
                      showError={false}
                    />
                  </FormLine>
                  <FormLine>
                    <StyledTextField
                      label={'Telefono numeris'}
                      value={values.phone}
                      error={errors.phone}
                      name="phone"
                      onChange={(el) => setFieldValue('phone', el)}
                      showError={false}
                    />
                    <StyledTextField
                      label={'El. pašto adresas'}
                      value={values.email}
                      error={errors.email}
                      name="email"
                      onChange={(el) => setFieldValue('email', el)}
                      showError={false}
                    />
                  </FormLine>
                </InnerContainerLine>
                <ButtonContainer>
                  <ButtonRow>
                    <Button type="submit" loading={updateLoading} disabled={updateLoading}>
                      {'Atnaujinti kontaktus'}
                    </Button>
                  </ButtonRow>
                </ButtonContainer>
              </FormContainer>
            );
          }}
        </Formik>
      </PopUpWithTitles>
    </PageContainer>
  );
};
const StyledTable = styled(Table)`
   max-width: 100%;
  th {
    min-width: auto !important;
  }
  th:first-child {
    width: 140px !important;
  }
  td:last-child {
    width: auto !important;
  }
`
const AddIndicatorButton = styled.div<{ disabled: boolean }>`
  border: 1px dashed #e5e7eb;
  width: 20%;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  height: 56px;
  border-radius: 4px;
  position: relative;
  background-color: white;
  color: ${({ theme }) => theme.colors.text.active};
  font-size: 1.6rem;
  line-height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;
const ContactContainer = styled.div`
  width: 80%;
`;

const OuterTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const OuterContactContainer = styled.div`
  display: flex;
  margin-left: 20px;
`;
const Label = styled.div`
  font-size: 1.6rem;
  line-height: 20px;
  color: #697586;
  opacity: 1;
`;
const InfoTitle = styled.div`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 20px;
`;

const TableDiv = styled.div`
  & > *:nth-child(2) {
    margin-left: 20px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
`;

const StyledTextField = styled(TextField)`
  min-width: 150px;
  flex: 1;
  @media ${device.mobileL} {
    width: 100%;
  }
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
  margin: 24px 0;
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

export default BusinessPlaces;
