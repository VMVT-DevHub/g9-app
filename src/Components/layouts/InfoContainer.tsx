import styled from 'styled-components';
import { device } from '../../styles';
import { ChildrenType } from '../../types';

export interface LoginLayoutProps {
  children?: ChildrenType;
  title: string;
  description: string;
}

const InfoContainer = ({ children, description, title }: LoginLayoutProps) => {
  return (
    <Container>
      <Column>
        <ContainerTitle>{title}</ContainerTitle>
        <Description>{description}</Description>
      </Column>
      {children}
    </Container>
  );
};

const ContainerTitle = styled.div`
  font-weight: bold;
  line-height: 22px;
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Container = styled.div`
  display: flex;
  gap: 32px;
  border-bottom: 1px solid #cdd5df;
  width: 100%;
  padding: 32px 0;
  overflow-x: auto;
  min-width: 0;

  @media ${device.mobileL} {
    display: block;
    flex-direction: column;
    align-items: flex-start;
  }
`;
const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Description = styled.div`
  font-size: 1.4rem;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.text.secondary};
  opacity: 1;
  max-width: 280px;
  @media ${device.mobileL} {
    margin: 16px 0;
  }
`;

export default InfoContainer;
