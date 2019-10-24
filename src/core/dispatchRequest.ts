import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import { flattenHeaders } from '../helpers/headers'
import transform from './transform'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  // TODO
  throwIFCancellationRequest(config)
  precessConfig(config)
  return xhr(config).then(res => {
    // 对响应数据responseData进行处理，转化为JSON格式
    return transforResponseData(res)
  })
}

// 处理config参数
function precessConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers, config.transformRequest!)
  config.headers = flattenHeaders(config.headers, config.method!)
}

// 处理config的url做处理
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url!, params) // buildURL url是必选参数，可能传入为空， 类型断言url不为空
}

// 处理响应response数据
function transforResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse!)
  return res
}

// 检查cancelToken是否使用过，已经使用过cancelToken，不能再次发送请求
function throwIFCancellationRequest(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
