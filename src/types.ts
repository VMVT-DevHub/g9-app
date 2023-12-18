export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  adminRoles: number[];
  [key: string]: any;
}

export interface DeleteInfoProps {
  deleteButtonText?: string;
  deleteDescriptionFirstPart?: string;
  deleteDescriptionSecondPart?: string;
  deleteTitle?: string;
  deleteName?: string;
  handleDelete?: (props?: any) => void;
}

export type ChildrenType = string | JSX.Element | JSX.Element[] | any;
