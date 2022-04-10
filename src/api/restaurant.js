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

export const getHasShop = () => {
  const req = {
    url: 'v1/hasShop',
  }
  return _get(req)
}

export const locationSearch = data => {
  const req = {
    url: 'v1/location_search',
    data,
  }
  return _get(req)
}

export const createShop = data => {
  const req = {
    url: 'v1/createShop',
    data,
  }
  return _post(req)
}

export const getShopInfo = data => {
  const req = {
    url: 'v1/getShopInfo',
    data,
  }
  return _get(req)
}

export const updateActivities = data => {
  const req = {
    url: 'v1/updateActivities',
    data,
  }
  return _get(req)
}

export const updateShop = data => {
  const req = {
    url: 'v1/updateShop',
    data,
  }
  return _post(req)
}

export const restaurantComment = data => {
  const req = {
    url: '/v1/restaurantComment',
    data,
  }
  return _get(req)
}

export const replyComment = data => {
  const req = {
    url: '/v1/replyComment',
    data,
  }
  return _get(req)
}
