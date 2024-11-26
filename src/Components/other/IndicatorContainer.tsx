import { Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import { useState } from 'react';
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

const IndicatorContainer = ({
  indicator,
  disabled,
  onDelete,
  yearRange,
  updateIndicatorTable,
  initialOpen = false,
}: {
  yearRange: {
    minDate: Date;
    maxDate: Date;
  };
  initialOpen?: boolean;
  updateIndicatorTable: (id: string) => Promise<void>;
  indicator: IndicatorOption;
  disabled: boolean;
  onDelete: (id: string) => void;
}) => {
  const [open, setOpen] = useState(initialOpen);
  const { id = '' } = useParams();
  const [showPopup, setsSowPopup] = useState(false);

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

  const tableData =
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

  const handleSubmit = async (values: { date: any; value: any }, { resetForm }) => {
    const params = [
      {
        Rodiklis: indicator.id,
        Data: formatDate(values.date),
        Reiksme: isButton ? (values.value === 'Taip' ? 1 : 0) : values.value,
      },
    ];

    await updateDeclarationValuesMutation(params);
    resetForm();
  };

  const labels = {
    date: 'Mėginio paėmimo data',
    value: isButton ? indicator.description : 'Reikšmė',
    delete: '',
  };

  const showTable = !isEmpty(tableData);

  return (
    <>
      <Expander onClick={() => setOpen(!open)} $isActive={open}>
        <TitleContainer>
          <IndicatorValue $isActive={open}>
            {`${getIndicatorLabel(indicator)} ${tableData.length ? `(${tableData.length})` : ''}`}{' '}
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
          <InfoRow onClick={() => setsSowPopup(true)}>
            <BookIcon name={IconName.bookOpen} />
            <BlueText>Skaityti rodiklio aprašymą</BlueText>
          </InfoRow>
          <Formik
            enableReinitialize={true}
            initialValues={{ date: undefined, value: undefined }}
            onSubmit={handleSubmit}
            validateOnChange={false}
          >
            {({ values, errors, setFieldValue }) => {
              return (
                <FormContainer>
                  <StyledDatePicker
                    value={values.date}
                    label={'Mėginio paėmimo data'}
                    name="indicator"
                    disabled={disabled}
                    onChange={(value) => setFieldValue('date', value)}
                    error={errors.date}
                    placeHolder={formatDate(yearRange.minDate)}
                  />
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
                    <StyledNumericTextField
                      value={values.value}
                      label={'Reikšmė'}
                      name="value"
                      onChange={(value) => setFieldValue('value', value)}
                      rightIcon={<Unit>{indicator.unit}</Unit>}
                      error={errors.value}
                      disabled={disabled}
                      digitsAfterComma={indicator.digitsAfterComma}
                    />
                  )}

                  <ButtonLine>
                    <Button
                      type="submit"
                      loading={isSubmitLoading}
                      disabled={isSubmitLoading || !values.value || !values.date || disabled}
                    >
                      {'Pridėti rezultatą'}
                    </Button>
                  </ButtonLine>
                </FormContainer>
              );
            }}
          </Formik>
          {showTable && <Table maxHeight="300px" tableData={tableData} labels={labels} />}
          <InfoPopUp setShowPopup={setsSowPopup} showPopup={showPopup} indicator={indicator} />
        </>
      )}
    </>
  );
};

const FormContainer = styled(Form)`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;

  background: #f3f4f6;
  border-radius: 4px;
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
  max-width: 300px;
  @media ${device.mobileL} {
    max-width: 100%;
    width: 100%;
  }
`;

const StyledNumericTextField = styled(NumericTextField)`
  max-width: 300px;
  @media ${device.mobileL} {
    max-width: 100%;
    width: 100%;
  }
`;

const StyledDatePicker = styled(DateField)`
  max-width: 300px;
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

const Unit = styled.div`
  font-size: 1.4rem;
  margin-right: 16px;

  color: ${({ theme }) => theme.colors.text.primary};
`;

const BookIcon = styled(Icon)`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.text.active};
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin: 12px 0;
  gap: 4px;
  justify-content: flex-end;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Expander = styled.div<{ $isActive: boolean }>`
  padding: 18px 14px;
  background-color: ${({ $isActive, theme }) => ($isActive ? theme.colors.primary : '#f3f4f6')};
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;

const IndicatorValue = styled.div<{ $isActive: boolean }>`
  font-weight: 600;
  color: ${({ $isActive, theme }) => (!$isActive ? theme.colors.text.primary : 'white')};
`;

const Delete = styled.div<{ $isActive: boolean }>`
  margin-left: 10px;
  color: ${({ $isActive, theme }) => (!$isActive ? theme.colors.text.active : 'white')};
`;



export default IndicatorContainer;
