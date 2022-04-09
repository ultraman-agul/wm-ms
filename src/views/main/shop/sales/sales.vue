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
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <p class="mapTitle">本店顾客地址分布情况</p>
          <div class="map" style="width: 100%; height: 500px;" id="map"></div>
        </el-card>
      </el-col>
    </el-row>
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
  nextTick,
  onMounted,
} from 'vue'
import { soldOption, orderOption, mapOption } from './chartHelper'
import { getFoods } from '@/api/food'
import { orderGroupByDay } from '@/api/order'
import { getAddress } from '@/api/user'
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
      positonList: [],
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
        getAddress({ restaurant_id: restaurant_id.value }).then(res => {
          if (res.status === 200) {
            state.positonList = res.data
            state.initMap()
          }
        })
      },

      initMap() {
        //定义地图中心点坐标
        const TMap = window.TMap
        const center = new TMap.LatLng(23.074726, 113.291)
        //定义map变量，调用 TMap.Map() 构造函数创建地图
        const map = new TMap.Map(document.getElementById('map'), {
          center: center, //设置地图中心点坐标
          zoom: 10.2, //设置地图缩放级别
          // pitch: 43.5, //设置俯仰角
          // rotation: 45, //设置地图旋转角度
        })

        // 创建点聚合实例
        const markerCluster = new TMap.MarkerCluster({
          id: 'cluster',
          map: map,
          enableDefaultStyle: true, // 启用默认样式
          minimumClusterSize: 2, // 形成聚合簇的最小个数
          geometries: state.positonList.map(item => ({
            // 点数组
            position: new TMap.LatLng(Number(item.lat), Number(item.lng)),
          })),
          zoomOnClick: true, // 点击簇时放大至簇内点分离
          gridSize: 60, // 聚合算法的可聚合距离
          averageCenter: false, // 每个聚和簇的中心是否应该是聚类中所有标记的平均值
          maxZoom: 10, // 采用聚合策略的最大缩放级别
        })
      },
    })
    state.getSold()
    state.getOrderByDay()
    state.getMapData()
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
.mapTitle {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}
</style>
