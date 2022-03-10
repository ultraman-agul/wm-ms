import { _get, _post } from './index'

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

export const allRestaurantNoLoc = () => {
  const req = {
    url: '/v1/allRestaurantNoLoc',
  }
  return _get(req)
}

export const addCategory = data => {
  const req = {
    url: 'v1/add_category',
    data,
  }
  return _post(req)
}

export const getCategory = data => {
  const req = {
    url: `/v1/get_categories`,
    data,
  }
  return _get(req)
}

export const deleteCategory = data => {
  const req = {
    url: 'v1/deleteCategory',
    data,
  }
  return _post(req)
}
