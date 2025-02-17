import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useBusinessPlaces, useDeclaration } from '../../utils/hooks';
import Icon, { IconName } from './Icons';

const Breadcrumb = () => {
  const location = useLocation();
  const { businessPlaceId = '', id = '' } = useParams();
  const { data } = useBusinessPlaces();
  const { mappedDeclaration, declarationLoading } = useDeclaration();
  let declarationYear;

  if (id) {
    declarationYear = mappedDeclaration.year;
  }

  const currentBusinessPlace = data.find((item) => item?.id?.toString() === id);
  const currentBusinessPlaceDeclaration = data.find(
    (item) => item?.id?.toString() === businessPlaceId,
  );

  const pathSegments = location.pathname.split('/').filter(Boolean);

  const getCrumbLabel = (segment: string, index: number) => {
    if (!isNaN(Number(segment)) && index > 2) {
      return declarationLoading
        ? '2020 - Geriamojo vandens stebėsenos'
        : `${declarationYear} - Geriamojo vandens stebėsenos`;
    }
    switch (segment) {
      case `veiklavietes`:
        return <HomeIcon name={IconName.home} />;
      case 'pateikti':
        return 'Pateikimas';
      case 'neatitikimai':
        return 'Neatitikimai';
      default:
        return segment;
    }
  };

  const businessName = currentBusinessPlace?.name || currentBusinessPlaceDeclaration?.name;

  const breadcrumbs = pathSegments.map((segment, index) => {
    // grouping 2nd and 3rd segments into one label
    if (index === 1 && pathSegments.length > 2) {
      const path = `/${pathSegments[0]}/${pathSegments[1]}/${pathSegments[2]}`;
      const label = businessName;
      return (
        <span key={index}>
          <StyledLink to={path}>{label}</StyledLink>
          {index < pathSegments.length - 2 && ' -> '}
        </span>
      );
    }
    if (index === 2) {
      return null;
    }
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = getCrumbLabel(segment, index);
    return (
      <span key={index}>
        <StyledLink to={path}>{label}</StyledLink>
        {index < pathSegments.length - 1 && ' -> '}
      </span>
    );
  });

  if (pathSegments.length === 1) return null;
  return <BreadcrumbContainer>{breadcrumbs}</BreadcrumbContainer>;
};

export default Breadcrumb;

const BreadcrumbContainer = styled.div`
  color: black;
  margin-bottom: 40px;
`;
const HomeIcon = styled(Icon)`
  font-size: 2.4rem;
  position: relative;
  top: 5px;
  padding-top: 3px;
`;
const StyledLink = styled(Link)`
  text-decoration: none;
  color: #175cd3;

  &:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.hover.primary};
    text-decoration: underline;
  }
  background-color: #f3f4f6;
  border-radius: 4px;
  padding: 6px 12px;
  gap: 5px;
`;

const Container = styled.div`
  background-color: #f3f4f6;
  border-radius: 4px;
  padding: 6px 12px;
  display: flex;
  gap: 5px;
  width: fit-content;
`;

const Text = styled.div`
  font-size: 1.4rem;
  line-height: 14px;
`;
