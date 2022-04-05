<template>
  <div class="base-echarts">
    <div
      class="echarts-wrap"
      ref="baseEcharts"
      :style="{ width: width, height: height }"
    ></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import ChinaMapData from './data/china.json'
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '260px',
    },
    option: {
      type: Object,
      required: true,
      default: () => {},
    },
    showMap: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    function initEcharts() {
      if (this.showMap) {
        echarts.registerMap('china', ChinaMapData)
      }
      let echartsInstance = echarts.init(this.$refs.baseEcharts)
      echartsInstance.setOption(this.option)
    }
    initEcharts()
  },
})
</script>

<style scoped lang="scss"></style>
