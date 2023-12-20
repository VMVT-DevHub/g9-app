import { Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import * as Yup from 'yup';
import Button from '../Components/buttons/Button';
import ButtonsGroup from '../Components/buttons/ButtonGroup';
import NumericTextField from '../Components/fields/NumericTextField';
import SelectField from '../Components/fields/SelectField';
import PopUpWithTitles from '../Components/layouts/PopUpWithTitle';
import { PageContainer, Title } from '../Components/other/CommonStyles';
import FullscreenLoader from '../Components/other/FullscreenLoader';
import IndicatorContainer from '../Components/other/IndicatorContainer';
import InfoRow from '../Components/other/InfoRow';
import InfoTag from '../Components/other/InfoTag';
import { CubicMeter } from '../Components/other/MeasurmentUnits';
import { device } from '../styles';
import { IndicatorOption, ServerDeclaration } from '../types';
import api from '../utils/api';
import { getOptions, getYesNo, handleSuccessToast } from '../utils/functions';
import { useBusinessPlaces, useIndicators } from '../utils/hooks';
import { slugs } from '../utils/routes';
import { validationTexts } from '../utils/texts';

export const declarationSchema = Yup.object().shape({
  waterQuantity: Yup.string().required(validationTexts.requireText),
  usersCount: Yup.string().required(validationTexts.requireText),
  waterMaterial: Yup.number().when(['isPreparedWater'], (isPreparedWater: any, schema) => {
    if (isPreparedWater?.[0]) {
      return schema.required(validationTexts.requireSelect);
    }
    return schema.nullable();
  }),
});

const mapDeclaration = (declaration?: ServerDeclaration) => {
  if (!declaration) return {};

  return {
    year: declaration?.Data[0][2],
    type: declaration?.Lookup.Stebesenos[declaration.Data[0][3]],
    status: declaration?.Lookup.Statusas[declaration.Data[0][4]],
    waterQuantity: declaration?.Data?.[0]?.[5],
    usersCount: declaration?.Data[0]?.[6],
    waterMaterial: declaration?.Data?.[0]?.[7]?.[0],
  };
};

const mapValues = (indicatorOptions?: IndicatorOption[], values?: any) => {
  if (!values || !indicatorOptions) return [];

  const groupedValues = values?.Data.reduce((groupedValues, currentValue) => {
    groupedValues[currentValue[2]] = groupedValues[currentValue?.[2]] || [];

    groupedValues[currentValue[2]].push({
      id: currentValue[0],
      indicatorId: currentValue[2],
      date: currentValue[3],
      value: currentValue[4],
    });

    return groupedValues;
  }, {});

  return indicatorOptions.reduce((prev: any, curr) => {
    if (groupedValues[curr.id]) {
      prev.push({ ...curr, tableData: groupedValues[curr.id] });
    }

    return prev;
  }, []);
};

const DeclarationPage = () => {
  const { businessPlaceId = '', id = '' } = useParams();
  const [selectedIndicatorGroup, setSelectedIndicatorGroup] = useState('');
  const navigate = useNavigate();

  const { data: businessPlaces, isLoading: businessPlaceLoading } = useBusinessPlaces();

  const currentBusinessPlace = businessPlaces.find(
    (item) => item?.id?.toString() === businessPlaceId,
  );

  const { data, isLoading: declarationLoading } = useQuery(
    ['declaration'],
    () => api.getDeclaration(id),
    {
      retry: false,
    },
  );

  const { data: values, isLoading: valuesLoading } = useQuery(['values'], () => api.getValues(id), {
    retry: false,
  });

  const mappedDeclaration = mapDeclaration(data);

  const disabled = mappedDeclaration.status === 'Deklaruota';

  const hideButton = disabled || mappedDeclaration.status === 'Pildoma';

  const [showPopup, setShowPopup] = useState(false);
  const waterMaterialOptions = getOptions(data?.Lookup?.RuosimoMedziagos);
  const waterMaterialLabels = data?.Lookup?.RuosimoMedziagos || {};

  const { indicatorGroupLabels, indicatorGroups, indicatorOptions, indicators } = useIndicators();

  const [selectedIndicators, setSelectedIndicators] = useState<IndicatorOption[]>([]);

  useEffect(() => {
    if (isEmpty(values) || isEmpty(indicators)) return;

    const mappedValues = mapValues(indicatorOptions, values);

    setSelectedIndicators(mappedValues);
  }, [values, indicators]);

  const filteredIndicatorOptions = indicatorOptions?.filter(
    (indicator) => indicator.groupId == selectedIndicatorGroup,
  );

  const handleSubmit = (values: typeof formValues) => {
    const params = {
      Kiekis: values.waterQuantity,
      Vartotojai: values.usersCount,
      ...(values.isPreparedWater && { RuosimoMedziagos: [values.waterMaterial] }),
    };

    updateDeclarationMutation(params);
  };

  const { mutateAsync: updateDeclarationMutation, isLoading: isSubmitLoading } = useMutation(
    (values: any) => api.updateDeclaration(id, values),
    {
      onError: () => {},
      onSuccess: async () => {
        handleSuccessToast();
      },
      retry: false,
    },
  );

  const formValues = {
    waterMaterial: mappedDeclaration?.waterMaterial || undefined,
    waterQuantity: mappedDeclaration?.waterQuantity || '',
    usersCount: mappedDeclaration.usersCount || '',
    isPreparedWater: typeof mappedDeclaration?.waterMaterial !== 'undefined',
  };

  const indicatorInitialValues: { indicator?: IndicatorOption } = { indicator: undefined };

  const isLoading = [valuesLoading, businessPlaceLoading, declarationLoading].some(
    (loading) => loading,
  );
  if (isLoading) return <FullscreenLoader />;

  return (
    <PageContainer>
      <TopRow>
        <div>
          <InfoTagRow>
            <InfoTag label={mappedDeclaration.year} />
            <InfoTag label={mappedDeclaration.type} />
          </InfoTagRow>
          <Title>{'Deklaracija'}</Title>

          <InfoRow
            info={[
              currentBusinessPlace?.name,
              currentBusinessPlace?.code,
              currentBusinessPlace?.address,
            ]}
          />
        </div>
        {!hideButton && (
          <FlexItem $flex={0.25}>
            <Button
              onClick={() => navigate(slugs.discrepancies(businessPlaceId, id))}
              type="button"
            >
              {'Tikrinti neatitikimus'}
            </Button>
          </FlexItem>
        )}
      </TopRow>
      <MainCard>
        <Image src="/formImage.webp" />
        <MainCardContainer>
          <InfoTitle>Nurodykite savo veiklavietės parametrus</InfoTitle>
          <Formik
            enableReinitialize={true}
            initialValues={formValues}
            onSubmit={handleSubmit}
            validationSchema={declarationSchema}
            validateOnChange={false}
          >
            {({ values, errors, setFieldValue }) => {
              return (
                <FormContainer>
                  <Grid>
                    <FlexItem $flex={0.25}>
                      <NumericTextField
                        rightIcon={<CubicMeter />}
                        label={'Vandens kiekis'}
                        value={values.waterQuantity}
                        error={errors.waterQuantity}
                        disabled={disabled}
                        name="waterQuantity"
                        onChange={(phone) => setFieldValue('waterQuantity', phone)}
                        showError={false}
                      />
                    </FlexItem>
                    <FlexItem $flex={0.25}>
                      <NumericTextField
                        label={'Vartotojų skaičius'}
                        name="usersCount"
                        value={values.usersCount}
                        disabled={disabled}
                        error={errors.usersCount}
                        onChange={(email) => setFieldValue('usersCount', email)}
                        showError={false}
                      />
                    </FlexItem>
                    <FlexItem $flex={0.5}>
                      <ButtonsGroup
                        options={[true, false]}
                        label={'Ar vanduo ruošiamas?'}
                        onChange={(option) => setFieldValue('isPreparedWater', option)}
                        disabled={disabled}
                        getOptionLabel={getYesNo}
                        isSelected={(option) => option === values.isPreparedWater}
                      />
                    </FlexItem>

                    {!values.isPreparedWater && (
                      <FlexItem $flex={0.5}>
                        <ButtonRow>
                          <Button
                            type="submit"
                            loading={isSubmitLoading}
                            disabled={isSubmitLoading}
                          >
                            {'Saugoti'}
                          </Button>
                        </ButtonRow>
                      </FlexItem>
                    )}
                  </Grid>
                  {values.isPreparedWater && (
                    <SecondGrid>
                      <FlexItem $flex={1.5}>
                        <SelectField
                          disabled={disabled}
                          options={waterMaterialOptions}
                          showError={false}
                          getOptionLabel={(option) => waterMaterialLabels[option]}
                          value={values.waterMaterial}
                          label={'Vandens ruošimui naudojamos medžiagos'}
                          name="waterMaterials"
                          onChange={(value) => setFieldValue('waterMaterial', value)}
                          error={errors.waterMaterial}
                        />
                      </FlexItem>
                      <FlexItem $flex={0.5}>
                        <ButtonRow>
                          <Button type="submit" loading={false} disabled={false}>
                            {'Saugoti'}
                          </Button>
                        </ButtonRow>
                      </FlexItem>
                    </SecondGrid>
                  )}
                </FormContainer>
              );
            }}
          </Formik>
        </MainCardContainer>
      </MainCard>

      <InfoTitle>Rodiklių duomenys</InfoTitle>
      <InfoContainer>
        <IndicatorGroupContainer>
          {indicatorGroups.map((group) => {
            return (
              <IndicatorLine
                key={`indicator-${group}`}
                onClick={() => setSelectedIndicatorGroup(group)}
              >
                <IndicatorText $isActive={group === selectedIndicatorGroup}>
                  {indicatorGroupLabels[group]}
                </IndicatorText>
                <InfoTag
                  label={selectedIndicators
                    .filter((item) => item.groupId.toString() === group)
                    .length.toString()}
                />
              </IndicatorLine>
            );
          })}
        </IndicatorGroupContainer>
        <Column>
          {selectedIndicators
            .filter((item) => item.groupId.toString() === selectedIndicatorGroup)
            .map((indicator) => (
              <IndicatorContainer disabled={disabled} indicator={indicator} />
            ))}

          {!disabled && (
            <AddIndicatorButton onClick={() => setShowPopup(true)}>
              + Pridėti rodiklį
            </AddIndicatorButton>
          )}
        </Column>
        <PopUpWithTitles
          title={'Pridėti rodiklį'}
          visible={showPopup}
          onClose={() => setShowPopup(false)}
        >
          <Formik
            enableReinitialize={true}
            initialValues={indicatorInitialValues}
            onSubmit={({ indicator }) => {
              if (!indicator) return;

              setSelectedIndicators((prev) => [...prev, indicator]);
              setShowPopup(false);
            }}
            validateOnChange={false}
          >
            {({ values, errors, setFieldValue }) => {
              return (
                <FormContainer>
                  <StyledSelectField
                    options={filteredIndicatorOptions}
                    getOptionLabel={(option) => option?.name}
                    value={values.indicator}
                    label={'Rodiklis'}
                    name="indicator"
                    onChange={(value) => setFieldValue('indicator', value)}
                    error={errors.indicator}
                  />
                  <ButtonRow>
                    <ButtonInnerRow>
                      <Button
                        type="submit"
                        loading={isSubmitLoading}
                        disabled={!values.indicator || isSubmitLoading}
                      >
                        {'Pridėti rodiklį'}
                      </Button>
                    </ButtonInnerRow>
                  </ButtonRow>
                </FormContainer>
              );
            }}
          </Formik>
        </PopUpWithTitles>
      </InfoContainer>
    </PageContainer>
  );
};

const ButtonInnerRow = styled.div`
  display: flex;
  @media ${device.mobileL} {
    width: 100%;
  }
`;

const StyledSelectField = styled(SelectField)`
  margin: 24px 0px;
`;

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
  width: 100%;
  max-width: 450px;
  @media ${device.mobileL} {
    max-width: 100%;
  }
`;

const SecondGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 16px 0;
  align-items: flex-end;
  width: 100%;
  max-width: 700px;
  @media ${device.mobileL} {
    max-width: 100%;
  }
`;

const FlexItem = styled.div<{ $flex }>`
  flex: ${({ $flex }) => $flex};

  @media ${device.mobileL} {
    flex: 1;
  }
`;
const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const FormContainer = styled(Form)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Image = styled.img`
  object-fit: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  width: 100%;
  max-width: 290px;
  border-radius: 12px 0 0 12px;
`;

const MainCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  min-height: 176px;
  width: 100%;
  display: flex;
`;

const MainCardContainer = styled.div`
  margin: 24px 32px;
  display: flex;
  flex-direction: column;
`;

const InfoTitle = styled.div`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 12px;
`;

const InfoTagRow = styled.div`
  display: flex;
  gap: 4px;
  margin: 32px 0px 14px 0px;
`;

const IndicatorLine = styled.div`
  display: flex;
  gap: 59px;
  cursor: pointer;
`;

const IndicatorText = styled.div<{ $isActive: boolean }>`
  font-size: 1.4rem;
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.text.active : theme.colors.text.secondary};
  cursor: pointer;
  width: 200px;
`;

const IndicatorGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const AddIndicatorButton = styled.div`
  border: 1px dashed #e5e7eb;
  width: 100%;
  height: 56px;
  border-radius: 4px;
  position: relative;
  background-color: white;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.active};
  font-size: 1.6rem;
  line-height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const InfoContainer = styled.div`
  display: flex;
  gap: 50px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default DeclarationPage;
