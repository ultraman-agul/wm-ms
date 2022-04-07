import { getItem, setItem, removeItem } from '@/utils/storage' //getItem和setItem是封装的操作localStorage的方法
import { AesEncryption } from '@/utils/encrypt'
import { toRaw } from 'vue'
export const TOKEN = 'AGUL-TOKEN'
const COLLAPSE = 'AGUL-COLLAPSE'

export default {
  namespaced: true,
  state: {
    title: 'AGUL ADMIN',
    authorization: getItem(TOKEN),
    sidebar: {
      collapse: getItem(COLLAPSE),
    },
    device: 'desktop',
  },
  mutations: {
    setToken(state, data) {
      state.authorization = data
      // 保存到localStorage
      setItem(TOKEN, data)
    },
    clearToken(state) {
      state.authorization = ''

      removeItem(TOKEN)
    },
    setCollapse(state, data) {
      state.sidebar.collapse = data
      // 保存到localStorage
      setItem(COLLAPSE, data)
    },
    clearCollapse(state) {
      state.sidebar.collapse = ''

      removeItem(COLLAPSE)
    },
    setDevice(state, device) {
      state.device = device
    },
  },
  actions: {
    setToken({ commit, dispatch }, payload) {
      dispatch('clearToken')
      commit('setToken', payload)
    },
    clearToken({ commit }) {
      // 清除token
      commit('clearToken')
      // 清除用户信息
      commit('account/clearUserinfo', '', { root: true })
      // 清除标签栏
      commit('tags/CLEAR_ALL_TAGS', '', { root: true })
      // 清空menus
      commit('menu/SET_MENUS', [], { root: true })
      // 清空餐馆信息
      commit('restaurant/setShopInfo', '', { root: true })
    },
    setScreenCode({ commit, state }, password) {
      const authorization = toRaw(state.authorization)

      if (!password) {
        try {
          delete authorization.screenCode
        } catch (err) {
          console.log(err)
        }
        commit('setToken', authorization)

        return
      }

      // 对密码加密
      const screenCode = new AesEncryption().encryptByAES(password)

      commit('setToken', {
        ...authorization,
        screenCode,
      })
    },
  },
}
