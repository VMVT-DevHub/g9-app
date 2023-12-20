import { Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { device } from '../../styles';
import { Exceeded, ServerDiscrepancy } from '../../types';
import { getOptions, getYesNo } from '../../utils/functions';
import { validationTexts } from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
import ButtonsGroup from '../buttons/ButtonGroup';
import NumericTextField from '../fields/NumericTextField';
import SelectField from '../fields/SelectField';
import TextAreaField from '../fields/TextAreaField';
import InfoContainer from '../layouts/InfoContainer';
import PopUpWithTitles from '../layouts/PopUpWithTitle';
import { BlueText, Grid } from '../other/CommonStyles';
import Table from '../Table/Table';

const labels = {
  dateFrom: 'Data nuo',
  dateTo: 'Data iki',
  max: 'Maksimali reikšmė',
  edit: '',
};

export const exceededSchema = Yup.object().shape({
  LOQValue: Yup.string().required(validationTexts.requireText),
  userCount: Yup.string().required(validationTexts.requireText),
  isBelowLOQ: Yup.boolean().required(validationTexts.requireSelect),
  type: Yup.number().required(validationTexts.requireText),
  status: Yup.number().required(validationTexts.requireSelect),
  notes: Yup.string().required(validationTexts.requireText),
  insignificant: Yup.boolean().required(validationTexts.requireSelect),
  insignificantDescription: Yup.number().when(['insignificant'], (insignificant: any, schema) => {
    if (insignificant[0]) {
      return schema.required(validationTexts.requireSelect);
    }
    return schema.nullable();
  }),
});

const ExceededContainer = ({
  exceeded,
  unit,
  options,
  onUpdate,
  onUpdateAll,
}: {
  exceeded: Exceeded[];
  unit: string;
  options?: ServerDiscrepancy['Virsijimas']['Lookup'];
  onUpdate: (item: Exceeded) => void;
  onUpdateAll: (item: Exceeded) => void;
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [currentExceeded, setCurrentExceeded] = useState<Exceeded | any>({});

  const typeOptions = getOptions(options?.Tipas);
  const statusOptions = getOptions(options?.Statusas);
  const typeLabels = options?.Tipas;
  const statusLabels = options?.Statusas;

  const mapValues =
    exceeded?.map((item) => {
      return {
        ...item,
        max: `${item.max} ${unit}`,
        edit: (
          <BlueText
            onClick={() => {
              setCurrentExceeded(item);
              setShowPopup(true);
            }}
          >
            {item.notes ? 'Redaguoti' : 'Įvesti pastabas'}
          </BlueText>
        ),
      };
    }) || [];
  const handleSubmit = (values: Exceeded) => {
    values.approved = true;
    setShowPopup(false);

    if (isEmpty(currentExceeded)) {
      return onUpdateAll(values);
    }

    onUpdate(values);
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
          <div>
            <Button height={40} variant={ButtonColors.ALL} onClick={() => setShowPopup(true)}>
              Įvesti visiems
            </Button>
          </div>
          <StyledTable tableData={mapValues} labels={labels} />
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
                  <TextAreaField
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
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
`;

export default ExceededContainer;
