import { CancelExecutor } from '../types'

interface ResolvedPromise {
  (reason?: string): void
}

export default class CancelToken {
  promise: Promise<string>
  reason?: string

  constructor(executor: CancelExecutor) {
    let resolvedPromise: ResolvedPromise
    // 定义实例化promise
    this.promise = new Promise<string>(resolve => {
      resolvedPromise = resolve // resolve 指向 resolvedPromise，调用resolvedPromise相当于指向resolve，就能把this.promise的pending状态转化为为resolve状态
    })
    executor(message => {
      if (this.reason) {
        // 防止cancel函数多次调用，第一次进来reason是空
        return
      }
      this.reason = message
      resolvedPromise(this.reason)
    })
  }
}
