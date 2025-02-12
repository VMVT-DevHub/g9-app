import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { routes } from '../../utils/routes';
import ProfilesDropdown from '../other/ProfileDropdown';
import Logo from './Logo';

const Menu = () => {
  const navigate = useNavigate();
  const currentLocation = useLocation();

  return (
    <Header>
      <InnerContainer>
        <LeftContainer>
          <Logo />
        </LeftContainer>
        <TabContainer>
          {routes
            .filter((route) => !!route.label)
            .map((route, index) => {
              return (
                <Tab
                  $isActive={
                    !!matchPath({ path: route.slug, end: false }, currentLocation.pathname)
                  }
                  key={`menu-${index}`}
                  onClick={() => navigate(route.slug)}
                >
                  {route.label}
                </Tab>
              );
            })}
        </TabContainer>
        <RightContainer>
          <ProfilesDropdown />
        </RightContainer>
      </InnerContainer>
    </Header>
  );
};

export default Menu;

const Tab = styled.div<{ $isActive: boolean }>`
  font-size: 1.6rem;
  line-height: 20px;
  font-weight: medium;
  font-size: 1.6rem;
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.text.active : theme.colors.text.secondary};
  cursor: pointer;
`;

const LeftContainer = styled.div`
  flex: 1;
  display: flex;
`;

const RightContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

const TabContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
  margin: 0px 16px;
  flex-wrap: wrap;
`;

const Header = styled.div`
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 65px;
  width: 100%;
  border-bottom: 1px solid #cdd5df;
  padding: 20px;
`;

const InnerContainer = styled.div`
  flex-basis: 1250px;
  display: flex;
  align-items: center;
`;
