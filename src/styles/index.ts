import { createGlobalStyle } from 'styled-components';
export interface Theme {
  colors: {
    primary: string;
  };
}

export const theme: Theme = {
  colors: {
    primary: '#FEBC1D',
  },
};

export const GlobalStyle = createGlobalStyle`
 *{
  box-sizing: border-box;
 }

  html { 
    font-size: 62.5%; 
    width: 100vw;
    height: 100vh;
 
  }

  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #EEEBE5;
    font-size: 1.6rem;
    width: 100vw;
    height: 100vh;
    overflow:hidden;
  } 
  h1 {
    font-size: 3.2rem;
    color: "#121A55";
  }
  a {
    text-decoration: none;
  }
  button {
    outline: none;
    text-decoration: none;
    display: block;
    border: none;
    background-color: transparent;
  }

  textarea {
    font-size: 1.6rem;
  }
`;

export const device = {
  mobileS: `(max-width: 320px)`,
  mobileM: `(max-width: 425px)`,
  mobileL: `(max-width: 788px)`,
  mobileXL: `(max-width: 1025px)`,
};
