import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from './types'
import { parseHeaders } from './helpers/headers'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  // 返回promise类型
  return new Promise(resolve => {
    const { data = null, url, method = 'get', headers, responseType } = config

    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    request.open(method.toUpperCase(), url, true)

    request.onreadystatechange = function handleLoad() {
      // 判断请求状态是否成功
      if (request.readyState !== 4) {
        return
      }
      const reponseHeaders = parseHeaders(request.getAllResponseHeaders()) // 获取responseHeaders
      const responseDate = responseType !== 'text' ? request.response : request.responseText // 获取返回内容

      // 构造返回对象
      const responseHeaders: AxiosResponse = {
        data: responseDate,
        status: request.status,
        statusText: request.statusText,
        headers: reponseHeaders,
        config,
        request
      }
      resolve(responseHeaders)
    }

    // 设置header请求头
    Object.keys(headers).forEach(name => {
      // 没有requset body的数据的时候，'content-type'存在没意义
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    request.send(data)
  })
}
