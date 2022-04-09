<template>
  <div class="base-echarts">
    <div
      class="echarts-wrap"
      :id="name"
      :style="{ width: width, height: height }"
    ></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import ChinaMapData from './data/china.json'
import { defineComponent, ref, onMounted } from 'vue'
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
    name: {
      type: String,
      default: 'myChart',
    },
  },
  setup(props) {
    function initEcharts() {
      if (props.showMap) {
        echarts.registerMap('china', ChinaMapData)
      }
      onMounted(() => {
        let echartsInstance = echarts.init(document.getElementById(props.name))
        echartsInstance.setOption(props.option)
      })
    }
    initEcharts()
  },
})
</script>

<style scoped lang="scss"></style>
