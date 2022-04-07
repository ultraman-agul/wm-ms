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
