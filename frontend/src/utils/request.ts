// src/utils/request.ts
import _ from "lodash";
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  Method,
} from "axios";
import config from "./config"; 

const ax: AxiosInstance = axios.create({
  baseURL: config.api,
});

function responseData<T>(res: AxiosResponse<T>): T {
  return res.data;
}

function checkStatus<T>(res: AxiosResponse<T>): AxiosResponse<T> {
  if (res.status >= 200 && res.status < 300) {
    return res;
  }

  const error = new Error(res.statusText) as Error & { response?: AxiosResponse<T> };
  error.response = res;
  throw error;
}

function call<T = any>(
  _path: string,
  _method: Method,
  _params: any = {},
  _extendOption: AxiosRequestConfig = {}
): Promise<T> {
  let option: AxiosRequestConfig = {
    url: _path,
    method: _method,
    timeout: _extendOption.timeout || 60000,
  };

  const upperMethod = _.toUpper(_method) as Uppercase<Method>;

  switch (upperMethod) {
    case "PUT":
    case "POST":
    case "PATCH":
      option.data = _params;
      break;
    case "GET":
    case "DELETE":
      option.params = _params;
      break;
    default:
      option.params = upperMethod === "HEAD" || upperMethod === "OPTIONS" ? _params : undefined;
      option.data = upperMethod !== "HEAD" && upperMethod !== "OPTIONS" ? _params : undefined;
      break;
  }

  option = {
    ...option,
    ..._extendOption,
  } as AxiosRequestConfig; 

  return ax.request<T>(option)
    .then(checkStatus)
    .then(responseData);
}

function generateShortCutMethod(_method: Method) {
  // 使用泛型確保快捷方法的類型安全
  return <T = any>(
    _path: string,
    _params: any = {},
    _extendOption: AxiosRequestConfig = {}
  ): Promise<T> => {
    return call<T>(_path, _method, _params, _extendOption);
  };
}

interface HttpClient {
  call: typeof call;
  get: <T = any>(path: string, params?: any, options?: AxiosRequestConfig) => Promise<T>;
  post: <T = any>(path: string, data?: any, options?: AxiosRequestConfig) => Promise<T>;
  put: <T = any>(path: string, data?: any, options?: AxiosRequestConfig) => Promise<T>;
  patch: <T = any>(path: string, data?: any, options?: AxiosRequestConfig) => Promise<T>;
  delete: <T = any>(path: string, params?: any, options?: AxiosRequestConfig) => Promise<T>;
}

const httpClient: HttpClient = {
  call,
  get: generateShortCutMethod("GET"),
  post: generateShortCutMethod("POST"),
  put: generateShortCutMethod("PUT"),
  patch: generateShortCutMethod("PATCH"),
  delete: generateShortCutMethod("DELETE"),
};

export default httpClient;