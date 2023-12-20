import BusinessPlace from '../Pages/BusinessPlace';
import BusinessPlaces from '../Pages/BusinessPlaces';
import DeclarationPage from '../Pages/Declaration';
import Discrepancies from '../Pages/Discrepancies';

export const slugs = {
  businessPlaces: '/veiklavietes',
  login: '/login',
  businessPlaceDeclarations: (id: string) => `/veiklavietes/${id}/deklaracijos`,
  businessPlaceRightsDelegation: (id: string) => `/veiklavietes/${id}/teisiu-delegavimas`,
  declaration: (businessPlaceId: string, id: string) =>
    `/veiklavietes/${businessPlaceId}/deklaracijos/${id}`,
  discrepancies: (businessPlaceId: string, id: string) =>
    `/veiklavietes/${businessPlaceId}/deklaracijos/${id}/neatitikimai`,
};

export enum Ids {
  ID = ':id',
  BUSINESS_PLACE_ID = ':businessPlaceId',
}

export const routes = [
  {
    label: 'Veiklavietės',
    slug: slugs.businessPlaces,
    component: <BusinessPlaces />,
  },
  {
    slug: slugs.businessPlaceDeclarations(Ids.ID),
    component: <BusinessPlace />,
  },
  {
    slug: slugs.businessPlaceRightsDelegation(Ids.ID),
    component: <BusinessPlace />,
  },
  {
    slug: slugs.declaration(Ids.BUSINESS_PLACE_ID, Ids.ID),
    component: <DeclarationPage />,
  },
  {
    slug: slugs.discrepancies(Ids.BUSINESS_PLACE_ID, Ids.ID),
    component: <Discrepancies />,
  },
];
