import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Button, { ButtonColors } from '../Components/buttons/Button';
import ExceededContainer from '../Components/containers/ExceededContainer';
import LackContainer from '../Components/containers/LackContainer';
import RepeatContainer from '../Components/containers/RepeatContainer';
import { PageContainer, Title } from '../Components/other/CommonStyles';
import Icon, { IconName } from '../Components/other/Icons';
import InfoRow from '../Components/other/InfoRow';
import { theme } from '../styles';
import {
  Exceeded,
  IndicatorOption,
  IndicatorOptionWithDiscrepancies,
  ServerDiscrepancy,
} from '../types';
import api from '../utils/api';
import { handleSuccessToast } from '../utils/functions';
import { useIndicators } from '../utils/hooks';
import { slugs } from '../utils/routes';

export enum IndicatorStatus {
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  NOT_CHECKED = 'NOT_CHECKED',
}

const indicatorColors = {
  [IndicatorStatus.APPROVED]: theme.colors.success,
  [IndicatorStatus.ACTIVE]: theme.colors.text.active,
  [IndicatorStatus.NOT_CHECKED]: theme.colors.grey,
};

const getUniqueIndicatorIds = (
  discrepancies?: ServerDiscrepancy,
  indicatorOptions?: IndicatorOption[],
): IndicatorOptionWithDiscrepancies[] => {
  if (!discrepancies || !indicatorOptions) return [];

  const indicators: any = {};

  discrepancies.Kartojasi.Data.forEach((item) => {
    indicators[item[1]] = {
      ...indicators[item[1]],
      repeats: indicators[item[1]]?.repeats || [],
    };

    indicators[item[1]].repeats.push({
      id: item[0],
      date: item[2],
      value: item[3],
      approved: item[4],
    });
  });

  discrepancies.Trukumas.Data.forEach((item) => {
    indicators[item[1]] = {
      ...indicators[item[1]],
      lack: {
        id: item[0],
        notes: item[6] || '',
      },
    };
  });

  discrepancies.Virsijimas.Data.forEach((item) => {
    indicators[item[1]] = {
      ...indicators[item[1]],
      exceeded: indicators?.[item[1]]?.exceeded || [],
    };

    indicators[item[1]].exceeded.push({
      id: item[0],
      dateFrom: item[2],
      dateTo: item[3],
      max: item[4],
      insignificant: item[6],
      insignificantDescription: item[7],
      userCount: item[8],
      type: item[9],
      isBelowLOQ: item[10],
      LOQValue: item[11],
      status: item[12],
      approved: item[13],
      notes: item[14],
    });
  });

  return indicatorOptions.reduce((filteredIndicators: any[], currentIndicator) => {
    if (indicators[currentIndicator.id]) {
      filteredIndicators.push({ ...currentIndicator, data: indicators[currentIndicator.id] });
    }

    return filteredIndicators;
  }, []);
};

const mapSubmitValues = (values: IndicatorOptionWithDiscrepancies[]) => {
  const params: any = {
    Virsijimas: [],
    Kartojasi: [],
    Trukumas: [],
  };

  values.forEach((indicator) => {
    if (indicator.data.exceeded) {
      params.Virsijimas = [
        ...params.Virsijimas,
        ...indicator.data.exceeded?.map((item) => {
          return {
            ID: item.id,
            Nereiksmingas: item.insignificant,
            NereiksmApras: item.insignificantDescription,
            Zmones: parseInt(`${item.userCount}`),
            Tipas: parseInt(`${item.type}`),
            LOQVerte: item.isBelowLOQ,
            LOQReiksme: parseInt(`${item.LOQValue}`),
            Statusas: parseInt(`${item.status}`),
            Patvirtinta: item.approved,
            Pastabos: item.notes,
          };
        }),
      ];
    }

    if (indicator.data.repeats) {
      params.Kartojasi = [
        ...params.Kartojasi,
        ...indicator.data.repeats?.map((item) => {
          return { ID: item.id, Patvirtinta: item.approved, Pastabos: '.' };
        }),
      ];
    }

    if (indicator.data.lack) {
      params.Trukumas.push({
        ID: indicator.data.lack?.id,
        KitasDaznumas: true,
        Patvirtinta: !!indicator.data.lack?.notes,
        Pastabos: indicator.data.lack?.notes.toString(),
      });
    }
  });

  return params;
};

const handleIsApproved = (indicator: IndicatorOptionWithDiscrepancies) => {
  const isApproved =
    (!indicator?.data?.exceeded || indicator?.data?.exceeded?.every((item) => item.approved)) &&
    (!indicator?.data?.repeats || indicator?.data?.repeats?.every((item) => item.approved)) &&
    (!indicator?.data?.lack || indicator?.data?.lack?.notes);

  return isApproved;
};

