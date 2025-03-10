import { Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import * as Yup from 'yup';
import { device } from '../../styles';
import { Exceeded, ServerDiscrepancy } from '../../types';
import api from '../../utils/api';
import { formatDate, getOptions, getYesNo } from '../../utils/functions';
import { useSuccess } from '../../utils/hooks';
import { validationTexts } from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
import ButtonsGroup from '../buttons/ButtonGroup';
import DateField from '../fields/DateField';
import NumericTextField from '../fields/NumericTextField';
import SelectField from '../fields/SelectField';
import TextAreaField from '../fields/TextAreaField';
import InfoContainer from '../layouts/InfoContainer';
import PopUpWithTitles from '../layouts/PopUpWithTitle';
import { BlueText, Grid, TableActionContainer } from '../other/CommonStyles';
import Loader from '../other/Loader';
import Table from '../Table/Table';

export const extendedExceededSchema = Yup.object().shape({
  startDate: Yup.string().required(validationTexts.requireText),
  endDate: Yup.string().required(validationTexts.requireText),

  LOQValue: Yup.string().when(['isBelowLOQ'], (isBelowLOQ: any, schema) => {
    if (isBelowLOQ[0]) {
      return schema.required(validationTexts.requireText).min(1, validationTexts.positiveNumber);
    }
    return schema.nullable();
  }),
  userCount: Yup.number()
    .required(validationTexts.requireText)
    .min(1, validationTexts.positiveNumber),
  reason: Yup.number().required(validationTexts.requireText),
  action: Yup.string().required(validationTexts.requireText),
  isBelowLOQ: Yup.boolean().required(validationTexts.requireSelect),
  type: Yup.number().required(validationTexts.requireText),
  status: Yup.number().required(validationTexts.requireSelect),
  insignificant: Yup.boolean().required(validationTexts.requireSelect),
  insignificantDescription: Yup.string().when(['insignificant'], (insignificant: any, schema) => {
    if (insignificant[0]) {
      return schema
        .required(validationTexts.requireText)
        .test('iDes', validationTexts.shortDescription, (val) => val.length > 5);
    }
    return schema.nullable();
  }),
});

export const exceededSchema = Yup.object().shape({
  startDate: Yup.string().required(validationTexts.requireText),
  endDate: Yup.string().required(validationTexts.requireText),
  reason: Yup.number().required(validationTexts.requireText),
  action: Yup.string().required(validationTexts.requireText),
  type: Yup.number().required(validationTexts.requireText),
});

const mapPayload = (item) => {
  return {
    ID: item.id,
    Nereiksmingas: item.insignificant,
    Priezastis: item?.reason || null,
    Veiksmas: item?.action,
    Pradzia: formatDate(item?.startDate),
    Pabaiga: formatDate(item?.endDate),
    NereiksmApras: item.insignificantDescription || null,
    Zmones: parseInt(`${item.userCount}`),
    Tipas: parseInt(`${item.type}`),
    LOQVerte: item.isBelowLOQ,
    LOQReiksme: parseInt(`${item.LOQValue}`),
    Statusas: parseInt(`${item.status}`),
    Patvirtinta: true,
    Pastabos: item.notes,
  };
};

const ExceededContainer = ({
  exceeded,
  unit,
  options,
  yearRange,
  description,
  groupId,
  isDeclared,
}: {
  description: string;
  yearRange: any;
  exceeded: Exceeded[];
  unit: string;
  options?: ServerDiscrepancy['Virsijimas']['Lookup'];
  groupId?: any;
  isDeclared: boolean;
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [currentExceeded, setCurrentExceeded] = useState<Exceeded | any>({});
  const { id = '' } = useParams();
  const { handleSuccess } = useSuccess();
  const isButton = unit === 'T/N';
  const extendedFormTypes = [1, 2];
  const isExtendedForm = extendedFormTypes.includes(groupId);

  const [rowLoadingId, setRowLoadingId] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const { mutateAsync: updateRepeat } = useMutation(
    (values: any) => api.updateDiscrepancies(id, values),
    {},
  );

  const handleUpdateExceeded = async (values) => {
    setRowLoadingId(values.id);
    setDisabled(true);
    await updateRepeat({ Virsijimas: [mapPayload(values)] });
    setDisabled(false);
    setRowLoadingId('');
    handleSuccess();
  };

  const handleUpdateAllRepeat = async (values) => {
    setDisabled(true);
    setButtonLoading(true);
    await Promise.all(
      exceeded.map(async (item) => {
        await updateRepeat({ Virsijimas: [mapPayload({ ...item, ...values, id: item.id })] });
      }),
    );
    handleSuccess();
    setDisabled(false);
    setButtonLoading(false);
  };

  const actionOptions = getOptions(options?.Veiksmas);
  const reasonOptions = getOptions(options?.Priezastis);
  const actionLabels = options?.Veiksmas;
  const reasonLabels = options?.Priezastis;
  const typeOptions = getOptions(options?.Tipas);
  const statusOptions = getOptions(options?.Statusas);
  const typeLabels = options?.Tipas;
  const statusLabels = options?.Statusas;

  const handleRenderApprove = (item) => {
    if (rowLoadingId == item.id) {
      return (
        <LoaderComponent>
          <Loader size={20} />;
        </LoaderComponent>
      );
    }
    if(isDeclared) return;
    return (
      <BlueText
        disabled={disabled}
        onClick={() => {
          setCurrentExceeded(item);
          setShowPopup(true);
        }}
      >
        {item.approved ? 'Redaguoti' : 'Įvesti pastabas'}
      </BlueText>
    );
  };

  const mapValues =
    exceeded?.map((item) => {
      return {
        ...item,
        max: `${item.max} ${!isButton ? unit : ''}`,

        edit: <TableActionContainer>{handleRenderApprove(item)}</TableActionContainer>,
      };
    }) || [];
  const handleSubmit = (values: Exceeded) => {
    setShowPopup(false);

    if (isEmpty(currentExceeded)) {
      return handleUpdateAllRepeat(values);
    }

    handleUpdateExceeded(values);
  };
  const exceededMapValues = exceeded?.map((item) => {
    return (
      <ExceededMapContainer key = {item.id}>
        <p>
          <b>Maksimali reikšmė:</b> {item.max}
        </p>
        {item.insignificant && (
            <p>
              <b>Ar viršijimas nereikšmingas:</b> {item.insignificant ? 'Taip, ' : 'Ne'}
              {item.insignificantDescription && item.insignificantDescription}
            </p>
        )}
        {item.userCount && (
          <>
            <p>
              <b>Viršijimo paveiktų žmonių skaičius:</b> {item.userCount}
            </p>
          </>
        )}
        {item.type && (
          <>
            <p>
              <b>Mėginių ėmimo vieta:</b> {typeLabels && typeLabels[item.type]}
            </p>
          </>
        )}
        {item.isBelowLOQ && (
          <>
            <p>
              <b>Ar nustatyta vertė žemiau nei LOQ?:</b> {item.isBelowLOQ ? 'Taip,' : 'Ne'}{' '}
              {item.LOQValue && 'vertė: ' + item.LOQValue}
            </p>
          </>
        )}
        {item.reason && (
          <>
            <p>
              <b>Priežastis:</b> {reasonLabels && reasonLabels[item.reason]}
            </p>
          </>
        )}
        {item.action && (
          <>
            <p>
              <b>Taisomasis veiksmas:</b> {actionLabels && actionLabels[item.action]}
            </p>
          </>
        )}
        {item.startDate && (
          <>
            <p>
              <b>Taisomojo veiksmo trukmė:</b> nuo {item.startDate} iki {item.endDate}
            </p>
          </>
        )}
        {item.status && (
          <>
            <p>
              <b>Stebėjimo statusas:</b> {statusLabels && statusLabels[item.status]}
            </p>
          </>
        )}
        {item.notes && (
          <>
            <p>
              <b>Papildoma informacija:</b> {item.notes}
            </p>
          </>
        )}
      </ExceededMapContainer>
    );
  });
  const labels = {
    dateFrom: 'Data nuo',
    dateTo: 'Data iki',
    max: isButton ? description : 'Maksimali reikšmė',
    edit: '',
  };
  const validationSchema = isExtendedForm ? extendedExceededSchema : exceededSchema;
  return (
    <>
      <TitleContainer>
        <ContainerTitle>Viršijamos reikšmės</ContainerTitle>
        {isDeclared
            ? <Description>Nurodytais laikotarpiais mėginių reikšmės viršijo nustatytas ribas.</Description>
            : <Description>Nurodytais laikotarpiais mėginių reikšmės viršijo nustatytas ribas. Įveskite pastabas.</Description>}
        <TableContainer>
          <StyledTable tableData={mapValues} labels={labels} />
        </TableContainer>
      </TitleContainer>
      {isDeclared && exceededMapValues}
      <PopUpWithTitles
        title={'Įvesti pastabas'}
        visible={showPopup}
        onClose={() => {
          setCurrentExceeded({});
          setShowPopup(false);
        }}
        canClickOut={false}
      >
        <Formik
          enableReinitialize={true}
          initialValues={currentExceeded || ({} as Exceeded)}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validateOnChange={false}
        >
          {({ values, errors, setFieldValue }) => {
            return (
              <FormContainer>
                {isExtendedForm && (
                  <Grid $columns={2}>
                    <ButtonsGroup
                      showError={true}
                      options={[true, false]}
                      label={'Ar nereikšmingas viršijimas?'}
                      onChange={(option) => {
                        setFieldValue('insignificant', option);
                        setFieldValue('insignificantDescription', '');
                      }}
                      getOptionLabel={getYesNo}
                      error={errors?.insignificant}
                      isSelected={(option) => option === values?.insignificant}
                    />
                  </Grid>
                )}

                {values.insignificant && (
                  <Grid $columns={1}>
                    <TextAreaField
                      label="Nereikšmingo viršijimo pagrindimas"
                      value={values?.insignificantDescription}
                      error={errors?.insignificantDescription}
                      onChange={(value) => setFieldValue('insignificantDescription', value)}
                    />
                  </Grid>
                )}

                <Grid $columns={2}>
                  {isExtendedForm && (
                    <NumericTextField
                      value={values?.userCount}
                      label={'Viršijimo paveiktų žmonių skaičius'}
                      name="value"
                      onChange={(value) => setFieldValue('userCount', value)}
                      error={errors?.userCount}
                    />
                  )}
                  <SelectField
                    options={typeOptions}
                    showError={true}
                    getOptionLabel={(option) => (typeLabels ? typeLabels[option] : '-')}
                    value={values?.type}
                    label={'Mėginių ėmimo vietos tipas'}
                    name="type"
                    error={errors?.type}
                    onChange={(value) => setFieldValue('type', value)}
                  />
                </Grid>
                {isExtendedForm && (
                  <>
                    <Grid $columns={2}>
                      <ButtonsGroup
                        options={[true, false]}
                        showError={true}
                        label={'Ar nustatyta vertė žemiau nei LOQ?'}
                        onChange={(option) => {
                          setFieldValue('isBelowLOQ', option);
                        }}
                        error={errors?.isBelowLOQ}
                        getOptionLabel={getYesNo}
                        isSelected={(option) => option === values?.isBelowLOQ}
                      />
                    </Grid>
                    {values?.isBelowLOQ && (
                      <Grid $columns={1}>
                        <NumericTextField
                          label="Kiekybinio nustatymo ribos LOQ reikšmė"
                          value={values?.LOQValue}
                          error={errors?.LOQValue}
                          onChange={(value) => setFieldValue('LOQValue', value)}
                        />
                      </Grid>
                    )}
                  </>
                )}
                <Grid $columns={2}>
                  <SelectField
                    options={reasonOptions}
                    showError={true}
                    getOptionLabel={(option) => (reasonLabels ? reasonLabels[option] : '-')}
                    value={values?.reason}
                    label={'Priežastis'}
                    error={errors?.reason}
                    onChange={(value) => setFieldValue('reason', value)}
                  />
                  <SelectField
                    options={actionOptions}
                    showError={true}
                    getOptionLabel={(option) => (actionLabels ? actionLabels[option] : '-')}
                    value={values?.action}
                    label={'Taisomasis veiksmas'}
                    error={errors?.action}
                    onChange={(value) => setFieldValue('action', value)}
                  />
                  <DateField
                    value={values.startDate}
                    label={'Taisomojo veiksmo pradžia'}
                    onChange={(value) => setFieldValue('startDate', value)}
                    error={errors.startDate}
                    placeHolder={formatDate(yearRange.minDate)}
                    maxDate={values.endDate || yearRange.maxDate}
                    minDate={yearRange.minDate}
                  />
                  <DateField
                    value={values.endDate}
                    label={'Taisomojo veiksmo pabaiga'}
                    onChange={(value) => setFieldValue('endDate', value)}
                    error={errors.endDate}
                    placeHolder={formatDate(yearRange.minDate)}
                    maxDate={yearRange.maxDate}
                    minDate={values.startDate || yearRange.minDate}
                  />
                </Grid>
                {isExtendedForm && (
                  <Grid $columns={1}>
                    <SelectField
                      options={statusOptions}
                      showError={true}
                      getOptionLabel={(option) => (statusLabels ? statusLabels[option] : '-')}
                      value={values?.status}
                      label={'Stebėjimo statusas'}
                      name="status"
                      onChange={(value) => setFieldValue('status', value)}
                      error={errors?.status}
                    />
                  </Grid>
                )}

                <Grid $columns={1}>
                  <TextAreaField
                    label="Papildoma informacija"
                    value={values?.notes}
                    error={errors?.notes}
                    onChange={(value) => setFieldValue('notes', value)}
                  />
                </Grid>
                <ButtonRow>
                  <ButtonInnerRow>
                    <Button
                      type="button"
                      onClick={() => setShowPopup(false)}
                      variant={ButtonColors.TRANSPARENT}
                    >
                      {'Atšaukti'}
                    </Button>
                    <Button type="submit">{'Pateikti'}</Button>
                  </ButtonInnerRow>
                </ButtonRow>
              </FormContainer>
            );
          }}
        </Formik>
      </PopUpWithTitles>
    </>
  );
};
const ContainerTitle = styled.div`
  font-weight: bold;
  line-height: 22px;
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Description = styled.div`
  font-size: 1.4rem;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.text.secondary};
  opacity: 1;
  @media ${device.mobileL} {
    margin: 16px 0;
  }
`;
const TitleContainer = styled.div`
  padding-top: 32px;
  
`;

const ExceededMapContainer = styled.div`
  margin: 0;
`;

const StyledTable = styled(Table)`
  max-width: 100%;
  th {
    min-width: auto !important;
  }
  td:last-child {
    width: auto !important;
  }

  @media ${device.mobileL} {
    width: 100%;
  }
  
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
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  overflow-x: auto;
`;

const TableContainer = styled.div`
  min-width: 0;
  overflow-x: auto;
  padding-top: 16px;
`;

const LoaderComponent = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default ExceededContainer;
