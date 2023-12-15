import Axios, { AxiosInstance, AxiosResponse } from 'axios';

interface GetAll {
  resource: string;
  [key: string]: any;
}

interface GetOne {
  resource: string;
  [key: string]: any;
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

  post = async ({ resource, id, params }: Post) => {
    return this.errorWrapper(() => this.axiosApi.post(`/${resource}${id ? `/${id}` : ''}`, params));
  };

  getUserInfo = async (): Promise<any> => {
    return this.get({
      resource: 'api/user',
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
