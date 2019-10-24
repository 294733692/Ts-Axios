import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  // 返回promise类型
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'get',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials
    } = config

    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    if (timeout) {
      request.timeout = timeout
    }

    // 实现跨域请求头无法带cookie等数据
    if (withCredentials) {
      request.withCredentials = withCredentials
    }

    request.open(method.toUpperCase(), url!, true)

    // 请求成功
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
      handleResponse(responseHeaders)
    }

    // 请求失败回调,网络错误处理
    request.onerror = function handleError() {
      reject(createError('Network Error', config, null, request))
    }

    // 请求超时时间,回调函数
    request.ontimeout = function handleTime() {
      reject(createError(`Timout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
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

    if (cancelToken) {
      cancelToken.promise.then(reason => {
        request.abort() // 终止发送请求
        reject(reason)
      })
    }

    request.send(data)

    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
