import { AxiosRequestConfig } from './types'
import xhr from './xhr'
import { buildURL } from './helpers/url'
import { transforRequest } from './helpers/data'

function axios(config: AxiosRequestConfig): void {
  // TODO
  precessConfig(config)
  xhr(config)
}

// 处理config参数
function precessConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.data = transforRequestData(config)
}

// 处理config的url做处理
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}

function transforRequestData(config: AxiosRequestConfig): any {
  return transforRequest(config.data)
}

export default axios
