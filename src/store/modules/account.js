import { userInfo } from '@/api/user'
import { getItem, setItem, removeItem } from '@/utils/storage' //getItem和setItem是封装的操作localStorage的方法

export default {
  namespaced: true,
  state: {
    userinfo: getItem('userinfo'),
    permissionList: [],
  },
  mutations: {
    // 保存用户信息
    setUserinfo(state, data) {
      state.userinfo = data
      setItem('userinfo', data)
    },
    // 清除用户信息
    clearUserinfo(state) {
      state.userinfo = null
      removeItem('userinfo')
    },
  },
  actions: {
    // 获取用户信息
    async getUserinfo({ commit }) {
      const { status: code, data } = await userInfo()
      if (+code === 200) {
        commit('setUserinfo', data)
        return Promise.resolve(data)
      }
    },
  },
}
