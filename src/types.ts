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

export interface ServerDeclaration {
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
  initialOpen?: boolean;
  tableData?: { id: string; indicatorId: any; date: string; value: number }[];
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

export interface IndicatorOptionWithDiscrepancies {
  id: any;
  name: string;
  code: string;
  description: string;
  index: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  data: {
    repeats: {
      id: any;
      date: string;
      value: number;
      approved: boolean;
    }[];

    lack?: {
      id: any;
      notes: string;
      approved: boolean;
    };
    exceeded?: Exceeded[];
  };
}

export interface Exceeded {
  id: any;
  dateFrom: string;
  dateTo: string;
  max: string;
  insignificant: boolean;
  insignificantDescription: string;
  userCount: number;
  type: number;
  isBelowLOQ: boolean;
  LOQValue: string;
  status: number;
  approved: boolean;
  notes: string;
}

export interface ServerDiscrepancy {
  Trukumas: {
    Fields: ['ID', 'Rodiklis', 'Suvesta', 'Reikia', 'KitasDaznumas', 'Patvirtinta', 'Pastabos'];
    Data: any[];
  };
  Kartojasi: {
    Fields: ['ID', 'Rodiklis', 'Data', 'Reiksme', 'Patvirtinta', 'Pastabos'];
    Data: any[];
  };
  Virsijimas: {
    Fields: [
      'ID',
      'Rodiklis',
      'Nuo',
      'Iki',
      'Max',
      'Detales',
      'Nereiksmingas',
      'NereiksmApras',
      'Zmones',
      'Tipas',
      'LOQVerte',
      'LOQReiksme',
      'Statusas',
      'Patvirtinta',
      'Pastabos',
    ];
    Data: any[];
    Lookup: {
      Tipas: {
        '1': 'Reprezentatyvi vieta pastatų vidaus vandentiekio tinkle';
        '2': 'Čiaupas patalpoje ar objekte';
        '3': 'Vieta, kurioje vanduo  išpilstomas į butelius ar talpyklas';
        '4': 'Vieta, kurioje vanduo naudojamas maisto tvarkymo įmonėje';
        '5': 'Vieta, kurioje vanduo išteka iš cisternos';
      };
      Statusas: {
        '1': 'Įrašas patvirtinamas kaip teisingas';
        '2': 'Trūksta stebimos vertės, stebima vertė nėra svarbi arba nereikšminga';
        '3': 'Trūksta pastebėtos vertės, daugiau informacijos nėra';
      };
    };
  };
}
