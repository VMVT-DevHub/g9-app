import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Button, { ButtonColors } from '../Components/buttons/Button';
import ExceededContainer from '../Components/containers/ExceededContainer';
import LackContainer from '../Components/containers/LackContainer';
import RepeatContainer from '../Components/containers/RepeatContainer';
import { PageContainer, Title } from '../Components/other/CommonStyles';
import FullscreenLoader from '../Components/other/FullscreenLoader';
import Icon, { IconName } from '../Components/other/Icons';
import InfoRow from '../Components/other/InfoRow';
import { device, theme } from '../styles';
import { IndicatorOptionWithDiscrepancies } from '../types';
import { getIndicatorLabel, getYearRange, handleIsApproved } from '../utils/functions';
import { useDeclaration, useIndicators, useMappedIndicatorsWithDiscrepancies } from '../utils/hooks';
import { slugs } from '../utils/routes';

export enum IndicatorStatus {
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  ACTIVE_APPROVED = 'ACTIVE_APPROVED',
  NOT_CHECKED = 'NOT_CHECKED',
}

const indicatorColors = {
  [IndicatorStatus.APPROVED]: theme.colors.success,
  [IndicatorStatus.ACTIVE]: theme.colors.text.active,
  [IndicatorStatus.ACTIVE_APPROVED]: theme.colors.text.active,
  [IndicatorStatus.NOT_CHECKED]: theme.colors.grey,
};

