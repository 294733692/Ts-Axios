export type Method =
  | 'get'
  | 'GET'
  | 'post'
  | 'POST'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'

// 请求头接口类型
export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType // typeScript内部自定义类型，"" | "arraybuffer" | "blob" | "document" | "json" | "text"
  timeout?: number
}

// 返回接口类型
export interface AxiosResponse {
  data: any
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

export interface AxiosPromise extends Promise<AxiosResponse> {}

// 扩展Error接口
export interface AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse
}

// axios公共方法，扩展接口类型
export interface Axios {
  request(config: AxiosRequestConfig): AxiosPromise

  get(url: string, config?: AxiosRequestConfig): AxiosPromise

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise

  head(url: string, config?: AxiosRequestConfig): AxiosPromise

  options(url: string, config?: AxiosRequestConfig): AxiosPromise

  post(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise

  put(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise

  patch(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise
}

// 混合对象类型接口
export interface AxiosInstance extends Axios {
  (config: AxiosRequestConfig): AxiosPromise
}
