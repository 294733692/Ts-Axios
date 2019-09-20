// url相关的辅助函数
import { isDate, isObject } from './util'

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

export function buildURL(url: string, params?: any): string {
  // 如果params不存在，原样返回url
  // 处理params，params可能为array或Object，统一成数组，统一成数组
  // 将数组处理成键值对形式，然后将键值对以&拆分，
  // 处理hash后面的参数
  // 拼接url
  if (!params) {
    return url
  }
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
      } else if (isObject(val)) {
        val = JSON.stringify(val)
      }
      // 添加键值对
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })
  let serializedParams = parts.join('&') // 将将键值对拆分成'&'链接的形式

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
