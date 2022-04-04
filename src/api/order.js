import { _get, _post } from './index'

export const order = data => {
  const req = {
    url: 'v1/order',
    data,
  }
  return _post(req)
}

export const getOrder = data => {
  const req = {
    url: '/v1/getOrder',
    data,
  }
  return _get(req)
}