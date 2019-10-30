import { AxiosTransformer } from '../types'

export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
): any {
  if (!fns) {
    return data
  }

  // 判断fns是不是数组, 不是数组，强制转化为长度为1的数组，方便下面统一处理
  if (!Array.isArray(fns)) {
    fns = [fns]
  }

  fns.forEach(fn => {
    data = fn(data, headers) // 通过fn执行transform转换,传入data、headers两个参数，返回data在传入，最终得到的data
  })

  return data
}