const Discrepancies = () => {
  const { businessPlaceId = '', id = '' } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeIndicator, setActiveIndicator] = useState<
    IndicatorOptionWithDiscrepancies | undefined
  >(undefined);

  const { data: discrepancies } = useQuery(['discrepancies'], () => api.getDiscrepancies(id), {
    retry: false,
  });

  const { indicatorOptions, indicators } = useIndicators();

  const [mappedIndicators, setMappedIndicators] = useState(
    getUniqueIndicatorIds(discrepancies, indicatorOptions),
  );

  useEffect(() => {
    setMappedIndicators(getUniqueIndicatorIds(discrepancies, indicatorOptions));
  }, [discrepancies, indicators]);

  const handleUpdate = (onUpdate: any) => {
    setMappedIndicators(
      mappedIndicators.map((item) => {
        if (item.id === activeIndicator?.id) {
          onUpdate(item);
        }

        return item;
      }),
    );
  };

  const handleUpdateLack = (value: string) => {
    handleUpdate((item) => (item.data.lack.notes = value));
  };

  const handleUpdateRepeat = (id: string) => {
    handleUpdate((item) => {
      item.data.repeats = item.data.repeats.map((item) => {
        if (id == item.id) {
          item.approved = true;
        }

        return item;
      });
    });
  };

  const handleUpdateAllRepeat = () => {
    handleUpdate((item) => {
      item.data.repeats = item.data.repeats.map((item) => {
        item.approved = true;
        return item;
      });
    });
  };

  const handleUpdateExceeded = (values: Exceeded) => {
    handleUpdate((item) => {
      item.data.exceeded = item.data.exceeded.map((item) => {
        if (values.id == item.id) {
          item = { ...item, ...values };
        }

        return item;
      });
    });
  };

  const handleUpdateAllExceeded = (values: Exceeded) => {
    handleUpdate((item) => {
      item.data.exceeded = item.data.exceeded.map((item) => {
        item = { ...item, ...values, id: item.id };

        return item;
      });
    });
  };

  const handleSubmit = () => {
    updateDiscrepanciesMutation(mapSubmitValues(mappedIndicators));
  };

  const { mutateAsync: updateDiscrepanciesMutation } = useMutation(
    (values) => api.updateDiscrepancies(id, values),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['discrepancies']);
        handleSuccessToast();
      },
      retry: false,
    },
  );

  const isAllApproved =
    mappedIndicators.filter((item) => handleIsApproved(item)).length === mappedIndicators.length;

  return (
    <PageContainer>
      <TopRow>
        <div>
          <Title>{'Neatitikčių peržiūra ir patvirtinimas'}</Title>

          <InfoRow info={['Prašome pateikite pastabas prie rodiklių kurie viršija ribas.']} />
        </div>
        <ButtonRow>
          <Button
            onClick={() => navigate(slugs.declaration(businessPlaceId, id))}
            variant={ButtonColors.BACK}
            type="button"
          >
            {'Grįžti atgal'}
          </Button>
          {isAllApproved && (
            <Button onClick={handleSubmit} type="button">
              {'Deklaruoti'}
            </Button>
          )}
        </ButtonRow>
      </TopRow>
      <Content>
        <Column>
          {mappedIndicators.map((indicator, index) => {
            const handleGetStatus = (indicator) => {
              if (indicator.id === activeIndicator?.id) {
                return IndicatorStatus.ACTIVE;
              }

              const isApproved = handleIsApproved(indicator);

              if (isApproved) {
                return IndicatorStatus.APPROVED;
              }

              return IndicatorStatus.NOT_CHECKED;
            };

            const status = handleGetStatus(indicator);

            const isApproved = status === IndicatorStatus.APPROVED;

            return (
              <IndicatorLine
                key={`indicator-${indicator}-${index}`}
                onClick={() => setActiveIndicator(indicator)}
              >
                <Circle $status={status}>
                  {isApproved && <Verified name={IconName.checkMark} />}
                </Circle>
                <IndicatorText $status={status}>{indicator.name}</IndicatorText>
              </IndicatorLine>
            );
          })}
        </Column>

        <ContainersColumn>
          {activeIndicator?.data?.repeats && (
            <RepeatContainer
              onUpdate={handleUpdateRepeat}
              onUpdateAll={handleUpdateAllRepeat}
              unit={activeIndicator.unit}
              repeats={activeIndicator?.data?.repeats}
            />
          )}

          {activeIndicator?.data?.lack && (
            <LackContainer lack={activeIndicator?.data?.lack} onUpdate={handleUpdateLack} />
          )}

          {activeIndicator?.data?.exceeded && (
            <ExceededContainer
              options={discrepancies?.Virsijimas?.Lookup}
              unit={activeIndicator.unit}
              exceeded={activeIndicator?.data?.exceeded}
              onUpdate={handleUpdateExceeded}
              onUpdateAll={handleUpdateAllExceeded}
            />
          )}
        </ContainersColumn>
      </Content>
    </PageContainer>
  );
};

const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
`;

const IndicatorText = styled.div<{ $status: IndicatorStatus }>`
  font-size: 1.4rem;
  color: ${({ $status }) => indicatorColors[$status]};
  cursor: pointer;
  width: 250px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const IndicatorLine = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  cursor: pointer;
`;

const Verified = styled(Icon)`
  color: white;
`;

const Content = styled.div`
  margin-top: 86px;
  display: flex;
  gap: 50px;
`;

const Circle = styled.div<{ $status: IndicatorStatus }>`
  width: 24px;
  height: 24px;
  border-radius: 50px;
  background-color: ${({ $status }) => indicatorColors[$status]};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ContainersColumn = styled.div`
  width: 100%;
`;

export default Discrepancies;
