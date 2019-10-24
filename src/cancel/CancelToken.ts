import { Canceler, CancelExecutor, CancelTokenSource } from '../types'
import Cancel from './Cancel'

interface ResolvedPromise {
  (reason?: Cancel): void
}

export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: CancelExecutor) {
    let resolvedPromise: ResolvedPromise
    // 定义实例化promise
    this.promise = new Promise<Cancel>(resolve => {
      resolvedPromise = resolve // resolve 指向 resolvedPromise，调用resolvedPromise相当于指向resolve，就能把this.promise的pending状态转化为为resolve状态
    })
    executor(message => {
      if (this.reason) {
        // 防止cancel函数多次调用，第一次进来reason是空
        return
      }
      this.reason = new Cancel(message)
      resolvedPromise(this.reason)
    })
  }

  static source(): CancelTokenSource {
    let cancel!: Canceler // 断言cancel不为空，typeScript检测不到C的返回类型
    const token = new CancelToken(c => {
      cancel = c
    })
    return {
      cancel,
      token
    }
  }
}
