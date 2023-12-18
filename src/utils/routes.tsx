import BusinessPlace from '../Pages/BusinessPlace';
import BusinessPlaces from '../Pages/BusinessPlaces';

export const slugs = {
  businessPlaces: '/veiklavietes',
  login: '/login',
  businessPlaceDeclarations: (id: string) => `/veiklavietes/${id}/deklaracijos`,
  businessPlaceRightsDelegation: (id: string) => `/veiklavietes/${id}/teisiu-delegavimas`,
};

export enum Ids {
  ID = ':id',
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
];
