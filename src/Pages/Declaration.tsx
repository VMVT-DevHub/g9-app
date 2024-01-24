import { Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import * as Yup from 'yup';
import Button from '../Components/buttons/Button';
import ButtonsGroup from '../Components/buttons/ButtonGroup';
import MultiSelect from '../Components/fields/MultiSelect';
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
import { IndicatorOption } from '../types';
import api from '../utils/api';
import {
  getGroupedIndicatorValues,
  getIndicatorLabel,
  getOptions,
  getYearRange,
  getYesNo,
  handleSuccessToast,
} from '../utils/functions';
import { useBusinessPlaces, useDeclaration, useIndicators } from '../utils/hooks';
import { slugs } from '../utils/routes';
import { validationTexts } from '../utils/texts';

export const declarationSchema = Yup.object().shape({
  waterQuantity: Yup.number()
    .min(1, validationTexts.positiveNumber)
    .required(validationTexts.requireText),
  usersCount: Yup.number()
    .min(1, validationTexts.positiveNumber)
    .required(validationTexts.requireText),
  waterMaterial: Yup.number().when(['isPreparedWater'], (isPreparedWater: any, schema) => {
    if (isPreparedWater?.[0]) {
      return schema.required(validationTexts.requireSelect);
    }
    return schema.nullable();
  }),
});

const mapValues = (
  indicatorOptions?: IndicatorOption[],
  values?: any,
  mandatoryIndicators?: any,
) => {
  if (!values || !indicatorOptions) return [];
  const deficiencyData = mandatoryIndicators?.Trukumas?.Data;

  const groupedValues = getGroupedIndicatorValues(values);

  return indicatorOptions.reduce((prev: any, curr) => {
    if (groupedValues[curr.id]) {
      prev.push({ ...curr, tableData: groupedValues[curr.id] });

      return prev;
    }

    if (!!deficiencyData && deficiencyData.some((item) => item[1] == curr.id)) {
      prev.push({ ...curr, tableData: [] });

      return prev;
    }

    return prev;
  }, []);
};

const DeclarationPage = () => {
  const { businessPlaceId = '', id = '' } = useParams();
  const [selectedIndicatorGroup, setSelectedIndicatorGroup] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: businessPlaces, isLoading: businessPlaceLoading } = useBusinessPlaces();

  const currentBusinessPlace = businessPlaces.find(
    (item) => item?.id?.toString() === businessPlaceId,
  );

  const { data: values, isLoading: valuesLoading } = useQuery(
    ['values', id],
    () => api.getValues(id),
    {
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

  const { mappedDeclaration, declarationLoading, lookup, disabled, canDeclare } = useDeclaration();
  const { data: mandatoryIndicators, isFetching: mandatoryIndicatorsLoading } = useQuery(
    ['mandatory', mappedDeclaration.waterQuantity],
    () => api.getMandatoryIndicators(id),
    {
      retry: false,
      enabled: !!mappedDeclaration.waterQuantity,
      refetchOnWindowFocus: false,
    },
  );

  const [showPopup, setShowPopup] = useState(false);
  const waterMaterialOptions = getOptions(lookup?.RuosimoMedziagos);
  const waterMaterialLabels = lookup?.RuosimoMedziagos || {};

  const { indicatorGroupLabels, indicatorGroups, indicatorOptions, indicators } = useIndicators(
    mappedDeclaration.type?.value,
  );

  useEffect(() => {
    if (!selectedIndicatorGroup && indicatorGroups?.[0]) {
      setSelectedIndicatorGroup(indicatorGroups[0]);
    }
  }, [selectedIndicatorGroup, indicatorGroups]);

  const [selectedIndicators, setSelectedIndicators] = useState<IndicatorOption[]>([]);

  const updateIndicatorTable = async (indicatorId: string) => {
    const values = await api.getValues(id);

    setSelectedIndicators(
      selectedIndicators.map((item) => {
        if (item.id === indicatorId) {
          item.tableData = getGroupedIndicatorValues(values)[indicatorId];
        }

        return item;
      }),
    );
    handleSuccessToast();
  };

  useEffect(() => {
    if (isEmpty(values) || isEmpty(indicators) || mandatoryIndicatorsLoading) return;

    const mappedValues = mapValues(indicatorOptions, values, mandatoryIndicators);

    setSelectedIndicators(mappedValues);
  }, [values, indicators, mandatoryIndicatorsLoading]);

  const filteredIndicatorOptions = indicatorOptions
    ?.filter(
      (indicator) =>
        indicator.groupId == selectedIndicatorGroup &&
        !selectedIndicators.some((i) => i.id == indicator.id),
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleSubmit = (values: typeof formValues) => {
    const params = {
      Kiekis: values.waterQuantity,
      Vartotojai: values.usersCount,
      ...(values.isPreparedWater && { RuosimoMedziagos: values.waterMaterial }),
    };

    updateDeclarationMutation(params);
  };

  const { mutateAsync: updateDeclarationMutation, isLoading: isSubmitLoading } = useMutation(
    (values: any) => api.updateDeclaration(id, values),
    {
      onError: () => {},
      onSuccess: async () => {
        handleSuccessToast();
        await queryClient.invalidateQueries(['declaration', id]);
      },
      retry: false,
    },
  );

  const formValues = {
    waterMaterial: mappedDeclaration?.waterMaterial || undefined,
    waterQuantity: mappedDeclaration?.waterQuantity || '',
    usersCount: mappedDeclaration.usersCount || '',
    isPreparedWater: !!mappedDeclaration?.waterMaterial,
  };

  const indicatorInitialValues: { indicator?: IndicatorOption } = { indicator: undefined };

  const isLoading = [
    valuesLoading,
    businessPlaceLoading,
    declarationLoading,
    mandatoryIndicatorsLoading,
  ].some((loading) => loading);

  const yearRange = getYearRange(mappedDeclaration.year);

  const showAddIndicatorButton = !disabled && !isEmpty(filteredIndicatorOptions);

  if (isLoading) return <FullscreenLoader />;

  return (
    <PageContainer>
      <TopRow>
        <div>
          <InfoTagRow>
            <InfoTag label={mappedDeclaration.year} />
            <InfoTag label={mappedDeclaration?.type?.label} />
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
        {canDeclare ? (
          <FlexItem>
            <Button
              onClick={() => navigate(slugs.discrepancies(businessPlaceId, id))}
              type="button"
            >
              {'Tikrinti neatitikimus'}
            </Button>
          </FlexItem>
        ) : (
          ''
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
                  <ContainerLine>
                    <InnerContainerLine>
                      <FormLine>
                        <StyledNumericTextField
                          rightIcon={<CubicMeter />}
                          label={'Vandens kiekis'}
                          value={values.waterQuantity}
                          error={errors.waterQuantity}
                          disabled={disabled}
                          name="waterQuantity"
                          onChange={(phone) => setFieldValue('waterQuantity', phone)}
                          showError={false}
                        />
                        <StyledNumericTextField
                          label={'Vartotojų skaičius'}
                          name="usersCount"
                          value={values.usersCount}
                          disabled={disabled}
                          error={errors.usersCount}
                          onChange={(email) => setFieldValue('usersCount', email)}
                          showError={false}
                        />
                        <StyledButtonGroup
                          options={[true, false]}
                          label={'Ar vanduo ruošiamas?'}
                          onChange={(option) => setFieldValue('isPreparedWater', option)}
                          disabled={disabled}
                          getOptionLabel={getYesNo}
                          isSelected={(option) => option === values.isPreparedWater}
                        />
                      </FormLine>
                      {values.isPreparedWater && (
                        <FormLine>
                          <StyledFormMultiSelectField
                            disabled={disabled}
                            options={waterMaterialOptions}
                            showError={false}
                            getOptionLabel={(option) => waterMaterialLabels[option]}
                            getOptionValue={(option) => option}
                            values={values.waterMaterial}
                            label={'Vandens ruošimui naudojamos medžiagos'}
                            name="waterMaterials"
                            onChange={(value) => setFieldValue('waterMaterial', value)}
                            error={errors.waterMaterial}
                          />
                        </FormLine>
                      )}
                    </InnerContainerLine>

                    <ButtonLine>
                      <Button
                        type="submit"
                        loading={isSubmitLoading}
                        disabled={isSubmitLoading || disabled}
                      >
                        {'Saugoti'}
                      </Button>
                    </ButtonLine>
                  </ContainerLine>
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
            .map((indicator, index) => {
              const initialOpen = indicator.initialOpen || index === 0;

              return (
                <div key={`indicator-group-${indicator.id}`}>
                  <IndicatorContainer
                    onDelete={(id) =>
                      setSelectedIndicators(
                        selectedIndicators.filter((indicator) => indicator.id !== id),
                      )
                    }
                    initialOpen={initialOpen}
                    updateIndicatorTable={(id) => updateIndicatorTable(id)}
                    yearRange={yearRange}
                    disabled={disabled}
                    indicator={indicator}
                  />
                </div>
              );
            })}

          {showAddIndicatorButton && (
            <AddIndicatorButton
              disabled={!selectedIndicatorGroup}
              onClick={() => selectedIndicatorGroup && setShowPopup(true)}
            >
              + Pridėti rodiklį
            </AddIndicatorButton>
          )}
        </Column>
      </InfoContainer>

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

            setSelectedIndicators((prev) => [
              ...prev.map((indicator) => ({ ...indicator, initialOpen: false })),
              { ...indicator, initialOpen: true },
            ]);
            setShowPopup(false);
          }}
          validateOnChange={false}
        >
          {({ values, errors, setFieldValue }) => {
            return (
              <FormContainer>
                <StyledSelectField
                  options={filteredIndicatorOptions}
                  getOptionLabel={getIndicatorLabel}
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
    </PageContainer>
  );
};

const ButtonInnerRow = styled.div`
  display: flex;
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

const StyledButtonGroup = styled(ButtonsGroup)`
  min-width: 250px;
  flex: 2;
  @media ${device.mobileL} {
    flex: 1;
    width: 100%;
  }

  @media ${device.mobileM} {
    min-width: 100%;
  }
`;

const StyledFormMultiSelectField = styled(MultiSelect)`
  width: 100%;
  flex: 1;
`;

const StyledSelectField = styled(SelectField)`
  margin: 24px 0px;
`;

const FormLine = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
  max-width: 616px;
  @media ${device.mobileL} {
    flex-direction: column;
    max-width: 100%;
    width: 100%;
  }
`;

const ContainerLine = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 16px;
  max-width: 800px;
  @media ${device.mobileL} {
    max-width: 100%;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const InnerContainerLine = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
  @media ${device.mobileL} {
    width: 100%;
  }
`;

const ButtonLine = styled.div`
  display: flex;

  max-width: 200px;
  @media ${device.mobileL} {
    width: 100%;
  }
`;

const FlexItem = styled.div`
  display: flex;
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
  width: 100%;
  max-width: 290px;
  border-radius: 12px 0 0 12px;

  @media ${device.mobileL} {
    max-width: 100%;
    border-radius: 12px 12px 0 0px;
  }
`;

const MainCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  min-height: 176px;
  width: 100%;
  display: flex;
  @media ${device.mobileL} {
    flex-direction: column;
  }
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
  @media ${device.mobileL} {
    justify-content: space-between;
  }
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

const AddIndicatorButton = styled.div<{ disabled: boolean }>`
  border: 1px dashed #e5e7eb;
  width: 100%;
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

const InfoContainer = styled.div`
  display: flex;
  gap: 50px;
  @media ${device.mobileL} {
    flex-direction: column;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
  min-width: 0;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export default DeclarationPage;
