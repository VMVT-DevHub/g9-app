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

export interface Declaration {
  Fields: [
    'ID',
    'GVTS',
    'Metai',
    'Stebesenos',
    'Statusas',
    'Kiekis',
    'Vartotojai',
    'RuosimoMedziagos',
    'DeklarDate',
    'DeklarUser',
    'RedagDate',
    'RedagUser',
  ];
  Data: any[];
  Lookup: {
    Stebesenos: { [key: string]: string };
    Statusas: { [key: string]: string };
    RuosimoMedziagos: { [key: string]: string };
  };
}

export interface IndicatorOption {
  id: any;
  groupId: any;
  name: string;
  code: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  digitsAfterComma: number | undefined;
  description: string;
  tableData?: { id: string; indicatorId: any; date: string; value: number }[];
}
