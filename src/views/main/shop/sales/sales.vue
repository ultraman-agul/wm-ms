<template>
  <div class="bill">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card title="店铺食品销量">
          <my-chart
            :option="soldOption"
            v-if="soldOption.series[0].name"
          ></my-chart>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card title="店铺账单">
          <my-chart
            :option="billOption"
            v-if="billOption.series[0].data.length"
          ></my-chart>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card title="订单地点分布">
          <my-chart
            :showMap="true"
            height="400px"
            :option="mapOption"
            v-if="mapOption.series[2].data.length"
          ></my-chart>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MyChart from '@/components/MyChart/index.vue'
import { defineComponent, reactive } from 'vue'
import { soldOption, billOption, mapOption } from './chartHelper'
export default defineComponent({
  components: { MyChart },
  setup() {
    const state = reactive({
      soldOption,
      billOption,
      mapOption,
      // 获取店铺销售数量
      getSold() {
        state.$api.shopApis.getSold().then(res => {
          if (res.code == 200) {
            let xAxisData = [],
              seriesData = [],
              seriesName = '已售'
            for (let item of res.data) {
              xAxisData.push(item.name)
              seriesData.push(item.sold)
            }
            state.soldOption.xAxis[0].data = xAxisData
            state.soldOption.series[0].data = seriesData
            state.soldOption.series[0].name = seriesName
          } else {
            state.$message({ type: 'error', message: res.message })
          }
        })
      },
      // 获取店铺流水
      getBill() {
        state.$api.shopApis.getBill().then(res => {
          if (res.code == 200) {
            const seriesData = []
            const data = res.data[0]
            for (let i of Object.keys(data)) {
              const temp = {}
              temp.value = data[i]
              temp.name = i
              seriesData.push(temp)
            }
            state.billOption.series[0].data = seriesData
          } else {
            state.$message({ type: 'error', message: res.message })
          }
        })
      },
      // 获取订单的分布以及数量
      getMapData() {
        state.$api.shopApis.getMapData().then(res => {
          if (res.code == 200) {
            const seriesData = state.$utils.convertData(res.data)
            state.mapOption.series[0].data = seriesData
            state.mapOption.series[1].data = res.data
            state.mapOption.series[2].data = seriesData
          }
        })
      },
    })
    // state.getSold()
    // state.getBill()
    // state.getMapData()
  },
})
</script>

<style scoped lang="scss">
.el-row {
  margin-bottom: 30px;
}
</style>
