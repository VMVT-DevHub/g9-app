import styled from 'styled-components';
import { device } from '../../styles';

export const BoldText = styled.div`
  font-weight: 600;
  font-size: 1.4rem;
  color: #121926;
`;

export const BlueText = styled.div<{
  disabled?: boolean;
}>`
  font-size: 1.4rem;
  text-align: right;
  color: ${({ theme }) => theme.colors.text.active};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  cursor: pointer;
`;

export const DisableText = styled.div`
  font-size: 1.4rem;
  text-align: right;
  color: ${({ theme }) => theme.colors.text.active};
  cursor: not-allowed;
`;

export const DangerText = styled.div`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.danger};
`;

export const SuccessText = styled.div`
  font-size: 1.4rem;
  text-align: right;
  color: ${({ theme }) => theme.colors.success};
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
  width: 100%;
  gap: 32px;
`;

export const SpaceBetweenRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 45px;
`;

export const Grid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns || 2}, 1fr);
  gap: 16px;
  margin-bottom: 16px;
  width: 100%;
  @media ${device.mobileL} {
    grid-template-columns: repeat(1, 1fr);
  }
`;


export const TableActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;