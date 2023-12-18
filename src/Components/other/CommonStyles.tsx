import styled from 'styled-components';
import { device } from '../../styles';

export const BoldText = styled.div`
  font-weight: 600;
  font-size: 1.4rem;
  color: #121926;
`;

export const BlueText = styled.div`
  font-size: 1.4rem;
  text-align: right;
  color: ${({ theme }) => theme.colors.text.active};
  cursor: pointer;
`;

export const Title = styled.div`
  font-weight: bold;
  line-height: 39px;
  font-size: 3.2rem;
  color: #121926;
`;

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const SpaceBetweenRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Grid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns || 2}, 1fr);
  gap: 16px;
  margin: 16px 0;
  width: 100%;
  @media ${device.mobileL} {
    grid-template-columns: repeat(1, 1fr);
  }
`;
