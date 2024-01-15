import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import { TagColors } from '../../utils/constants';
import { slugs } from '../../utils/routes';
import { BoldText } from '../other/CommonStyles';
import StatusTag from '../other/StatusTag';
import Table from '../Table/Table';

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

    return data?.Data.sort((a, b) => b[2] - a[2]).map((item) => {
      const type = lookUp.Stebesenos[item[3]];
      return {
        id: item[0],
        date: <BoldText>{item[2]}</BoldText>,
        type: item[3] == 1 ? <BoldText>{type}</BoldText> : type,
        status: <StatusTag color={statusToColor[item[4]]} label={lookUp.Statusas[item[4]]} />,
      };
    });
  };

  return (
    <Table
      loading={isFetching}
      onClick={(item) => navigate(slugs.declaration(id, item.id))}
      tableData={getMappedData()}
      labels={labels}
    />
  );
};

export default Declarations;
