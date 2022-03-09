import { _get } from './index'

export const getAllResturant = data => {
  const req = {
    url: '/v1/all_restaurant',
    data,
  }

  return _get(req)
}

export const getResturantById = data => {
  const req = {
    url: '/v1/restaurant/' + data.id,
  }
  return _get(req)
}
