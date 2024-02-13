import { useNavigate } from 'react-router-dom';
import { BoldText, PageContainer, Title } from '../Components/other/CommonStyles';
import FullscreenLoader from '../Components/other/FullscreenLoader';
import Table from '../Components/Table/Table';
import { useBusinessPlaces } from '../utils/hooks';
import { slugs } from '../utils/routes';

const labels = {
  name: 'Pavadinimas',
  code: 'Kodas',
  address: 'Adresas',
};

const BusinessPlaces = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useBusinessPlaces();

  if (isLoading) return <FullscreenLoader />;

  const mappedData = data.map((item) => {
    return { ...item, name: <BoldText>{item.name}</BoldText> };
  });

  return (
    <PageContainer>
      <Title>Geriamojo vandens tiekimo sistemos</Title>
      <Table
        onClick={(businessPlace) => navigate(slugs.businessPlaceDeclarations(businessPlace.id))}
        tableData={mappedData}
        labels={labels}
      />
    </PageContainer>
  );
};

export default BusinessPlaces;
