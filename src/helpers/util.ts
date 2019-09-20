// 工具方法、辅助函数

const toString = Object.prototype.toString

// 判断是否是日期, 返回值使用ts类型保护
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

// 判断是否是对象，返回值使用ts类型保护
export function isObject(val: any): val is Object {
  // typeof null 会返回object，判断除不等于null的情况
  return val !== null && typeof val === 'object'
}

// 判断是否是普通对象，返回值使用ts类型保护
export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}
