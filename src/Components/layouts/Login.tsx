import Div100vh from 'react-div-100vh';
import styled from 'styled-components';
import { device } from '../../styles';

export interface LoginLayoutProps {
  children?: React.ReactNode;
}

const LoginLayout = ({ children }: LoginLayoutProps) => {
  return (
    <Div100vh>
      <Container>
        <ImageContainer>
          <Image src="/g9Background.webp" />
        </ImageContainer>
        <Content>{children}</Content>
      </Container>
    </Div100vh>
  );
};

const ImageContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const Image = styled.img`
  object-fit: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  width: 100%;
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  margin: auto;
  overflow-y: auto;
  width: 100vw;
  height: 100vh;
`;

const Content = styled.div`
  overflow-y: auto;
  background-color: #ffffff;
  box-shadow: 0px 18px 41px #121a5529;
  border-radius: 8px;
  width: 430px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 100%;
  @media ${device.mobileL} {
    padding: 32px 16px 32px 16px;
    width: 100%;
    height: 100%;
    border-radius: 0px;
  }
`;

export default LoginLayout;
