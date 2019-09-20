import { AxiosPromise, AxiosRequestConfig } from './types'
import xhr from './xhr'
import { buildURL } from './helpers/url'
import { transforRequest } from './helpers/data'
import { processHeaders } from './helpers/headers'

function axios(config: AxiosRequestConfig): AxiosPromise {
  // TODO
  precessConfig(config)
  return xhr(config)
}

// 处理config参数
function precessConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.headers = transforHeaders(config)
  config.data = transforRequestData(config)
}

// 处理config的url做处理
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}

// 处理config.data
function transforRequestData(config: AxiosRequestConfig): any {
  return transforRequest(config.data)
}

// 处理请求头部config.header
function transforHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

export default axios
