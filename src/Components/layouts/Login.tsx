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

const Image = styled.img`
  object-fit: cover;
  height: 100%;
  width: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const ImageContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
`;

const Content = styled.div`
  margin: auto;

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

  @media ${device.mobileL} {
    padding: 32px 16px 32px 16px;
    width: 100%;
    height: 100%;
    justify-content: center;
    border-radius: 0px;
  }
`;

export default LoginLayout;
