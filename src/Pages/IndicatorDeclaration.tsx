import { Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Button, { ButtonColors } from '../Components/buttons/Button';
import SelectField from '../Components/fields/SelectField';
import PopUpWithTitles from '../Components/layouts/PopUpWithTitle';
import { PageContainer, Title } from '../Components/other/CommonStyles';
import FullscreenLoader from '../Components/other/FullscreenLoader';
import IndicatorContainer from '../Components/other/IndicatorContainer';
import InfoTag from '../Components/other/InfoTag';
import StatusTag from '../Components/other/StatusTag';
import { TagColors } from '../utils/constants';
import { device } from '../styles';
import { IndicatorOption } from '../types';
import api from '../utils/api';
import {
  formatDate,
  getGroupedIndicatorValues,
  getIndicatorLabel,
  getYearRange,
  handleSuccessToast,
  inRange,
  isDateInRange,
  mapArraysToJson,
} from '../utils/functions';
import { useBusinessPlaces, useDeclaration, useIndicators } from '../utils/hooks';
import { slugs } from '../utils/routes';

const statusToColor = {
  1: TagColors.GREY,
  2: TagColors.BLUE,
  3: TagColors.GREEN,
};

const mapValues = (
  indicatorOptions?: IndicatorOption[],
  values?: any,
  mandatoryIndicators?: any,
) => {
  if (!values || !indicatorOptions) return [];

  const groupedValues = getGroupedIndicatorValues(values);

  return indicatorOptions.reduce((prev: any, curr) => {
    if (groupedValues[curr.id]) {
      prev.push({ ...curr, tableData: groupedValues[curr.id] });

      return prev;
    }

    if (
      !!mandatoryIndicators &&
      mapArraysToJson(mandatoryIndicators).some((item) => item.Rodiklis == curr.id)
    ) {
      prev.push({ ...curr, tableData: [] });

      return prev;
    }

    return prev;
  }, []);
};

const IndicatorDeclarationPage = () => {
  const { businessPlaceId = '', id = '', date = '' } = useParams();
  const [selectedIndicatorGroup, setSelectedIndicatorGroup] = useState('');
  const navigate = useNavigate();

  const { mappedDeclaration, declarationLoading, lookup, disabled } = useDeclaration();

  const { data: values, isLoading: valuesLoading } = useQuery(
    ['values', id],
    () => api.getValues(id),
    {
      retry: false,
      refetchOnWindowFocus: false,
      enabled: !declarationLoading,
    },
  );

  const yearRange = getYearRange(mappedDeclaration?.year);
  const currentDate = new Date();
  let maxAllowedDate = yearRange.maxDate;

  if (yearRange.maxDate >= currentDate) {
    maxAllowedDate = currentDate;
  }

  useEffect(() => {
    if (!declarationLoading && !isLoading && yearRange && date) {
      if (!isDateInRange(date, yearRange.minDate, maxAllowedDate)) {
        navigate(slugs.declaration(businessPlaceId, id));
      }
    }
  }, [date, yearRange]);

  const { data: mandatoryIndicators, isFetching: mandatoryIndicatorsLoading } = useQuery(
    ['mandatory', mappedDeclaration.waterQuantity],
    () => api.getMandatoryIndicators(id),
    {
      retry: false,
      enabled: !!mappedDeclaration?.waterQuantity,
      refetchOnWindowFocus: false,
      cacheTime: 0,
      staleTime: 0,
    },
  );

  const [showPopup, setShowPopup] = useState(false);

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
    if (!declarationLoading) {
      setSelectedIndicators([]);
    }
  }, [id, declarationLoading]);

  useEffect(() => {
    if (isEmpty(values) || isEmpty(indicators) || valuesLoading || declarationLoading) return;

    let mappedValues = mapValues(indicatorOptions, values);

    mappedValues = mappedValues.filter((item) =>
      item.tableData.some((element) => element.date === date?.toString()),
    );

    setSelectedIndicators(mappedValues);
  }, [values, indicators, mandatoryIndicatorsLoading, date]);

  const filteredIndicatorOptions = indicatorOptions
    ?.filter(
      (indicator) =>
        indicator.groupId == selectedIndicatorGroup &&
        !selectedIndicators.some((i) => i.id == indicator.id),
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const indicatorInitialValues: { indicator?: IndicatorOption } = { indicator: undefined };

  const isLoading = [valuesLoading, declarationLoading, mandatoryIndicatorsLoading].some(
    (loading) => loading,
  );

  const showAddIndicatorButton = !disabled && !isEmpty(filteredIndicatorOptions);

  if (isLoading) return <FullscreenLoader />;
  return (
    <PageContainer>
      <TopRow>
        <div>
          <TitleContainer>
            <Title>{`${date} tyrimų pildymas`}</Title>
            <StatusTag
              color={statusToColor[mappedDeclaration?.status]}
              label={lookup?.Statusas[mappedDeclaration?.status] || ''}
            />
          </TitleContainer>
        </div>
        <FlexItem>
          <Button
            onClick={() => navigate(slugs.declaration(businessPlaceId, id))}
            variant={ButtonColors.BACK}
            type="button"
          >
            {'Grįžti atgal'}
          </Button>
        </FlexItem>
      </TopRow>

      {mappedDeclaration?.waterQuantity && (
        <>
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
                .sort((a, b) => a.name.localeCompare(b.name))
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
                        viewOnly={false}
                        activeDate={date}
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
                        <Button type="submit" disabled={!values.indicator}>
                          {'Pridėti rodiklį'}
                        </Button>
                      </ButtonInnerRow>
                    </ButtonRow>
                  </FormContainer>
                );
              }}
            </Formik>
          </PopUpWithTitles>
        </>
      )}
    </PageContainer>
  );
};

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const ButtonInnerRow = styled.div`
  display: flex;
  @media ${device.mobileL} {
    width: 100%;
  }
`;

const StyledSelectField = styled(SelectField)`
  margin: 24px 0px;
`;

const FlexItem = styled.div`
  display: flex;
  gap: 16px;
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

const InfoTitle = styled.div`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 12px;
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
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export default IndicatorDeclarationPage;
