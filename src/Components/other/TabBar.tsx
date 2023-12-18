import { map } from 'lodash';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useGetCurrentRoute } from '../../utils/hooks';

export interface Tab {
  label: string;
  slug: string;
}

const TabBar = ({ tabs, className }: { tabs: Tab[]; className?: string }) => {
  const navigate = useNavigate();
  const currentTab = useGetCurrentRoute(tabs);
  const handleClick = (tab: Tab) => {
    navigate(tab.slug);
  };

  return (
    <Container className={className}>
      {map(tabs, (tab: Tab) => (
        <TabButton
          key={`${tab.slug}`}
          isActive={currentTab?.slug === tab.slug}
          onClick={() => {
            handleClick(tab);
          }}
        >
          <TabLabel>{tab.label}</TabLabel>
        </TabButton>
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex: 1;
  white-space: nowrap;
  overflow-x: auto;
`;

const TabButton = styled.div<{ isActive: boolean }>`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
  border-bottom: ${({ isActive, theme }) =>
    `3px ${isActive ? theme.colors.primary : 'transparent'} solid`};
  margin-right: 24px;
  cursor: pointer;
`;

const TabLabel = styled.span`
  margin: 4px 0;
  color: #121926;
  font-size: 1.4rem;
`;

export default TabBar;
