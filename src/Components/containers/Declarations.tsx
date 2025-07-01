import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import { TagColors } from '../../utils/constants';
import { mapArraysToJson } from '../../utils/functions';
import { slugs } from '../../utils/routes';
import { BoldText } from '../other/CommonStyles';
import StatusTag from '../other/StatusTag';
import Table from '../Table/Table';
import styled from 'styled-components';

const labels = {
  date: 'Metai',
  type: 'Tipas',
  status: 'Statusas',
};

const statusToColor = {
  1: TagColors.GREY,
  2: TagColors.BLUE,
  3: TagColors.GREEN,
};

const Declarations = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();

  const { data, isFetching } = useQuery(['declarations'], () => api.getDeclarations(id), {
    retry: false,
  });

  const getMappedData = () => {
    if (!data?.Data) return [];

    const lookUp = data.Lookup;

    return mapArraysToJson(data)
      .sort((a, b) => {
        const yearComparison = b.Metai - a.Metai;

        if (yearComparison == 0) {
          return a.Stebesenos - b.Stebesenos;
        }

        return yearComparison;
      })
      .map((item) => {
        const type = lookUp.Stebesenos[item.Stebesenos];
        return {
          id: item.ID,
          date: <BoldText>{item.Metai}</BoldText>,
          type: item.Stebesenos == 1 ? <BoldText>{type}</BoldText> : type,
          status: (
            <StatusTag
              color={statusToColor[item.Statusas]}
              label={lookUp.Statusas[item.Statusas]}
            />
          ),
        };
      });
  };

  return (
    <>
      <Table
        loading={isFetching}
        onClick={(item) => navigate(slugs.declaration(id, item.id))}
        tableData={getMappedData()}
        labels={labels}
      />
      <StatusInfoContainer>
        <StatusContainer>
          <StatusTag
            color={statusToColor[1]}
            label={"Pildoma"}
          />
          <p> - Einamojo laikotarpio duomenų pildymas</p>
        </StatusContainer>
        <StatusContainer>
          <StatusTag
            color={statusToColor[2]}
            label={"Deklaruojama"}
          />
          <p> - Pasibaigusio ataskaitinio laikotarpio duomenų pildymas</p>
        </StatusContainer>
        <StatusContainer>
          <StatusTag
            color={statusToColor[3]}
            label={"Deklaruota"}
          />
          <p> - Duomenų pildyti nebegalima</p>
        </StatusContainer>
       
      </StatusInfoContainer>
      
    </>
    
  );
};
const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  & p {
    margin: 8px;
    color: #697586;
  }
`
const StatusInfoContainer = styled.div`
  
`

export default Declarations;
