import {AxiosPromise, AxiosRequestConfig, AxiosResponse, Method, RejectedFn, ResolvedFn} from '../types'
import dispatchRequest from './dispatchRequest'
import interceptorManager from "./interceptorManager";

interface Interceptors {
  request: interceptorManager<AxiosRequestConfig>,
  response: interceptorManager<AxiosResponse>
}

interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}

export default class Axios {
  interceptors: Interceptors

  constructor() {
    this.interceptors = {
      // 用户自己添加拦截器，例如this.interceptors.request/response.use
      request: new interceptorManager<AxiosRequestConfig>(),
      response: new interceptorManager<AxiosResponse>()
    }
  }

  request(url: any, config?: any): AxiosPromise {
    // 支持接口类型AxiosInstance第二种，参数变为any，在运行的时候做判断
    if (typeof url === 'string') {
      // 传入url，满足接口类型第二种类型
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      // 未传入url，满足接口类型第一种类型
      config = url
    }

    // 定义request链
    const chain: PromiseChain<any>[] = [{  // 用于存放一堆拦截器和初始值
      resolved: dispatchRequest,
      rejected: undefined
    }]

    // 添加request拦截器
    this.interceptors.request.forEach(interceptor => {
      // 添加的拦截器要先执行
      chain.unshift(interceptor)
    })

    // 添加response拦截器
    this.interceptors.response.forEach(interceptor => {
      // 先添加的后执行
      chain.push(interceptor)
    })

    let promise = Promise.resolve(config)

    while (chain.length) {
      const {resolved, rejected} = chain.shift()!  // chain.shift可能为promise.chain类型，也可能为空，类型断言shift不为空
      promise = promise.then(resolved, rejected)
    }

    return promise
  }

  get(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }

  delete(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }

  head(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('head', url, config)
  }

  options(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('options', url, config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('post', url, data, config)
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('patch', url, data, config)
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('put', url, data, config)
  }

  _requestMethodWithoutData(
    method: Method,
    url: string,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        // config可能为空，默认赋值为对象
        method,
        url
      })
    )
  }

  _requestMethodWithData(
    method: Method,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        // config可能为空，默认赋值为对象
        method,
        url,
        data
      })
    )
  }
}
