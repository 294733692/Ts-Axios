import { AxiosRequestConfig } from './types'
import xhr from './xhr'
import { buildURL } from './helpers/url'

function axios(config: AxiosRequestConfig): void {
  // TODO
  precessConfig(config)
  xhr(config)
}

// 处理config参数
function precessConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
}

// 处理config的url做处理
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}

export default axios
