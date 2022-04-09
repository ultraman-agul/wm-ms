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

export const getOrderByRestaurantId = data => {
  const req = {
    url: '/v1/getOrderByRestaurantId',
    data,
  }
  return _get(req)
}

export const getTodayOrderByRestaurantId = data => {
  const req = {
    url: '/v1/getTodayOrderByRestaurantId',
    data,
  }
  return _get(req)
}

export const orderGroupByDay = data => {
  const req = {
    url: '/v1/orderGroupByDay',
    data,
  }
  return _get(req)
}
