import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { routes } from '../../utils/routes';
import Logo from './Logo';
import { device } from '../../styles';

const Footer = () => {

  return (
    <FooterContainer>
      <InnerContainer>
        <LeftContainer>
          <ContactLine>
            <b>Valstybinė maisto ir veterinarijos tarnyba</b>
          </ContactLine>
          <ContactLine>Geriamo vandens stebėsenos duomenų deklaravimas</ContactLine>
        </LeftContainer>
        <RightContainer>
          <ContactLine>
            <b>El. paštas:</b> info@vmvt.lt
          </ContactLine>
          <ContactLine>
            <b>Telefonas:</b> 1879 arba +370 5 242 0108
          </ContactLine>
          <ContactLine>
            <b>Adresas:</b> Siesikų g. 19, LT-07170 Vilnius
          </ContactLine>
        </RightContainer>
      </InnerContainer>
    </FooterContainer>
  );
};

export default Footer;
const ContactLine = styled.p`
  margin: 0;
`;
const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
  @media ${device.mobileL} {
    gap: 10px;
    width: 100%;
    }
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  width: 70%;
  @media ${device.mobileL} {
    flex-direction: column;
    align-items: start;
    gap: 10px;
    width: 100%;
  }
`;

const FooterContainer = styled.div`
  background-color: white;
  border-top: 1px solid #cdd5df;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
  margin-top: auto;
`;

const InnerContainer = styled.div`
  flex-basis: 1250px;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media ${device.mobileL} {
    flex-direction: column;
    align-items: start;
    gap: 20px;
    }
`;
