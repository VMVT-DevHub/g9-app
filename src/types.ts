export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName?: string;
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
  groupId?: number;
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
  startDate: string;
  endDate: string;
  max: string;
  insignificant: boolean;
  insignificantDescription: string;
  userCount: number;
  type: number;
  isBelowLOQ: boolean;
  LOQValue: string;
  status: number;
  reason: any;
  action: any;
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
      Veiksmas: {
        C1: 'Susijęs su vandens baseinu: veiksmai, skirti priežasčiai pašalinti arba sušvelninti (C1)';
        C2: 'Susijęs su vandens baseinu: šaltinio pakeitimo veiksmai (C2)';
        D1: 'Susijęs su pastatų vidaus vandentiekiu: sugedusių komponentų keitimas, atjungimas arba taisymas (D1)';
        D2: 'Susijęs su pastatų vidaus vandentiekiu: užterštų komponentų valymas, šveitimas ir (arba) dezinfekavimas (D2)';
        E1: 'Skubūs veiksmai vartotojų sveikatai ir saugai: vartotojų informavimas ir nurodymai, pavyzdžiui, draudimas naudoti, vandenį virinti, užvirinimo užsakymas, laikinai riboti vartojimą (E1)';
        E2: 'Skubūs veiksmai vartotojų sveikatai ir saugai: laikinas alternatyvus geriamojo vandens tiekimas, pvz., vanduo buteliuose, vanduo taroje, cisternos (E2)';
        E3: 'Skubūs veiksmai vartotojų sveikatai ir saugai: geriamojo vandens vartojimo apribojimas jautriems naudotojams (E3)';
        E4: 'Skubūs veiksmai vartotojų sveikatai ir saugai: geriamojo vandens tiekimo uždraudimas (E4)';
        P1: 'Susijęs su vandens tiekimo skirstomuoju tinklu: sugedusių komponentų keitimas, atjungimas arba taisymas (P1)';
        P2: 'Susijęs su vandens tiekimo skirstomuoju tinklu: užterštų komponentų valymas, šveitimas ir (arba) dezinfekavimas (P2)';
        S1: 'Apsaugos priemonės, apsaugančios nuo neteisėtos prieigos (S1)';
        T1: 'Susijęs su paruošimu: paruošimo įdiegimas, atnaujinimas arba tobulinimas (T1)';
        N: 'Nėra (N)';
        O: 'Kita (O)';
      };
      Priezastis: {
        '1': 'Atsitiktinė tarša';
        '2': 'Potvynis';
        '3': 'Protrūkis';
        '4': 'Fizinė nelaimė';
        '5': 'Užsitęsusi sausra';
        '6': 'Ruošimo klaida';
        '7': 'Neplanuotas geriamojo vandens tiekimo pertrūkis';
        '8': 'Vandens trūkumas';
        '9': 'Kita';
        '10': 'Nežinoma';
      };
    };
  };
}
