import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { routes } from '../../utils/routes';
import Icon, { IconName } from '../other/Icons';
import Logo from './Logo';
import MobileProfilesDropdown from './MobileProfileDropdown';

const MobileNavBar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (slug: string) => {
    navigate(slug);
    setShowMenu(false);
  };

  return (
    <>
      {!showMenu ? (
        <Header>
          <Logo />
          <div onClick={() => setShowMenu(true)}>
            <BurgerIcon name={IconName.burger} />
          </div>
        </Header>
      ) : (
        <Container>
          <InfoContainer>
            <SecondRow>
              <StyledLogo />
              <div onClick={() => setShowMenu(false)}>
                <ExitIcon name={IconName.close} />
              </div>
            </SecondRow>
            {(routes || [])
              .filter((route) => !!route.label)
              .map((route, index) => {
                return (
                  <Tab
                    isActive={location.pathname.includes(route.slug)}
                    onClick={() => handleNavigate(route.slug)}
                    key={`tab-${index}`}
                  >
                    {route.label}
                  </Tab>
                );
              })}
          </InfoContainer>
          <MobileProfilesDropdown />
        </Container>
      )}
    </>
  );
};

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 115;
  height: 64px;
  width: 100%;
  padding: 18px 19px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #cdd5df;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #19181d;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 5;
  padding: 18px 24px;
  overflow-y: auto;
`;

const InfoContainer = styled.div``;

const Tab = styled.div<{ isActive: boolean }>`
  padding: 10px 8px;
  margin: 0 -8px;
  color: #121926;
  border-radius: 4px;
  color: #f7f8fa;
  font-size: 16px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: ${({ isActive }) => isActive && '#EEEBE561'};
  &:hover {
    background-color: #eeebe561;
  }
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 30px;
  gap: 8px;
`;

const SecondRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 57px;
`;

const StyledLogo = styled(Logo)`
  div {
    color: white;
  }
`;

const BurgerIcon = styled(Icon)`
  cursor: pointer;
  font-size: 2rem;
  vertical-align: middle;
  color: #231f20;
`;

const ExitIcon = styled(Icon)`
  cursor: pointer;
  font-size: 2rem;
  vertical-align: middle;
  color: white;
`;

export default MobileNavBar;
