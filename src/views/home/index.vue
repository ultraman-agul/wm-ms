<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <p class="mapTitle">本店顾客地址分布情况</p>
          <div>
            <el-button @click="changeMapStyle('style1')">默认</el-button>
            <el-button @click="changeMapStyle('style2')">夜间</el-button>
            <el-button @click="changeMapStyle('style3')">绿色</el-button>
          </div>
          <div class="map" style="width: 100%; height: 1000px;" id="map"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, computed } from 'vue'
import { getAddress } from '@/api/user'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'home',
  setup() {
    const store = useStore()

    const restaurant = computed(() => store.state.restaurant.shopInfo)
    const restaurant_id = computed(() => store.state.restaurant.shopInfo.id)
    const centerPosition = computed(() => {
      return {
        lng: Number(store.state.restaurant.shopInfo.lng),
        lat: Number(store.state.restaurant.shopInfo.lat),
      }
    })
    const state = reactive({
      positonList: [],
      map: {},
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
        const center = new TMap.LatLng(
          centerPosition.value.lat,
          centerPosition.value.lng
        )
        //定义map变量，调用 TMap.Map() 构造函数创建地图
        state.map = new TMap.Map(document.getElementById('map'), {
          center, //设置地图中心点坐标
          zoom: 10.2, //设置地图缩放级别
          mapStyleId: 'style1',
          // pitch: 43.5, //设置俯仰角
          // rotation: 45, //设置地图旋转角度
        })

        //初始化marker
        var marker = new TMap.MultiMarker({
          id: 'marker-layer', //图层id
          map: state.map,
          styles: {
            //点标注的相关样式
            marker: new TMap.MarkerStyle({
              width: 25,
              height: 35,
              anchor: { x: 16, y: 32 },
              offset: { x: 0, y: 20 },
              src:
                'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png',
            }),
          },
          geometries: [
            {
              //点标注数据数组
              id: 'demo',
              styleId: 'marker',
              position: new TMap.LatLng(
                centerPosition.value.lat,
                centerPosition.value.lng
              ),
              properties: {
                title: 'marker',
              },
              content: '本店位置',
            },
          ],
        })

        // 创建点聚合实例
        const markerCluster = new TMap.MarkerCluster({
          id: 'cluster',
          map: state.map,
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
      changeMapStyle(styleId) {
        state.map.setMapStyleId(styleId)
      },
    })
    state.getMapData()
    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped>
.home {
  color: $mainColor;
  .mapTitle {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
