import { _postImg } from './index'
// 上传
export const uploadFoodPic = data => {
  console.log(data)
  const formData = new FormData()
  Object.keys(data).forEach(key => {
    formData.append(key, data[key])
  })
  const req = {
    data: formData,
    url: 'upload/uploadFoodPic',
  }
  return _postImg(req)
}

export const uploadShopAvatar = data => {
  console.log(data)
  const formData = new FormData()
  Object.keys(data).forEach(key => {
    formData.append(key, data[key])
  })
  const req = {
    data: formData,
    url: 'upload/uploadShopAvatar',
  }
  return _postImg(req)
}
