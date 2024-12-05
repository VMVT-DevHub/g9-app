import { useNavigate } from 'react-router-dom';
import { BoldText, PageContainer, Title } from '../Components/other/CommonStyles';
import FullscreenLoader from '../Components/other/FullscreenLoader';
import Table from '../Components/Table/Table';
import { useBusinessPlaces } from '../utils/hooks';
import { slugs } from '../utils/routes';
import styled from 'styled-components';


const labels = {
  name: 'Pavadinimas',
  code: 'Teritorijos kodas',
  address: 'Teritorija',
};

const BusinessPlaces = () => {
  const navigate = useNavigate();

  const { data, JA_data, isLoading } = useBusinessPlaces();
  if (isLoading) return <FullscreenLoader />;

  const mappedData = data.map((item) => {
    return { ...item, name: <BoldText>{item.name}</BoldText> };
  });

  let tablesJA = JA_data.map((JA) => {
    let mappedJAData = mappedData.filter((data) => data.ja == JA.id)
    return ( 
      <TableDiv key={JA.id}>
        <InfoTitle>{JA.name}</InfoTitle>
        <Table
          onClick={(businessPlace) => navigate(slugs.businessPlaceDeclarations(businessPlace.id))}
          tableData={mappedJAData}
          labels={labels}
        />
      </TableDiv>
    )
  });


  return (
    <PageContainer>
      <Title>Geriamojo vandens tiekimo sistemos</Title>
      {tablesJA}
    </PageContainer>
  );
};

const InfoTitle = styled.div`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 10px;

`;

const TableDiv = styled.div`
  & > *:nth-child(2) {
    margin-left: 10px;
  }
`;


export default BusinessPlaces;
