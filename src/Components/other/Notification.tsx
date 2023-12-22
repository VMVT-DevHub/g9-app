import styled from 'styled-components';
import Icon, { IconName } from './Icons';

const Notification = ({ description }: { description: string }) => (
  <Container>
    <StyledIcon name={IconName.info} />
    <BlueText>{description}</BlueText>
  </Container>
);
const Container = styled.div`
  display: grid;
  grid-template-columns: 28px 1fr;
  align-items: center;
  padding: 16px 18px;
  background-color: #f3f9ff;
  width: fit-content;
`;

const StyledIcon = styled(Icon)`
  font-size: 2.3rem;
  color: ${({ theme }) => theme.colors.text.active};
`;

const BlueText = styled.div`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.text.active};
`;

export default Notification;
