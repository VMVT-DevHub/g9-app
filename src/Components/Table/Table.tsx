import { isEmpty, map } from 'lodash';
import { JSX } from 'react';
import styled from 'styled-components';
import { device } from '../../styles';
import FullscreenLoader from '../other/FullscreenLoader';

export interface TableRow {
  id?: string;
  [key: string]: any;
}

export interface TableProps {
  tableData: TableRow[];
  labels: { [key: string]: string };
  onClick?: (item: any) => void;
  tableRowStyle?: any;
  loading?: boolean;
  rightButtons?: JSX.Element;
  className?: string;
  maxHeight?: string;
}

const Table = ({
  tableData,
  onClick,
  loading,
  labels,
  className,
  maxHeight = '100%',
}: TableProps) => {
  const keys = Object.keys(labels);

  const handleRowClick = (row: TableRow) => {
    if (onClick && row) {
      onClick(row);
    }
  };

  const generateTableContent = () => {
    if (!isEmpty(tableData)) {
      return map(tableData, (row: TableRow, index: number) => (
        <TR $pointer={!!onClick} key={`tr-${index}`} onClick={() => handleRowClick(row)}>
          {keys.map((label: any, i: number) => {
            return <TD key={`tr-td-${i}`}>{row[label] || ''}</TD>;
          })}
        </TR>
      ));
    } else {
      return (
        <TR $pointer={false} $hide_border={true}>
          <TdSecond colSpan={keys.length}><i>Nieko nerasta</i></TdSecond>
        </TR>
      );
    }
  };

  if (loading) return <FullscreenLoader />;

  return (
    <Container className={className}>
      <TableContainer $maxHeight={maxHeight}>
        <CustomTable>
          <THEAD>
            <TR $hide_border={true} $pointer={false}>
              {keys.map((key: any, i: number) => {
                return <TH key={`tr-th-${i}`}>{labels[key]}</TH>;
              })}
            </TR>
          </THEAD>
          <Tbody>{generateTableContent()}</Tbody>
        </CustomTable>
      </TableContainer>
    </Container>
  );
};

const Tbody = styled.tbody`
  width: 100%;
  overflow-y: auto;
  
`;

const TableContainer = styled.div<{ $maxHeight?: string }>`
  width: 100%;
  max-height: ${({ $maxHeight }) => $maxHeight};
`;

const CustomTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TH = styled.th`
  text-align: left;
  font-size: 1.4rem;
  padding: 15px 0px 15px 16px;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.text.labels};
  border-bottom: 1px solid #cdd5df;
  line-height: 17px;
  white-space: normal;
  min-width: 250px;
  font-weight: 600;
`;

const TD = styled.td`
  text-align: left;
  font-size: 1.4rem;
  color: #6b7280;
  white-space: nowrap;
  padding: 14px;
  &:last-child {
    width: 100%;
  }
`;

const TdSecond = styled.td`
  padding: 13px 12px;
  text-align: left;
  font-size: 1.4rem;
  color: #121926;
`;

const THEAD = styled.thead`
  width: 100%;
  position: sticky;
  top: 0;
  background-color: #f9fafb;
`;

const TR = styled.tr<{
  $hide_border?: boolean;
  $pointer: boolean;
}>`
  border: none !important;

  border-bottom: ${({ $hide_border }) => ($hide_border ? 'none' : '1px solid #cdd5df')} !important;
  cursor: ${({ $pointer }) => ($pointer ? 'pointer' : 'default')};
`;

const Container = styled.div`
  background-color: white;
  border: 1px solid #cdd5df;
  border-radius: 4px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  overflow-x: auto;
  @media ${device.mobileL} {
    align-items: center;
  }
`;

export default Table;
