<template>
  <div class="bill">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <my-chart
            :option="soldOption"
            name="sold"
            v-if="soldOption.series[0].name"
          ></my-chart>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <my-chart
            :option="orderOption"
            name="order"
            v-if="orderOption.series[0].name"
          ></my-chart>
        </el-card>
      </el-col>
    </el-row>
    <!-- <el-row :gutter="20">
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
    </el-row> -->
  </div>
</template>

<script>
import MyChart from '@/components/MyChart/index.vue'
import {
  defineComponent,
  reactive,
  computed,
  getCurrentInstance,
  toRefs,
} from 'vue'
import { soldOption, orderOption, mapOption } from './chartHelper'
import { getFoods } from '@/api/food'
import { orderGroupByDay } from '@/api/order'
import { useStore } from 'vuex'

export default defineComponent({
  components: { MyChart },
  setup() {
    const store = useStore()
    const { proxy: ctx } = getCurrentInstance()
    const restaurant_id = computed(() => store.state.restaurant.shopInfo.id)
    const state = reactive({
      soldOption,
      orderOption,
      mapOption,
      // 获取店铺销售数量
      getSold() {
        getFoods({ restaurant_id: restaurant_id.value }).then(res => {
          if (res.status == 200) {
            let xAxisData = [],
              seriesData = [],
              seriesName = '已售'
            res.data.forEach(item => {
              for (let subItem of item.spus) {
                xAxisData.push(subItem.name)
                seriesData.push(subItem.month_saled)
              }
            })
            state.soldOption.xAxis[0].data = xAxisData
            state.soldOption.series[0].data = seriesData
            state.soldOption.series[0].name = seriesName
          } else {
            ctx.$message({ type: 'error', message: res.message })
          }
        })
      },
      // 获取每日订单数量
      getOrderByDay() {
        orderGroupByDay({ restaurant_id: restaurant_id.value }).then(res => {
          if (res.status == 200) {
            let xAxisData = [],
              seriesData = [],
              seriesName = '订单数量'
            res.data.forEach(item => {
              xAxisData.push(item._id)
              seriesData.push(item.number)
            })
            state.orderOption.xAxis[0].data = xAxisData
            state.orderOption.series[0].data = seriesData
            state.orderOption.series[0].name = seriesName
          } else {
            ctx.$message({ type: 'error', message: res.message })
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
    state.getSold()
    state.getOrderByDay()
    // state.getBill()
    // state.getMapData()
    return {
      ...toRefs(state),
    }
  },
})
</script>

<style scoped lang="scss">
.el-row {
  margin-bottom: 30px;
}
</style>
