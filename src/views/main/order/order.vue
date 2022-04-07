<template>
  <div class="main-content">abc</div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  ref,
  computed,
  watch,
} from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const { proxy: ctx } = getCurrentInstance()
    const store = useStore()
    const state = reactive({})

    return {
      ...toRefs(state),
    }
  },
})
</script>
