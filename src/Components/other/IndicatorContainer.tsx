import { Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import { useState, useRef } from 'react';
import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { device } from '../../styles';
import { IndicatorOption } from '../../types';
import api from '../../utils/api';
import { formatDate, getIndicatorLabel, handleErrorToast, inRange } from '../../utils/functions';
import Button from '../buttons/Button';
import ButtonsGroup from '../buttons/ButtonGroup';
import DateField from '../fields/DateField';
import NumericTextField from '../fields/NumericTextField';
import Table from '../Table/Table';
import { BlueText, DangerText, TableActionContainer } from './CommonStyles';
import Icon, { IconName } from './Icons';
import InfoPopUp from './InfoPopUp';
import { useDeclaration } from '../../utils/hooks';
import { current } from '@reduxjs/toolkit';

const IndicatorContainer = ({
  indicator,
  disabled,
  onDelete,
  yearRange,
  updateIndicatorTable,
  initialOpen = false,
  viewOnly,
  activeDate,
}: {
  yearRange: {
    minDate: Date;
    maxDate: Date;
  };
  initialOpen?: boolean;
  updateIndicatorTable: (id: string) => Promise<void>;
  indicator: IndicatorOption;
  disabled: boolean;
  viewOnly: boolean;
  activeDate?: any
  onDelete: (id: string) => void;
}) => {
  const [open, setOpen] = useState(initialOpen);
  const { id = '' } = useParams();
  const [showPopup, setsSowPopup] = useState(false);
  const [showForm, setShowForm] = useState(true);
  
  const isButton = indicator.unit === 'T/N';

  const renderValue = (item) => {
    if (isButton) {
      if (item.value === 0) return 'Ne';

      return 'Taip';
    }

    const value = `${item.value} ${indicator.unit}`;

    if (inRange(item.value, indicator.min, indicator.max)) return value;

    return <DangerText>{value}</DangerText>;
  };

  const currentDate = new Date();
  let maxAllowedDate = yearRange.maxDate;

  if(yearRange.maxDate >= currentDate)
  {
    maxAllowedDate = currentDate;
  }
  let tableData =
    indicator.tableData?.map((item) => {
      return {
        ...item,
        value: renderValue(item),
        ...(!disabled && {
          delete: (
            <TableActionContainer>
              <BlueText onClick={() => deleteUserMutation(item.id)}>Trinti</BlueText>
            </TableActionContainer>
          ),
        }),
      };
    }) || [];
  tableData = !viewOnly ? tableData.filter((item) => item.date == activeDate.toString()) : tableData;

  const { mutateAsync: updateDeclarationValuesMutation, isLoading: isSubmitLoading } = useMutation(
    (values: any) => api.postValue(id, values),
    {
      onError: () => {
        handleErrorToast();
      },
      onSuccess: async () => {
        updateIndicatorTable(indicator.id);
      },
      retry: false,
    },
  );

  const { mutateAsync: deleteUserMutation } = useMutation(
    (valueId: any) => api.deleteValue(id, [valueId]),
    {
      onSuccess: async () => {
        updateIndicatorTable(indicator.id);
      },
      retry: false,
    },
  );

  const handleSubmit = async (values: {date: any, value: any }, { resetForm }) => {
    const params = [
      {
        Rodiklis: indicator.id,
        Data: activeDate ? activeDate : formatDate(values.date),
        Reiksme: isButton ? (values.value === 'Taip' ? 1 : 0) : values.value,
      },
    ];
    await updateDeclarationValuesMutation(params);
    resetForm({
      values: {
        date: values.date,
      },
    });
    setShowForm(false)
  };

  const labels = {
    date: 'Mėginio paėmimo data',
    value: isButton ? indicator.description : 'Reikšmė',
    delete: '',
  };
  const showTable = !isEmpty(tableData);
  return (
    <>
      <Expander
        onClick={() => {
          setOpen(!open), setShowForm(open);
        }}
        $isActive={open}
        $hasData={tableData.length}
      >
        <TitleContainer>
        
        <IndicatorValue $isActive={open}  $hasData={tableData.length}>
            {`${getIndicatorLabel(indicator)} ${tableData.length ? `(${tableData.length})` : ''}`}
          </IndicatorValue>
          {!showTable && (
            <Delete onClick={() => onDelete(indicator.id)} $isActive={open}>
              Panaikinti
            </Delete>
          )}
        </TitleContainer>
        <StyledIcon $isActive={open} name={IconName.dropdownArrow} />
      </Expander>
      {open && (
        <>
          <InfoRowContainer $disabled={disabled}>
            {!disabled && (
              <StyledInfoRow onClick={() => setShowForm((prev) => !prev)} $isActive={showForm}>
                <BlueText>+ Pridėti reikšmę</BlueText>
              </StyledInfoRow>
            )}
            <InfoRow onClick={() => setsSowPopup(true)}>
              <BookIcon name={IconName.bookOpen} />
              <BlueText>Skaityti rodiklio aprašymą</BlueText>
            </InfoRow>
          </InfoRowContainer>
          {!disabled && showForm && (
            <Formik
              enableReinitialize={false}
              initialValues={{ date: undefined, value: undefined }}
              onSubmit={handleSubmit}
              validateOnChange={false}
            >
              {({ values, errors, setFieldValue }) => {
                return (
                  <FormContainer>
                    {viewOnly && (
                      <StyledDatePicker
                        value={values.date}
                        label={'Mėginio paėmimo data'}
                        name="indicator"
                        disabled={disabled}
                        onChange={(value) => setFieldValue('date', value)}
                        error={errors.date}
                        placeHolder={formatDate(yearRange.minDate)}
                        minDate={yearRange.minDate}
                        maxDate={maxAllowedDate}
                      />
                    )}
                    {isButton ? (
                      <StyledButtonGroup
                        options={['Taip', 'Ne']}
                        label={indicator.description}
                        onChange={(option) => setFieldValue('value', option)}
                        getOptionLabel={(option) => option}
                        disabled={disabled}
                        isSelected={(option) => option === values.value}
                      />
                    ) : (
                      <NumericInputContainer>
                        <StyledNumericTextField
                          value={values.value}
                          label={'Reikšmė'}
                          name="value"
                          onChange={(value) => setFieldValue('value', value)}
                          error={errors.value}
                          disabled={disabled}
                          digitsAfterComma={indicator.digitsAfterComma}
                        />
                        <Unit>{indicator.unit}</Unit>
                      </NumericInputContainer>
                    )}

                    <ButtonLine>
                      <Button
                        type="submit"
                        loading={isSubmitLoading}
                        disabled={isSubmitLoading || !values.value || disabled}
                      >
                        {'Pridėti'}
                      </Button>
                    </ButtonLine>
                  </FormContainer>
                );
              }}
            </Formik>
          )}

          <StyledTable maxHeight="300px" tableData={tableData} labels={labels} />

          <InfoPopUp setShowPopup={setsSowPopup} showPopup={showPopup} indicator={indicator} />
        </>
      )}
    </>
  );
};
const StyledTable = styled(Table)`
  max-width: 100%;
  td:last-child {
    width: auto !important;
  }
`
const NumericInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 300px;

  @media ${device.mobileL} {
    max-width: 100%;
  }
`;
const InfoRowContainer = styled.div<{$disabled:boolean}>`
  display: flex;
  justify-content:${({ $disabled }) => $disabled ? 'flex-end' : 'space-between'};
`
const FormContainer = styled(Form)`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;

  background: #f3f4f6;
  border-radius: 0 0 4px 4px;
  padding: 12px;
  margin-bottom: 12px;

  @media ${device.mobileL} {
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
  }
`;

const ButtonLine = styled.div`
  @media ${device.mobileL} {
    width: 100%;
    max-width: 100%;
  }
`;

const StyledButtonGroup = styled(ButtonsGroup)`
  max-width: 390px;
  @media ${device.mobileL} {
    max-width: 100%;
    width: 100%;
  }
`;

const StyledNumericTextField = styled(NumericTextField)`
  flex-grow: 1;
  max-width: none;
`;

const StyledDatePicker = styled(DateField)`
  width: 250px;
  @media ${device.mobileL} {
    max-width: 100%;
    width: 100%;
  }
`;

const StyledIcon = styled(Icon)<{ $isActive: boolean }>`
  transform: ${({ $isActive }) => ($isActive ? 'rotateX(180deg)' : '')};
  color: #cdd5df;
  font-size: 2.4rem;
  margin-right: 12px;
`;

const StyledIconInput = styled(Icon)<{ $isActive: boolean }>`
  position: relative;
  color: ${({ theme }) => theme.colors.text.active};
  font-size: 1.2rem;
  font-weight: 400;
  top: 4px;
`;

const Unit = styled.div`
  position: relative;
  top: 11px;
  flex-shrink: 0;
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const BookIcon = styled(Icon)`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.text.active};
`;

const StyledInfoRow = styled.div<{$isActive: boolean}>`
  display: flex;
  align-items: center;
  margin-top: 8px;
  padding: 8px 8px 12px 8px;
  gap: 4px;
  justify-content: flex-end;
  background-color: ${({ $isActive }) => ($isActive ? 'rgb(243, 244, 246)': '')};
  border-radius: 4px 4px 0 0;

`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  padding: 8px 8px 12px 8px;
  gap: 4px;
  justify-content: flex-end;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  
`;

const Expander = styled.div<{ $isActive: boolean, $hasData: number}>`
  padding: 18px 14px;
  background-color: ${({ $isActive, theme, $hasData }) => ($isActive ? theme.colors.primary : ($hasData ? '#e5e7eb' : '#f3f4f6'))};
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;

`;

const InputExpander = styled.div<{ $isActive: boolean }>`
  padding: 18px 14px;
  background-color:#f3f4f6;
  border-radius: 4px 4px 0 0;
  display: flex;
  gap: 5px;
  justify-content: start;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.active};

`;

const IndicatorValue = styled.div<{ $isActive: boolean, $hasData: number  }>`
  font-weight: ${({$hasData})  => ($hasData !== 0 ? '600' : '400')};
  color: ${({ $isActive, theme }) => (!$isActive ? theme.colors.text.primary : 'white')};
`;

const Delete = styled.div<{ $isActive: boolean }>`
  margin-left: 10px;
  color: ${({ $isActive, theme }) => (!$isActive ? theme.colors.text.active : 'white')};
`;



export default IndicatorContainer;
