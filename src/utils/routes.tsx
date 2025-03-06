import BusinessPlace from '../Pages/BusinessPlace';
import BusinessPlaces from '../Pages/BusinessPlaces';
import DeclarationPage from '../Pages/Declaration';
import IndicatorDeclarationPage from '../Pages/IndicatorDeclaration';
import Discrepancies from '../Pages/Discrepancies';
import SubmitDeclaration from '../Pages/SubmitDeclaration';

export const slugs = {
  businessPlaces: '/veiklavietes',
  login: '/login',
  businessPlaceDeclarations: (id: string) => `/veiklavietes/${id}/deklaracijos`,
  businessPlaceRightsDelegation: (id: string) => `/veiklavietes/${id}/teisiu-delegavimas`,
  declaration: (businessPlaceId: string, id: string) =>
    `/veiklavietes/${businessPlaceId}/deklaracijos/${id}`,
  submitDeclaration: (businessPlaceId: string, id: string) =>
    `/veiklavietes/${businessPlaceId}/deklaracijos/${id}/pateikti`,
  discrepancies: (businessPlaceId: string, id: string) =>
    `/veiklavietes/${businessPlaceId}/deklaracijos/${id}/neatitikimai`,
  indicatorDeclaration: (businessPlaceId: string, id: string, date: string) =>
    `/veiklavietes/${businessPlaceId}/deklaracijos/${id}/${date}`,
};

export enum Ids {
  ID = ':id',
  BUSINESS_PLACE_ID = ':businessPlaceId',
  DATE = ':date'
}

export const routes = [
  {
    label: 'Geriamojo vandens tiekimo sistemos',
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
    slug: slugs.indicatorDeclaration(Ids.BUSINESS_PLACE_ID, Ids.ID, Ids.DATE),
    component: <IndicatorDeclarationPage />,
  },
  {
    slug: slugs.discrepancies(Ids.BUSINESS_PLACE_ID, Ids.ID),
    component: <Discrepancies />,
  },
  {
    slug: slugs.submitDeclaration(Ids.BUSINESS_PLACE_ID, Ids.ID),
    component: <SubmitDeclaration />,
  },
];
