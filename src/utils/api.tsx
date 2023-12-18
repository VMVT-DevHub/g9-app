import Axios, { AxiosInstance, AxiosResponse } from 'axios';

interface GetAll {
  resource: string;
  [key: string]: any;
}

interface GetOne {
  resource: string;
  [key: string]: any;
}

interface Delete {
  resource: string;
  id: string;
}

interface Patch {
  resource?: string;
  [key: string]: any;
}

interface Post {
  resource: string;
  [key: string]: any;
}

class Api {
  private axiosApi: AxiosInstance;

  constructor() {
    this.axiosApi = Axios.create();
  }

  errorWrapper = async (endpoint: () => Promise<AxiosResponse<any, any>>) => {
    const res = await endpoint();
    return res.data;
  };

  get = async ({ resource, id }: GetAll) => {
    return this.errorWrapper(() => this.axiosApi.get(`/${resource}${id ? `/${id}` : ''}`));
  };

  getOne = async ({ resource, id }: GetOne) => {
    return this.errorWrapper(() => this.axiosApi.get(`/${resource}${id ? `/${id}` : ''}`));
  };

  patch = async ({ resource, id, params }: Patch) => {
    return this.errorWrapper(() =>
      this.axiosApi.patch(`/${resource}/${id ? `/${id}` : ''}`, params),
    );
  };

  delete = async ({ resource, id }: Delete) => {
    return this.errorWrapper(() => this.axiosApi.delete(`/${resource}/${id}`));
  };

  post = async ({ resource, id, params }: Post) => {
    return this.errorWrapper(() => this.axiosApi.post(`/${resource}${id ? `/${id}` : ''}`, params));
  };

  getUserInfo = async (): Promise<{
    Email: string;
    FName: string;
    LName: string;
    Phone: string;
    Admin: Number[];
    ID: string;
  }> => {
    return this.get({
      resource: 'api/user',
    });
  };

  getBusinessPlaces = async (): Promise<{
    GVTS: { Data: [number, number, string, string]; Fields: ['ID', 'JA', 'Title', 'Addr'] };
  }> => {
    return this.get({
      resource: 'api/veiklos',
    });
  };

  getUsers = async (): Promise<{
    Users: { Data: any[]; Fields: ['GVTS', 'ID', 'FName', 'LName', 'Admin', 'LastLogin'] };
  }> => {
    return this.get({
      resource: 'api/deleg',
    });
  };

  deleteUser = async (businessPlaceId: string, id: string): Promise<any> => {
    return this.delete({
      resource: `api/deleg/${businessPlaceId}`,
      id,
    });
  };

  createUser = async (id: string, params: any): Promise<any> => {
    return this.post({
      resource: `api/deleg`,
      params,
      id,
    });
  };

  getDeclarations = async (
    id: string,
  ): Promise<{
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
  }> => {
    return this.getOne({
      resource: 'api/deklaracijos',
      id,
    });
  };

  logout = async (): Promise<any> => {
    return this.get({
      resource: 'auth/logout',
    });
  };
}

const api = new Api();

export default api;
