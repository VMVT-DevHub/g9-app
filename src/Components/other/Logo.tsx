import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Logo = ({ className }: any) => {
  const navigate = useNavigate();

  return (
    <Container onClick={() => navigate('/')} className={className}>
      <Title>G9</Title>
      <Description>Geriamo vandens stebėsenos duomenų deklaravimas</Description>
    </Container>
  );
};
const Container = styled.div`
  display: grid;
  align-items: center;
  gap: 12px;
  grid-template-columns: 45px 200px;
  cursor: pointer;
`;

const Title = styled.div`
  font-size: 3.2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Description = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1.4rem;
  opacity: 1;
`;

export default Logo;
