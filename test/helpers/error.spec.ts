import { createError } from '../../src/helpers/error'
import { AxiosRequestConfig, AxiosResponse } from '../../src/types'

describe('helpers:error', () => {
  test('should create an Error with message, config, code, request, response and isAxiosError', () => {
    const request = new XMLHttpRequest()
    const config: AxiosRequestConfig = { method: 'post' }
    const response: AxiosResponse = {
      status: 200,
      statusText: 'ok',
      headers: 'null',
      request,
      config,
      data: { foo: 'bar' }
    }
    const error = createError('Boom!', config, 'SOMETHING', request, response)
    expect(error instanceof Error).toBeTruthy()
    expect(error.message).toBe('Boom!')
    expect(error.config).toBe(config)
    expect(error.code).toBe('SOMETHING')
    expect(error.response).toBe(response)
    expect(error.request).toBe(request)
    expect(error.isAxiosError).toBeTruthy()
  })
})
