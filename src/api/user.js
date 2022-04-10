import { _get, _post } from './index'

export const userLogin = data => {
  const req = {
    url: 'admin/user_login',
    data,
  }
  return _post(req)
}

export const addUser = data => {
  const req = {
    url: 'admin/add_user',
    data,
  }
  return _post(req)
}

export const editUserInfo = data => {
  const req = {
    url: 'admin/editUser',
    data,
  }
  return _post(req)
}

export const deleteUser = data => {
  const req = {
    url: 'admin/deleteUser',
    data,
  }
  return _get(req)
}

export const getAllAddress = () => {
  const req = {
    url: 'admin/get_all_address',
  }
  return _get(req)
}

export const changeAvatar = data => {
  const req = {
    url: 'admin/change_avatar',
    data,
  }
  return _post(req)
}

export const userInfo = () => {
  const req = {
    url: 'admin/user_info',
  }
  return _get(req)
}

export const allUserInfo = () => {
  const req = {
    url: 'admin/all_user_info',
  }
  return _get(req)
}

export const getAddress = data => {
  const req = {
    url: 'address/getAddress',
    data,
  }
  return _get(req)
}
