import { Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import { personalCode } from 'lt-codes';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import * as Yup from 'yup';
import Button, { ButtonColors } from '../Components/buttons/Button';
import Declarations from '../Components/containers/Declarations';
import RightsDelegations from '../Components/containers/RightsDelegation';
import NumericTextField from '../Components/fields/NumericTextField';
import SelectField from '../Components/fields/SelectField';
import TextField from '../Components/fields/TextField';
import PopUpWithTitles from '../Components/layouts/PopUpWithTitle';
import { Grid, PageContainer, SpaceBetweenRow, Title } from '../Components/other/CommonStyles';
import FullscreenLoader from '../Components/other/FullscreenLoader';
import InfoRow from '../Components/other/InfoRow';
import TabBar from '../Components/other/TabBar';
import { device } from '../styles';
import api from '../utils/api';
import { getRole } from '../utils/functions';
import { useBusinessPlaces, useGetCurrentRoute, useIsAdmin } from '../utils/hooks';
import { slugs } from '../utils/routes';
import { validationTexts } from '../utils/texts';

export const userSchema = Yup.object().shape({
  firstName: Yup.string().required(validationTexts.requireText),
  lastName: Yup.string().required(validationTexts.requireText),
  personalCode: Yup.string()
    .required(validationTexts.requireText)
    .trim()
    .test('validatePersonalCode', validationTexts.personalCode, (value) => {
      return personalCode.validate(value).isValid;
    }),
});

const initialValues = { firstName: '', lastName: '', personalCode: '', role: false };

const BusinessPlace = () => {
  const { id = '' } = useParams();
  const queryClient = useQueryClient();
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const { data, isLoading } = useBusinessPlaces();

  const currentBusinessPlace = data.find((item) => item?.id?.toString() === id);

  const isAdmin = useIsAdmin();

  useEffect(() => {
    if (isEmpty(data)) return;

    if (!currentBusinessPlace) navigate(slugs.businessPlaces);
  }, [currentBusinessPlace, data]);

  const tabs = [
    {
      label: 'Deklaracijos',
      slug: slugs.businessPlaceDeclarations(id),
    },
    ...(isAdmin
      ? [
          {
            label: 'Teisių delegavimas',
            slug: slugs.businessPlaceRightsDelegation(id),
          },
        ]
      : []),
  ];

  const currentTab = useGetCurrentRoute(tabs);

  useEffect(() => {
    if (!currentTab?.slug) {
      navigate(slugs.businessPlaceDeclarations(id));
    }
  }, [currentTab?.slug]);

  const containers = {
    [slugs.businessPlaceDeclarations(id)]: <Declarations />,
    [slugs.businessPlaceRightsDelegation(id)]: <RightsDelegations />,
  };

  const { mutateAsync: createUserMutation, isLoading: isSubmitLoading } = useMutation(
    (values: typeof initialValues) =>
      api.createUser(id, {
        AK: values.personalCode,
        FName: values.firstName,
        LName: values.lastName,
        Admin: values.role,
      }),
    {
      onError: () => {},
      onSuccess: async () => {
        await queryClient.invalidateQueries(['users']);
        setShowPopup(false);
      },
      retry: false,
    },
  );

  if (isLoading) return <FullscreenLoader />;

  return (
    <PageContainer>
      <div>
        <Title>{currentBusinessPlace?.name || '-'}</Title>
        <InfoRow
          info={[
            currentBusinessPlace?.name,
            currentBusinessPlace?.code,
            currentBusinessPlace?.address,
          ]}
        />
      </div>
      <Container>
        <SpaceBetweenRow>
          <TabBar tabs={tabs} />
          {currentTab?.slug === slugs.businessPlaceRightsDelegation(id) && (
            <div>
              <Button onClick={() => setShowPopup(true)}>Pridėti teisę</Button>
            </div>
          )}
        </SpaceBetweenRow>
        {currentTab?.slug && containers[currentTab?.slug]}
      </Container>
      <PopUpWithTitles
        title={'Pridėti teisę'}
        visible={showPopup}
        onClose={() => setShowPopup(false)}
      >
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          onSubmit={(values) => createUserMutation(values)}
          validateOnChange={false}
          validationSchema={userSchema}
        >
          {({ values, errors, setFieldValue }) => {
            return (
              <FormContainer>
                <Grid>
                  <TextField
                    label={'Vardas'}
                    value={values.firstName}
                    error={errors.firstName}
                    name="firstName"
                    onChange={(phone) => setFieldValue('firstName', phone)}
                  />
                  <TextField
                    label={'Pavardė'}
                    name="lastName"
                    value={values.lastName}
                    error={errors.lastName}
                    onChange={(email) => setFieldValue('lastName', email)}
                  />

                  <NumericTextField
                    label={'Asmens kodas'}
                    name="personalCode"
                    value={values.personalCode}
                    error={errors.personalCode}
                    onChange={(email) => setFieldValue('personalCode', email)}
                  />
                  <SelectField
                    options={[true, false]}
                    getOptionLabel={getRole}
                    value={values.role}
                    label={'Rolė'}
                    name="role"
                    onChange={(value) => setFieldValue('role', value)}
                    error={errors.role}
                  />
                </Grid>
                <ButtonRow>
                  <ButtonInnerRow>
                    <Button
                      type="button"
                      onClick={() => setShowPopup(false)}
                      variant={ButtonColors.TRANSPARENT}
                      disabled={isSubmitLoading}
                    >
                      {'Atšaukti'}
                    </Button>
                    <Button type="submit" loading={isSubmitLoading} disabled={isSubmitLoading}>
                      {'Pridėti teisę'}
                    </Button>
                  </ButtonInnerRow>
                </ButtonRow>
              </FormContainer>
            );
          }}
        </Formik>
      </PopUpWithTitles>
    </PageContainer>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ButtonInnerRow = styled.div`
  width: 50%;
  display: flex;
  gap: 16px;
  @media ${device.mobileL} {
    width: 100%;
    flex-direction: column;
  }
`;

const FormContainer = styled(Form)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export default BusinessPlace;
