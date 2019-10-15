import { AxiosInstance, AxiosRequestConfig } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'

// 通过工厂方法创建axios请求
function createInstance(config: AxiosRequestConfig): AxiosInstance {
  const context = new Axios(config) // 实例化axios
  const instance = Axios.prototype.request.bind(context) // 将instance绑定到Axios原型上，request函数会调用this，绑定上下文this指向
  extend(instance, context) // 将conext上的原型属性和实例属性全部拷贝到instance上

  return instance as AxiosInstance
}

const axios = createInstance(defaults)

export default axios
