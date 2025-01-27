import styled from 'styled-components';
import { device } from '../../styles';
import { ChildrenType } from '../../types';
import { useWindowSize } from '../../utils/hooks';
import MobileNavBar from '../other/MobileNavBar';
import Navbar from '../other/Navbar';
import Footer from '../other/Footer';

export interface DefaultLayoutProps {
  children?: ChildrenType;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const isMobile = useWindowSize(device.mobileXL);

  return (
    <Container>
      {!isMobile ? <Navbar /> : <MobileNavBar />}

      <InnerContainer>
        <Content>{children}</Content>
      </InnerContainer>
      <Footer />
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
  min-height: 100vh;
  @media ${device.mobileL} {
    overflow-y: auto;
    height: 100svh; //fixes iOS Safari floating address bar problem
  }
`;

const InnerContainer = styled.div`
  
`;

const Content = styled.div`
  max-width: 1250px;
  width: 100%;
  margin: auto;
  height: 100%;
  padding: 20px;
`;
export default DefaultLayout;
