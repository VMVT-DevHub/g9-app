import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../state/hooks';
import { DeleteInfoProps } from '../../types';
import api from '../../utils/api';
import { getRole, handleSuccessToast, mapArraysToJson } from '../../utils/functions';
import { BlueText, BoldText, TableActionContainer } from '../other/CommonStyles';
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

    return mapArraysToJson(users)
      .filter((item) => item?.GVTS?.toString() === id)
      .sort((a, b) => `${a.FName} ${a.LName}`.localeCompare(`${b.FName} ${b.LName}`))
      .map((item) => {
        const fullName = `${item.FName} ${item.LName}`;
        const isCurrentUser = currentUser.id === item.ID;
        return {
          fullName: <BoldText>{fullName}</BoldText>,
          ...(!isCurrentUser && {
            delete: (
              <TableActionContainer>
                <BlueText onClick={() => setSelectedUser({ fullName, id: item.ID })}>
                  Trinti
                </BlueText>
              </TableActionContainer>
            ),
          }),

          role: (
            <TableSelect
              disabled={true}
              optionLabel={getRole}
              onChange={() => {}}
              value={getRole(item.Admin)}
              options={[!item.Admin]}
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
