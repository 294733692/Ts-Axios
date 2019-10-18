import { AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'

// 通过工厂方法创建axios请求
function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config) // 实例化axios
  const instance = Axios.prototype.request.bind(context) // 将instance绑定到Axios原型上，request函数会调用this，绑定上下文this指向
  extend(instance, context) // 将conext上的原型属性和实例属性全部拷贝到instance上

  return instance as AxiosStatic
}

const axios = createInstance(defaults)

axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config))
}

export default axios
