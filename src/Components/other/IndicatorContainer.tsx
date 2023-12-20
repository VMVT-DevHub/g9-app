import { Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { IndicatorOption } from '../../types';
import api from '../../utils/api';
import { formatDate, handleSuccessToast, inRange } from '../../utils/functions';
import Button from '../buttons/Button';
import ButtonsGroup from '../buttons/ButtonGroup';
import DateField from '../fields/DateField';
import NumericTextField from '../fields/NumericTextField';
import Table from '../Table/Table';
import { BlueText, DangerText } from './CommonStyles';
import Icon, { IconName } from './Icons';

const labels = {
  date: 'Mėginio paėmimo data',
  value: 'Reikšmė',
  delete: '',
};

const IndicatorContainer = ({
  indicator,
  disabled,
}: {
  indicator: IndicatorOption;
  disabled: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const { id = '' } = useParams();
  const queryClient = useQueryClient();

  const isButton = indicator.unit === 'T/N';

  const tableData =
    indicator.tableData?.map((item) => {
      const value = `${item.value} ${indicator.unit}`;

      return {
        ...item,
        value: isButton ? (
          item.value === 0 ? (
            'Ne'
          ) : (
            'Taip'
          )
        ) : inRange(item.value, indicator.min, indicator.max) ? (
          value
        ) : (
          <DangerText>{value}</DangerText>
        ),
        ...(!disabled && {
          delete: <BlueText onClick={() => deleteUserMutation(item.id)}>Trinti</BlueText>,
        }),
      };
    }) || [];

  const { mutateAsync: updateDeclarationValuesMutation, isLoading: isSubmitLoading } = useMutation(
    (values: any) => api.postValue(id, values),
    {
      onError: () => {},
      onSuccess: async () => {
        await queryClient.invalidateQueries(['values']);
        handleSuccessToast();
      },
      retry: false,
    },
  );

  const { mutateAsync: deleteUserMutation } = useMutation(
    (valueId: any) => api.deleteValue(id, [valueId]),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['values']);
        handleSuccessToast();
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

  return (
    <>
      <Expander onClick={() => setOpen(!open)} $isActive={open}>
        <IndicatorValue $isActive={open}>{indicator?.name}</IndicatorValue>
        <StyledIcon $isActive={open} name={IconName.dropdownArrow} />
      </Expander>
      {open && (
        <>
          <Formik
            enableReinitialize={true}
            initialValues={{ date: undefined, value: undefined }}
            onSubmit={handleSubmit}
            validateOnChange={false}
          >
            {({ values, errors, setFieldValue }) => {
              return (
                <FormContainer>
                  <DateField
                    value={values.date}
                    label={'Mėginio paėmimo data'}
                    name="indicator"
                    onChange={(value) => setFieldValue('date', value)}
                    error={errors.date}
                  />
                  {isButton ? (
                    <ButtonsGroup
                      options={['Taip', 'Ne']}
                      label={indicator.description}
                      onChange={(option) => setFieldValue('value', option)}
                      getOptionLabel={(option) => option}
                      isSelected={(option) => option === values.value}
                    />
                  ) : (
                    <NumericTextField
                      value={values.value}
                      label={'Reikšmė'}
                      name="value"
                      onChange={(value) => setFieldValue('value', value)}
                      rightIcon={<Unit>{indicator.unit}</Unit>}
                      error={errors.value}
                      digitsAfterComma={indicator.digitsAfterComma}
                    />
                  )}

                  <Button
                    type="submit"
                    loading={isSubmitLoading}
                    disabled={isSubmitLoading || !values.value || !values.date}
                  >
                    {'Pridėti rodiklį'}
                  </Button>
                </FormContainer>
              );
            }}
          </Formik>
          {!isEmpty(tableData) && <Table tableData={tableData} labels={labels} />}
        </>
      )}
    </>
  );
};

const FormContainer = styled(Form)`
  width: 100%;
  display: grid;
  grid-template-columns: 250px 1fr 150px;
  gap: 16px;
  align-items: flex-end;
  gap: 16px;
  background: #f3f4f6;
  border-radius: 4px;
  padding: 12px;
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

const Expander = styled.div<{ $isActive: boolean }>`
  padding: 18px 14px;
  background-color: ${({ $isActive, theme }) => ($isActive ? theme.colors.primary : '#f3f4f6')};
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;

const IndicatorValue = styled.div<{ $isActive: boolean }>`
  color: ${({ $isActive, theme }) => (!$isActive ? theme.colors.text.primary : 'white')};
`;

export default IndicatorContainer;
