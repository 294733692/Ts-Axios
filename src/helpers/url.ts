// url相关的辅助函数
import { isDate, isPlainObject, isURLSearchParams } from './util'

interface URLOrigin {
  protocol: string
  host: string
}

// 转化encode，将特殊字符转化回来
function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
): string {
  // 如果params不存在，原样返回url
  // params三种类型，1、paramsSerializer 2、URLSearchParams 3、默认类型
  // 默认类型处理params，params可能为array或Object，统一成数组，统一成数组
  // 将数组处理成键值对形式，然后将键值对以&拆分，
  // 处理hash后面的参数
  // 拼接url
  if (!params) {
    return url
  }
  let serializedParams
  if (paramsSerializer) {
    // 自定义参数序列化
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    // 判断是否是URLSearchParams类型，是就返回params的string类型
    serializedParams = params.toString()
  } else {
    // 默认规则
    const parts: string[] = []

    Object.keys(params).forEach(key => {
      const val = params[key]
      // 如果val为空，直接终止本次循环
      if (val == null || typeof val === 'undefined') {
        return
      }
      let values = [] // val 可能为Array或Object，临时数组val，统一处理

      if (Array.isArray(val)) {
        values = val
        key += '[]'
      } else {
        values = [val]
      }

      values.forEach(val => {
        if (isDate(val)) {
          val = val.toISOString()
        } else if (isPlainObject(val)) {
          val = JSON.stringify(val)
        }
        // 添加键值对
        parts.push(`${encode(key)}=${encode(val)}`)
      })
    })
    serializedParams = parts.join('&') // 将将键值对拆分成'&'链接的形式
  }

  if (serializedParams) {
    // 处理hash，忽略hash后面的东西
    const markIndex = url.indexOf('#') // 判断url里面是否有hash值
    if (markIndex !== -1) {
      // 存在，截取
      url = url.slice(0, markIndex)
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}

// 判断url是否是绝对地址
export function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL: string, relativeRUL?: string): string {
  return relativeRUL ? baseURL.replace(/\/+$/, '') + '/' + relativeRUL.replace(/^\/+/, '') : baseURL
}

/**
 * 判断url是否同源
 * 1、协议
 * 2、域名
 */
export function isURLSameOrigin(requestUrl: string): boolean {
  const parsedOrigin = resolveUrl(requestUrl)

  return (
    parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
  )
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveUrl(window.location.href)

function resolveUrl(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)

  const { protocol, host } = urlParsingNode
  return {
    protocol,
    host
  }
}
