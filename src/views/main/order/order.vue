<template>
  <div class="main-content">
    <el-table
      :data="tableData"
      :default-sort="{ prop: 'create_time', order: 'descending' }"
      :header-cell-style="{ 'text-align': 'center' }"
      :cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column
        type="index"
        label="序号"
        sortable
        width="80"
      ></el-table-column>
      <el-table-column
        prop="create_time"
        label="下单时间"
        sortable
      ></el-table-column>
      <el-table-column label="订单信息">
        <el-table-column label="食品信息">
          <template #default="scope">
            <el-popover trigger="hover" placement="top" width="400">
              <div
                v-for="(info, index) in scope.row.foods"
                :key="index"
                class="hoverbox"
              >
                <div>
                  <p>名称: {{ info.name }}</p>
                  <p>数量: {{ info.num }}</p>
                  <p>价格: {{ info.price }}</p>
                </div>
                <img :src="info.pic_url" alt="" />
              </div>
              <template #reference class="name-wrapper">
                <el-button type="success" plain size="medium">
                  查看食品信息
                </el-button>
              </template>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column label="价格明细">
          <template #default="scope">
            <el-popover trigger="hover" placement="top">
              <p>配送费: {{ scope.row.shipping_fee }}</p>
              <p>总价格: {{ scope.row.total_price }}</p>
              <p v-if="scope.row.status === '已支付'">
                用户支付:
                {{ scope.row.total_price }}
              </p>
              <p v-else>用户未支付</p>
              <template #reference class="name-wrapper">
                <el-button type="success" plain size="medium">
                  查看明细
                </el-button>
              </template>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column label="收货人信息">
          <el-table-column prop="address.name" label="姓名"></el-table-column>
          <el-table-column prop="address.phone" label="电话"></el-table-column>
          <el-table-column
            prop="address.address"
            label="地址"
          ></el-table-column>
        </el-table-column>

        <el-table-column label="订单状态" width="120">
          <template #default="scope">
            <el-tag
              :type="scope.row.status === '已支付' ? 'success' : 'warning'"
              disable-transitions
            >
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      ></el-pagination>
    </div>
  </div>
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
import { getOrderByRestaurantId } from '@/api/order'
import moment from 'moment'
export default defineComponent({
  setup() {
    const { proxy: ctx } = getCurrentInstance()
    const store = useStore()
    const shopInfo = computed(() => store.state.restaurant.shopInfo)
    const state = reactive({
      orders: [],
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      totalNum: 0,
      // 获取今日订单
      getAllOrder() {
        getOrderByRestaurantId({
          restaurant_id: shopInfo.value.id,
          offset: state.currentPage - 1,
          limit: state.pageSize,
        }).then(res => {
          console.log(res)
          if (res.status === 200) {
            state.tableData = res.data.map(item => {
              return {
                ...item,
                create_time: moment(item.create_time).format(
                  'YYYY-MM-DD HH:mm:ss'
                ),
              }
            })
            state.totalNum = res.totalNum
          } else {
            ctx.$notify({
              title: '提示',
              message: res.message,
              type: 'warning',
            })
          }
        })
      },
      // pageSize 改变时
      handleSizeChange(pageSize) {
        state.pageSize = pageSize
        state.getAllOrder()
      },
      // currentPage 改变时
      handleCurrentChange(currentPage) {
        state.currentPage = currentPage
        state.getAllOrder()
      },
    })
    state.getAllOrder()
    return {
      ...toRefs(state),
    }
  },
})
</script>

<style scoped lang="scss">
.name-wrapper {
  cursor: pointer;
}
.pagination {
  margin-top: 20px;
}

.hoverbox {
  border-bottom: 1px solid #f4f4f4;
  display: flex;
  justify-content: space-between;
  div {
    p {
      margin: 0 0;
    }
  }
  img {
    width: 100px;
  }
}
</style>
