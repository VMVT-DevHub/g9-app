import styled from 'styled-components';
import { device } from '../../styles';
import Icon, { IconName } from '../other/Icons';
import Modal from './Modal';

const Popup = ({ children, onClose, visible = false, canClickOut = true }: any) => {
  return (
    <Modal visible={visible} onClose={onClose} canClickOut={canClickOut}>
      <Container>
        <IconContainer onClick={onClose}>
          <StyledIcon name={IconName.close} />
        </IconContainer>
        {children}
      </Container>
    </Modal>
  );
};

const StyledIcon = styled(Icon)`
  cursor: pointer;
  font-size: 2.4rem;
`;

const Container = styled.div<{ width?: string }>`
  background-color: white;
  position: relative;
  width: 100%;
  margin: auto;
  max-width: 580px;
  padding: 24px;
  flex-basis: auto;

  border-radius: 8px;
  @media ${device.mobileM} {
    width: 100%;
    height: 100%;
  }
`;

const IconContainer = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  top: 20px;
  right: 20px;
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
`;

export default Popup;
