import { AxiosRequestConfig } from '../types'

const strats = Object.create(null) // stratsMap

function defaultStrat(val1: any, val2: any): any {
  return typeof val2 === 'undefined' ? val2 : val1
}

function fromVal2Strat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

const stratKeysFromVal2 = ['url', 'params', 'data']

stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  // config2为非必填，先做处理
  if (!config2) {
    config2 = {}
  }

  const config = Object.create(null) // 空对象承接合并结果

  for (let key in config2) {
    mergeField(key)
  }

  for (let key in config1) {
    if (!config2[key]) {
      // config2没出现key
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    // 通过key去拿到相应的合并策略函数
    const strat = strats[key] || defaultStrat
    config[key] = strat[(config1[key], config2![key])]
  }

  return config
}
