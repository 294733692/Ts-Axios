// 默认配置
import { AxiosRequestConfig } from './types'
import { processHeaders } from './helpers/headers'
import { transforRequest, transforResponse } from './helpers/data'

const defaults: AxiosRequestConfig = {
  method: 'GET',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },
  xsrfCookieName: 'XSRF-TOKNE',
  xsrfHeaderName: 'X-XSRF-TOKNE',

  transformRequest: [
    function(data: any, headers: any): any {
      processHeaders(headers, data)
      return transforRequest(data)
    }
  ],

  transformResponse: [
    function(data: any): any {
      return transforResponse(data)
    }
  ],

  // 合法状态码默认配置
  validateStatus(status: number): boolean {
    return status >= 200 && status < 300
  }
}
const methodsNoData = ['delete', 'get', 'head', 'options']

methodsNoData.forEach(method => {
  defaults.headers[method] = {}
})

const methodsWithData = ['post', 'put', 'patch']
methodsWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default defaults
