import { useState } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import { useLogoutMutation } from '../../utils/hooks';
import Icon, { IconName } from './Icons';

const ProfileDropdown = () => {
  const user = useAppSelector((state) => state.user?.userData);
  const [showSelect, setShowSelect] = useState(false);
  const { mutateAsync } = useLogoutMutation();

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setShowSelect(false);
    }
  };

  return (
    <Container tabIndex={1} onBlur={handleBlur}>
      <Select onClick={() => setShowSelect(!showSelect)}>
        <SelectContainer>
          <Name>{`${user?.firstName || '-'} ${user?.lastName || '-'}`}</Name>
          <Email>{user?.email || '-'}</Email>
        </SelectContainer>
        <DropdownIcon name={IconName.arrowDown} />
      </Select>
      {showSelect && (
        <DropDownContainer>
          <BottomRow onClick={() => mutateAsync()}>
            <StyledLogoutIcon name={IconName.logout} />
            <Name>Atsijungti</Name>
          </BottomRow>
        </DropDownContainer>
      )}
    </Container>
  );
};

const StyledLogoutIcon = styled(Icon)`
  color: #121926;
  font-size: 2rem;
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 14.5px;
`;

const Container = styled.div`
  position: relative;
  min-width: 200px;
  &:focus {
    outline: none;
  }
`;

const DropdownIcon = styled(Icon)`
  cursor: pointer;
  font-size: 1.2rem;
`;

const Select = styled.div`
  cursor: pointer;
  min-width: 100%;
  height: 31px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SelectContainer = styled.div`
  width: 100%;
`;

const Name = styled.div`
  font-size: 1.4rem;
  color: #121926;
  line-height: 17px;
`;

const Email = styled.div`
  font-size: 1.2rem;
  color: #4b5565;
`;

const DropDownContainer = styled.div`
  z-index: 3;
  position: absolute;
  right: 0;
  padding: 15px 22px;
  top: 40px;
  background-color: white;
  box-shadow: 0px 4px 15px #12192614;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  width: 262px;
`;

export default ProfileDropdown;
