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

  transformRequest: [
    function(data: any, headers: any): any {
      processHeaders(data, headers)
      return transforRequest(data)
    }
  ],
  transformResponse: [
    function(data: any): any {
      return transforResponse(data)
    }
  ]
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
