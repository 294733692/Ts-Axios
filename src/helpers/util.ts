// 工具方法、辅助函数
const toString = Object.prototype.toString

// 判断是否是日期, 返回值使用ts类型保护
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

// // 判断是否是对象，返回值使用ts类型保护
// export function isObject(val: any): val is Object {
//   // typeof null 会返回object，判断除不等于null的情况
//   return val !== null && typeof val === 'object'
// }

// 判断是否是普通对象，返回值使用ts类型保护
export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

// 判断类型是否是FormData类型，返回值使用ts类型保护
export function isFormData(val: any): val is FormData {
  return typeof val !== 'undefined' && val instanceof FormData
}

// 判断类型是否是URLSearchParams类型，返回值使用ts类型保护
export function isURLSearchParams(val: any): val is URLSearchParams {
  return typeof val !== 'undefined' && val instanceof URLSearchParams
}

// 混合对象拷贝
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

// 深度拷贝
export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)

  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })
  return result
}
