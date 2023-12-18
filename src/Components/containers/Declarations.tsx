import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import { TagColors } from '../../utils/constants';
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
  const navigate = useNavigate();
  const { id = '' } = useParams();

  const { data, isFetching } = useQuery(['declarations'], () => api.getDeclarations(id), {
    retry: false,
  });

  const getMappedData = () => {
    if (!data?.Data) return [];

    const lookUp = data.Lookup;

    return data?.Data.map((item) => {
      return {
        date: <BoldText>{item[2]}</BoldText>,
        type: lookUp.Stebesenos[item[3]],
        status: <StatusTag color={statusToColor[item[4]]} label={lookUp.Statusas[item[4]]} />,
      };
    });
  };

  return (
    <Table loading={isFetching} onClick={() => {}} tableData={getMappedData()} labels={labels} />
  );
};

export default Declarations;
