import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'
import { isFormData } from '../helpers/util'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  // 返回promise类型
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'get',
      headers = {},
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config

    const request = new XMLHttpRequest()

    request.open(method.toUpperCase(), url!, true)

    configureRequest()

    addEvents()

    processHeaders()

    processCancel()

    request.send(data)

    // 配置request对象
    function configureRequest(): void {
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
    }

    // request添加事件处理函数
    function addEvents(): void {
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
        reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
      }

      // 下载文件进度监控
      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      // 上传文件进度监控
      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    // 处理请求headers
    function processHeaders(): void {
      // 判断上传类型是否是FormData类型，揽储headers的Content-Type属性
      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName)

        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }

      if (auth) {
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
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
    }

    // cancel请求取消相关函数
    function processCancel(): void {
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort() // 终止发送请求
          reject(reason)
        })
      }
    }

    function handleResponse(response: AxiosResponse): void {
      if (!validateStatus || validateStatus(response.status)) {
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
