export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  [key: string]: any;
}

export type ChildrenType = string | JSX.Element | JSX.Element[] | any;
