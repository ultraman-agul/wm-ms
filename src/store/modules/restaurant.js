import {
  getCategory,
  addCategory,
  deleteCategory,
  allRestaurantNoLoc,
  getShopInfo,
} from '@/api/restaurant'
import { getItem, setItem, removeItem } from '@/utils/storage' //getItem和setItem是封装的操作localStorage的方法

export default {
  namespaced: true,
  state: {
    restaurant_id: '',
    category: [],
    restaurantList: [],
    shopInfo: getItem('shopInfo'),
  },
  mutations: {
    setShopInfo(state, data) {
      state.shopInfo = data
      console.log(data)
      setItem('shopInfo', data)
    },
    setRestaurantId(state, data) {
      state.restaurant_id = data
    },
    setCategory(state, data) {
      state.category = data
    },
    setRestaurantList(state, data) {
      state.restaurantList = data
    },
  },
  actions: {
    // 获取餐厅列表
    allRestaurantNoLoc({ commit }) {
      allRestaurantNoLoc()
        .then(data => {
          if (data.status === 200) {
            commit('setRestaurantList', data.data)
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    // 获取餐厅的食品分类
    getCategoryFn({ commit }, id) {
      getCategory({ restaurant_id: id })
        .then(data => {
          if (data.status === 200) {
            commit('setCategory', data.data)
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    // 添加食品分类
    addCategory({ dispatch, commit }, data) {
      const { category_name, restaurant_id } = data
      addCategory({
        category_name,
        restaurant_id,
      })
        .then(data => {
          console.log(data)
          dispatch('getCategoryFn', restaurant_id) // 添加成功后重新获取分类
        })
        .catch(e => {
          console.log(e)
        })
    },

    deleteCategory({ dispatch, commit }, data) {
      deleteCategory({ category_id: data.category_id }).then(res => {
        if (res.status === 200) {
          dispatch('getCategoryFn', data.restaurant_id)
        } else {
          console.error(res.message)
        }
      })
    },

    getShopInfo({ commit }, data) {
      if (data && data.restaurant_id) {
        getShopInfo({ restaurant_id: data.restaurant_id })
          .then(res => {
            if (res.status === 200) {
              commit('setShopInfo', res.data)
            }
          })
          .catch(e => {
            console.log(e)
          })
      } else {
        getShopInfo()
          .then(res => {
            if (res.status === 200) {
              commit('setShopInfo', res.data)
            }
          })
          .catch(e => {
            console.log(e)
          })
      }
    },
  },
}
