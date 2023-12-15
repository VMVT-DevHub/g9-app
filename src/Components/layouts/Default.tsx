import styled from 'styled-components';
import { device } from '../../styles';
import { ChildrenType } from '../../types';
import { useWindowSize } from '../../utils/hooks';
import MobileNavBar from '../other/MobileNavBar';
import Navbar from '../other/Navbar';

export interface DefaultLayoutProps {
  children?: ChildrenType;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const isMobile = useWindowSize(device.mobileXL);

  return (
    <Container>
      {!isMobile ? <Navbar /> : <MobileNavBar />}

      <Content>{children}</Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: white;
  flex-direction: column;
  overflow-y: auto;
  @media ${device.mobileL} {
    overflow-y: auto;
    height: 100svh; //fixes iOS Safari floating address bar problem
  }
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  @media ${device.mobileL} {
    padding: 20px 16px;
  }
`;

export default DefaultLayout;
