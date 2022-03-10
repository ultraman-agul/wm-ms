import { _get, _post } from './index'

export const addFood = data => {
  const req = {
    url: 'v1/addFood',
    data,
  }
  return _post(req)
}
