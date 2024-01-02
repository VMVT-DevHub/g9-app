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
import { getOptions, getYesNo } from '../../utils/functions';
import { useSuccess } from '../../utils/hooks';
import { validationTexts } from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
import ButtonsGroup from '../buttons/ButtonGroup';
import NumericTextField from '../fields/NumericTextField';
import SelectField from '../fields/SelectField';
import TextAreaField from '../fields/TextAreaField';
import InfoContainer from '../layouts/InfoContainer';
import PopUpWithTitles from '../layouts/PopUpWithTitle';
import { BlueText, Grid } from '../other/CommonStyles';
import Loader from '../other/Loader';
import Table from '../Table/Table';

export const exceededSchema = Yup.object().shape({
  LOQValue: Yup.number()
    .required(validationTexts.requireText)
    .min(1, validationTexts.positiveNumber),
  userCount: Yup.number()
    .required(validationTexts.requireText)
    .min(1, validationTexts.positiveNumber),
  isBelowLOQ: Yup.boolean().required(validationTexts.requireSelect),
  type: Yup.number().required(validationTexts.requireText),
  status: Yup.number().required(validationTexts.requireSelect),
  notes: Yup.string()
    .required(validationTexts.requireText)
    .test('notes', validationTexts.shortDescription, (val) => val.length > 5),
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

const mapPayload = (item) => {
  return {
    ID: item.id,
    Nereiksmingas: item.insignificant,
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
  description,
}: {
  description: string;
  exceeded: Exceeded[];
  unit: string;
  options?: ServerDiscrepancy['Virsijimas']['Lookup'];
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [currentExceeded, setCurrentExceeded] = useState<Exceeded | any>({});
  const { id = '' } = useParams();
  const { handleSuccess } = useSuccess();

  const isButton = unit === 'T/N';

  const [rowLoadingId, setRowLoadingId] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const { mutateAsync: updateRepeat } = useMutation(
    (values: any) => api.updateDiscrepancies(id, values),
    {},
  );

  const handleUpdateRepeat = async (values) => {
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

    return (
      <BlueText
        disabled={disabled}
        onClick={() => {
          setCurrentExceeded(item);
          setShowPopup(true);
        }}
      >
        {item.notes ? 'Redaguoti' : 'Įvesti pastabas'}
      </BlueText>
    );
  };

  const mapValues =
    exceeded?.map((item) => {
      return {
        ...item,
        max: `${item.max} ${!isButton ? unit : ''}`,
        edit: handleRenderApprove(item),
      };
    }) || [];
  const handleSubmit = (values: Exceeded) => {
    setShowPopup(false);

    if (isEmpty(currentExceeded)) {
      return handleUpdateAllRepeat(values);
    }

    handleUpdateRepeat(values);
  };

  const labels = {
    dateFrom: 'Data nuo',
    dateTo: 'Data iki',
    max: isButton ? description : 'Maksimali reikšmė',
    edit: '',
  };

  return (
    <>
      <InfoContainer
        title={'Viršijamos reikšmės'}
        description={
          'Nurodytais laikotarpiais mėginių reikšmės viršijo nustatytas ribas. Įveskite pastabas.'
        }
      >
        <Column>
          <ButtonContainer>
            <div>
              <Button
                disabled={disabled || buttonLoading}
                loading={buttonLoading}
                height={40}
                variant={ButtonColors.ALL}
                onClick={() => setShowPopup(true)}
              >
                Įvesti visiems
              </Button>
            </div>
          </ButtonContainer>
          <TableContainer>
            <StyledTable tableData={mapValues} labels={labels} />
          </TableContainer>
        </Column>
      </InfoContainer>
      <PopUpWithTitles
        title={'Įvesti pastabas'}
        visible={showPopup}
        onClose={() => {
          setCurrentExceeded({});
          setShowPopup(false);
        }}
      >
        <Formik
          enableReinitialize={true}
          initialValues={currentExceeded || ({} as Exceeded)}
          onSubmit={handleSubmit}
          validationSchema={exceededSchema}
          validateOnChange={false}
        >
          {({ values, errors, setFieldValue }) => {
            return (
              <FormContainer>
                <Grid $columns={2}>
                  <ButtonsGroup
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
                  <NumericTextField
                    value={values?.userCount}
                    label={'Viršijimo paveiktų žmonių skaičius'}
                    name="value"
                    onChange={(value) => setFieldValue('userCount', value)}
                    error={errors?.userCount}
                  />

                  <SelectField
                    options={typeOptions}
                    showError={false}
                    getOptionLabel={(option) => (typeLabels ? typeLabels[option] : '-')}
                    value={values?.type}
                    label={'Mėginių ėmimo vietos tipas'}
                    name="type"
                    error={errors?.type}
                    onChange={(value) => setFieldValue('type', value)}
                  />
                </Grid>
                <Grid $columns={2}>
                  <ButtonsGroup
                    options={[true, false]}
                    label={'Ar nustatyta vertė žemiau nei LOQ?'}
                    onChange={(option) => {
                      setFieldValue('isBelowLOQ', option);
                    }}
                    error={errors?.isBelowLOQ}
                    getOptionLabel={getYesNo}
                    isSelected={(option) => option === values?.isBelowLOQ}
                  />
                </Grid>
                <Grid $columns={1}>
                  <NumericTextField
                    label="Kiekybinio nustatymo ribos LOQ reikšmė"
                    value={values?.LOQValue}
                    error={errors?.LOQValue}
                    onChange={(value) => setFieldValue('LOQValue', value)}
                  />
                </Grid>
                <Grid $columns={1}>
                  <SelectField
                    options={statusOptions}
                    showError={false}
                    getOptionLabel={(option) => (statusLabels ? statusLabels[option] : '-')}
                    value={values?.status}
                    label={'Stebėjimo statusas'}
                    name="status"
                    onChange={(value) => setFieldValue('status', value)}
                    error={errors?.status}
                  />
                </Grid>

                <Grid $columns={1}>
                  <TextAreaField
                    label="Pastabos"
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

const StyledTable = styled(Table)`
  width: 550px;

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
