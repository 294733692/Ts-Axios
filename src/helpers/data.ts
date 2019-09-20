import { isPlainObject } from './util'

// 处理data，将其转化为字符串对象形式
export function transforRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}
