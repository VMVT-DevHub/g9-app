//@ts-ignore
import { useState } from 'react';
import styled from 'styled-components';
import Button from '../Components/buttons/Button';
import LoginLayout from '../Components/layouts/Login';
import Icon, { IconName } from '../Components/other/Icons';

const Login = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    const loginUrl = `/auth/login`;
    window.location.replace(loginUrl);
  };

  return (
    <LoginLayout>
      <Container>
        <InnerContainer>
          <Title>G9</Title>
          <Description>Geriamo vandens stebėsenos duomenų deklaravimas</Description>
        </InnerContainer>
        <Button
          onClick={handleLogin}
          loading={loading}
          disabled={loading}
          leftIcon={<Icon name={IconName.eGate} />}
        >
          Prisijungti per El. valdžios vartus
        </Button>
      </Container>
    </LoginLayout>
  );
};

const Title = styled.div`
  font-size: 6.7rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Description = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.6rem;
  opacity: 1;
`;

export default Login;
