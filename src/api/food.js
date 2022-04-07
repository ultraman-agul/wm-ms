import { _get, _post } from './index'

export const addFood = data => {
  const req = {
    url: 'v1/addFood',
    data,
  }
  return _post(req)
}

export const getFoods = data => {
  const req = {
    url: 'v1/getFoods',
    data,
  }
  return _get(req)
}

export const setFood = data => {
  const req = {
    url: 'v1/setFood',
    data,
  }
  return _post(req)
}

export const deleteFood = data => {
  const req = {
    url: 'v1/deleteFood',
    data,
  }
  return _get(req)
}
