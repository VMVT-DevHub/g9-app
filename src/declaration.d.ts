import { Theme } from './styles/index';
declare module '*.png';
declare module '*.jpg';
declare module '*.css';
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
