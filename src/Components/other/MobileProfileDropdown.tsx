import { useState } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import { useLogoutMutation } from '../../utils/hooks';
import Icon, { IconName } from './Icons';

const MobileProfilesDropdown = () => {
  const user = useAppSelector((state) => state.user?.userData);
  const [showSelect, setShowSelect] = useState(false);
  const { mutateAsync } = useLogoutMutation();

  return (
    <Container>
      <Select onClick={() => setShowSelect(!showSelect)}>
        <SelectContainer>
          <ProfileName>{`${user.firstName || '-'} ${user.lastName || '-'}`}</ProfileName>
          <ProfileEmail>{user?.email || '-'}</ProfileEmail>
        </SelectContainer>
        <DropdownIcon name={IconName.unfoldMore} />
      </Select>
      {showSelect && (
        <InnerContainer>
          <BottomRow onClick={() => mutateAsync()}>
            <StyledLogoutIcon name={IconName.logout} />
            <Name>Atsijungti</Name>
          </BottomRow>
        </InnerContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;

const Select = styled.div`
  height: 31px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: -8px;
`;

const Name = styled.div`
  font-size: 1.4rem;
  color: #121926;
  line-height: 17px;
`;

const ProfileName = styled.div`
  font-size: 1.4rem;
  color: #f7f8fa;
`;

const ProfileEmail = styled.div`
  font-size: 1.2rem;
  color: #bab2b0;
`;

const SelectContainer = styled.div`
  width: 100%;
  color: #121926;
`;

const DropdownIcon = styled(Icon)`
  cursor: pointer;
  color: #f7f8fa;
  font-size: 2.5rem;
`;

const InnerContainer = styled.div`
  z-index: 3;
  position: absolute;
  bottom: 40px;
  padding: 5px 5px 5px 5px;
  padding: 12px 16px 12px 16px;
  background-color: white;
  box-shadow: 0px 4px 15px #12192614;
  border: 1px solid #cdd5df;
  border-radius: 4px;
  width: 100%;
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 5px 0 0 0;
`;

const StyledLogoutIcon = styled(Icon)`
  color: #121926;
  font-size: 2rem;
`;

export default MobileProfilesDropdown;
