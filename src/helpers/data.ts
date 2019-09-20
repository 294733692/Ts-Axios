import { isPlainObject } from './util'

// 处理data，将其转化为字符串对象形式
export function transforRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

// 响应数据data处理，将返回数据统一处理成json格式进行返回
export function transforResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // do nothing
    }
  }
  return data
}
