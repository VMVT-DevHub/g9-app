import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ServerDeclaration, ServerDiscrepancy } from '../types';

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
  params?: any;
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

  delete = async ({ resource, id, params }: Delete) => {
    return this.errorWrapper(() => this.axiosApi.delete(`/${resource}/${id}`, params));
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

  getIndicators = async (): Promise<{
    Rodikliai: {
      Fields: [
        'ID',
        'Grupe',
        'Kodas',
        'Pavadinimas',
        'Daznumas',
        'Min',
        'Max',
        'Step',
        'Vnt',
        'Aprasymas',
      ];
      Data: any[];
      Lookup: {
        Grupe: {
          [key: string]: string;
        };
        GrupesValidacija: {
          [key: string]: string;
        };
        Daznumas: {
          [key: string]: string;
        };
      };
    };
  }> => {
    return this.get({
      resource: `api/rodikliai`,
    });
  };

  getDeclarations = async (id: string): Promise<ServerDeclaration> => {
    return this.getOne({
      resource: 'api/deklaracijos',
      id,
    });
  };

  getDeclaration = async (id: string): Promise<ServerDeclaration> => {
    return this.getOne({
      resource: `api/deklaracija`,
      id,
    });
  };

  updateDeclaration = async (id: string, params: any): Promise<ServerDeclaration> => {
    return this.post({
      resource: `api/deklaracija`,
      params,
      id,
    });
  };

  getDiscrepancies = async (id: string): Promise<ServerDiscrepancy> => {
    return this.getOne({
      resource: `api/neatitiktys`,
      id,
    });
  };

  updateDiscrepancies = async (id: string, params: any): Promise<ServerDiscrepancy> => {
    return this.post({
      resource: `api/neatitiktys`,
      params,
      id,
    });
  };

  getValues = async (
    id: string,
  ): Promise<{ Data: any[]; Fields: ['ID', 'Deklaracija', 'Rodiklis', 'Data', 'Reiksme'] }> => {
    return this.getOne({
      resource: `api/reiksmes`,
      id,
    });
  };

  postValue = async (id: string, params: any): Promise<any> => {
    return this.post({
      resource: `api/reiksmes`,
      params,
      id,
    });
  };

  deleteValue = async (id: string, params: any): Promise<any> => {
    return this.delete({
      resource: `api/reiksmes`,
      params: { data: params },
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
