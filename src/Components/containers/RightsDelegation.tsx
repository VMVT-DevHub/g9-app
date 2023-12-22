import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../state/hooks';
import { DeleteInfoProps } from '../../types';
import api from '../../utils/api';
import { getRole, handleSuccessToast } from '../../utils/functions';
import { BlueText, BoldText } from '../other/CommonStyles';
import DeleteComponent from '../other/DeleteCard';
import Table from '../Table/Table';
import TableSelect from '../Table/TableSelect';

const labels = {
  fullName: 'Vardas, pavardė',
  role: 'Rolė',
  delete: '',
};

const RightsDelegations = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { id = '' } = useParams();
  const queryClient = useQueryClient();

  const currentUser = useAppSelector((state) => state.user.userData);

  const { mutateAsync: deleteUserMutation } = useMutation(
    () => api.deleteUser(id, selectedUser.id),
    {
      onSuccess: async () => {
        handleSuccessToast('Pašalintas naudotojas');
        setSelectedUser(null);
        await queryClient.invalidateQueries(['users']);
      },
      retry: false,
    },
  );

  const { data, isFetching } = useQuery(['users'], () => api.getUsers(), {
    retry: false,
  });

  const deleteInfo: DeleteInfoProps = {
    deleteButtonText: 'Trinti',
    deleteDescriptionFirstPart: 'Ar esate tikri, kad norite pašalinti',
    deleteDescriptionSecondPart: 'naudotoją',
    deleteTitle: 'Ištrinti naudotoją',
    deleteName: selectedUser?.fullName,
    handleDelete: deleteUserMutation,
  };

  const getMappedData = () => {
    const users = data?.Users;

    if (!users) return [];

    return users.Data.filter((item) => item[0].toString() === id).map((item) => {
      const fullName = `${item[2]} ${item[3]}`;
      const isCurrentUser = currentUser.id === item[1];
      return {
        fullName: <BoldText>{fullName}</BoldText>,
        ...(!isCurrentUser && {
          delete: (
            <BlueText onClick={() => setSelectedUser({ fullName, id: item[1] })}>Trinti</BlueText>
          ),
        }),

        role: (
          <TableSelect
            disabled={true}
            optionLabel={getRole}
            onChange={() => {}}
            value={getRole(item[4])}
            options={[!item[4]]}
          />
        ),
      };
    });
  };

  return (
    <>
      <Table loading={isFetching} tableData={getMappedData()} labels={labels} />
      <DeleteComponent
        deleteInfo={deleteInfo}
        showModal={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </>
  );
};

export default RightsDelegations;
