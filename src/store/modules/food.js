import { addFood } from '@/api/food'
export default {
  namespaced: true,
  state: {
    foodList: [],
  },
  mutations: {
    setfoodList(state, data) {
      state.foodList = data
    },
  },
  actions: {
    addFood({ commit }, payload) {
      addFood(payload)
        .then(data => {
          console.log(data)
        })
        .catch(e => {
          console.log(e)
        })
    },
  },
}
