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
  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]
  cancelToken?: CancelToken

  [propName: string]: any
}

// 返回接口类型
export interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

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
  defaults: AxiosRequestConfig
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }

  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  post<T = any>(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise<T>

  put<T = any>(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise<T>

  patch<T = any>(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

// 混合对象类型接口
export interface AxiosInstance extends Axios {
  (config: AxiosRequestConfig): AxiosPromise

  // 函数重载, 支持axios(url, config)类型
  (url: string, config?: AxiosRequestConfig): AxiosPromise
}

// 扩展create静态方法
export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance
}

// 拦截器管理类对外泛型接口
export interface AxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number // 创建拦截器返回一个ID，

  eject(id: number): void // 删除拦截器传入ID就可以了
}

export interface ResolvedFn<T> {
  (val: T): T | Promise<T>
}

export interface RejectedFn {
  (error: any): any
}

export interface AxiosTransformer {
  (data: any, headers?: any): any
}

export interface CancelToken {
  promise: Promise<string>
  reason?: string // 代表Promise Resolved函数的参数
}

// 取消方法接口
export interface Canceler {
  (message?: string): void // 取消返回的信息
}

// 传给CancelToken的参数类型
export interface CancelExecutor {
  (cancel: Canceler): void
}