const Discrepancies = () => {
  const { businessPlaceId = '', id = '' } = useParams();

  const { canDeclare, isDeclared, declarationLoading, mappedDeclaration } = useDeclaration();

  const { indicatorGroupLabels, indicatorGroups } = useIndicators(
      mappedDeclaration.type?.value,
    );

  const yearRange = getYearRange(mappedDeclaration?.year);

  useEffect(() => {
    if (declarationLoading) return;

    // if (!canDeclare) {
    //   navigate(slugs.declaration(businessPlaceId, id));
    // }
  }, [declarationLoading]);

  const navigate = useNavigate();
  const [activeIndicator, setActiveIndicator] = useState<
    IndicatorOptionWithDiscrepancies | undefined
  >(undefined);

  const { mappedIndicators, isLoading, discrepancies, isAllApproved } =
    useMappedIndicatorsWithDiscrepancies();

  useEffect(() => {
    if (!activeIndicator?.id) {
      if (!isEmpty(mappedIndicators)) {
        setActiveIndicator(mappedIndicators[0]);
      }

      return;
    }

    setActiveIndicator(() => mappedIndicators.find((item) => item.id == activeIndicator?.id));
  }, [mappedIndicators]);

  const hasNext =
    typeof activeIndicator?.index === 'number' && !!mappedIndicators[activeIndicator?.index + 1];
  const hasPrevious =
    typeof activeIndicator?.index === 'number' && !!mappedIndicators[activeIndicator?.index - 1];

  if (isLoading || declarationLoading) return <FullscreenLoader />;

  const sortedIndicators = () => {
    const sorted = [...mappedIndicators];
  
    sorted.sort((a, b) => {
      const groupIdA = a.groupId !== undefined ? a.groupId : Number.MAX_SAFE_INTEGER;
      const groupIdB = b.groupId !== undefined ? b.groupId : Number.MAX_SAFE_INTEGER;
      
      if (groupIdA !== groupIdB) {
        return groupIdA - groupIdB;
      }
      
      return (a.index || 0) - (b.index || 0);
    });
    
    return sorted;
  };

  return (
    <PageContainer>
      <TopRow>
        <div>
          <Title>{'Neatitikčių peržiūra ir patvirtinimas'}</Title>
          {canDeclare ? (
            <InfoRow info={['Prašome pateikite pastabas prie rodiklių kurie viršija ribas.']} />
          ) : (
            <InfoRow info={['Žemiau matomos deklaracijos metu pateiktos pastabos.']} />
          )}
        </div>
        <ButtonRow>
          <Button
            onClick={() => navigate(slugs.declaration(businessPlaceId, id))}
            variant={ButtonColors.BACK}
            type="button"
          >
            {'Grįžti atgal'}
          </Button>
          {isAllApproved && canDeclare ? (
            <Button
              onClick={() => navigate(slugs.submitDeclaration(businessPlaceId, id))}
              type="button"
            >
              {'Deklaruoti'}
            </Button>
          ) : (
            ''
          )}
        </ButtonRow>
      </TopRow>
      <Content>
        <Column>
          {sortedIndicators().map((indicator, index) => {
            const handleGetStatus = (indicator) => {
              const isApproved = handleIsApproved(indicator);
              if (indicator.id === activeIndicator?.id) {
                if (isApproved) {
                  return IndicatorStatus.ACTIVE_APPROVED;
                }
                return IndicatorStatus.ACTIVE;
              } else {
                if (isApproved) {
                  return IndicatorStatus.APPROVED;
                }
              }

              return IndicatorStatus.NOT_CHECKED;
            };

            const status = handleGetStatus(indicator);

            const isApproved = status === IndicatorStatus.APPROVED;
            const isActiveApproved = status === IndicatorStatus.ACTIVE_APPROVED;

            const isFirstInGroup =
              index === 0 || indicator.groupId !== sortedIndicators()[index - 1].groupId;

            return (
              <div key={`indicator-${indicator}-${index}`}>
                {isFirstInGroup && (
                  <GroupHeader>
                    {indicatorGroupLabels[indicator.groupId ? indicator.groupId : 0]}
                  </GroupHeader>
                )}
                <IndicatorLine
                  onClick={() => setActiveIndicator(indicator)}
                >
                  <Circle $status={status}>
                    {isApproved && <Verified name={IconName.checkMark} />}
                    {isActiveApproved && <Verified name={IconName.checkMark} />}
                  </Circle>
                  <IndicatorText $status={status}>{getIndicatorLabel(indicator)}</IndicatorText>
                </IndicatorLine>
              </div>
            );
          })}
        </Column>

        <ContainersColumn>
          {activeIndicator ? (
            <IndicatorTitle>{getIndicatorLabel(activeIndicator)}</IndicatorTitle>
          ) : (
            isDeclared ? <p>Neatitikčių nebuvo.</p> : <p>Neatitikčių nerasta, galima deklaruoti.</p>
          )}
          {activeIndicator?.data?.repeats && (
            <RepeatContainer
              unit={activeIndicator.unit}
              repeats={activeIndicator?.data?.repeats}
              isDeclared={isDeclared}
            />
          )}

          {activeIndicator?.data?.lack && (
            <LackContainer lack={activeIndicator?.data?.lack} isDeclared={isDeclared} />
          )}

          {activeIndicator?.data?.exceeded && (
            <ExceededContainer
              groupId={activeIndicator.groupId}
              yearRange={yearRange}
              options={discrepancies?.Virsijimas?.Lookup}
              unit={activeIndicator.unit}
              exceeded={activeIndicator?.data?.exceeded}
              description={activeIndicator.description}
              isDeclared={isDeclared}
            />
          )}
          {hasNext ? (
            <Row>
              {hasPrevious && (
                <BackButton
                  onClick={() => setActiveIndicator(mappedIndicators[activeIndicator.index - 1])}
                >
                  <StyledIcon name={IconName.arrowNext} />
                  {'Praeitas rodiklis'}
                </BackButton>
              )}
              <BackButton
                onClick={() => setActiveIndicator(mappedIndicators[activeIndicator.index + 1])}
              >
                {'Kitas rodiklis'}
                <NextIcon name={IconName.arrowNext} />
              </BackButton>
            </Row>
          ) : (
            <Row>
              {hasPrevious && (
                <BackButton
                  onClick={() => setActiveIndicator(mappedIndicators[activeIndicator.index - 1])}
                >
                  <StyledIcon name={IconName.arrowNext} />
                  {'Praeitas rodiklis'}
                </BackButton>
              )}
            </Row>
          )}
        </ContainersColumn>
      </Content>
    </PageContainer>
  );
};

const GroupHeader = styled.div`
  font-weight: bold;
  font-size: 1.6rem;
  margin-top: 8px;
  margin-bottom: 8px;
  color: ${theme.colors.text.primary};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const NextIcon = styled(Icon)`
   position: relative;
   top: 3px;
   left: 2px;
`;
const StyledIcon = styled(Icon)`
   transform: rotate(180deg);
   transform-origin: center;
   position: relative;
   top: 3px;
   left: -2px;
`;

const BackButton = styled.div`
  font-size: 1.4rem;
  color: #121926;
  margin-left: 11px;
`;

const Row = styled.div`
  margin-top: 16px;
  gap: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
`;

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
  align-items: baseline;
  flex-wrap: wrap;
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
  display: flex;
  gap: 50px;
  @media ${device.mobileL} {
    flex-direction: column;
  }
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
  max-height: 500px;
  width: 40%;
  overflow-y: auto;
  gap: 20px;
  @media ${device.mobileL} {
    width: 100%;
  }
`;

const IndicatorTitle = styled.div`
  font-weight: bold;
  font-size: 2rem;
`;

const ContainersColumn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
  min-width: 0;
`;

export default Discrepancies;
