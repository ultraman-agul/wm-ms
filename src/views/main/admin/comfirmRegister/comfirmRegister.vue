<template>
  <div class="main-content food-list">
    <el-tabs type="border-card">
      <el-tab-pane label="注册申请">
        <el-table
          :data="filterTableData"
          stripe
          border
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
          style="width: 100%"
        >
          <el-table-column label="id" prop="id" width="60" />
          <el-table-column label="名称" prop="name" />
          <el-table-column label="地址" prop="address" />
          <el-table-column label="联系电话" prop="call_center" />
          <el-table-column label="开铺日期">
            <template #default="scope">
              {{ scope.row.created_at.slice(0, 10) }}
            </template>
          </el-table-column>
          <el-table-column
            label="起送"
            width="100"
            prop="min_price"
          ></el-table-column>
          <el-table-column
            label="配送费"
            width="100"
            prop="shipping_fee"
          ></el-table-column>
          <el-table-column width="300">
            <template #header>
              <el-input v-model="search" size="small" placeholder="搜索" />
            </template>
            <template #default="scope">
              <el-button
                size="small"
                @click="handleEdit(scope.$index, scope.row)"
              >
                同意注册
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >
                拒绝
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed, reactive, nextTick } from 'vue'
import router from '@/router'
import { useStore } from 'vuex'
const store = useStore()
const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref(null)
const search = ref('')
const state = reactive({
  expands: [], // 存储展开行的餐馆id
})

const category = computed(() => store.state.restaurant.category) // 展开行的餐厅的分类数据
const tableData = computed(() => store.state.restaurant.restaurantList) // 表格餐厅列表数据
// 给每行一个key,expend必需
const getRowKeys = row => {
  return row.id
}
store.dispatch('restaurant/allRestaurantNoLoc') // 获取数据
// 实现手风琴效果,只能展开一行
const expandCategory = (row, expandedRows) => {
  if (expandedRows.length > 0) {
    // 打开时关闭所有,然后记录当前打开的id
    state.expands = []
    state.expands.push(row.id)
    store.dispatch('restaurant/getCategoryFn', row.id)
  }
}

// 删除分类
const handleClose = tag => {
  store.dispatch('restaurant/deleteCategory', {
    category_id: tag.id,
    restaurant_id: state.expands[0],
  })
}

// 显示button -> 输入框
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value.focus()
  })
}

// 添加分类
const handleInputConfirm = () => {
  if (inputValue.value) {
    store.dispatch('restaurant/addCategory', {
      category_name: inputValue.value,
      restaurant_id: state.expands[0],
    })
  }
  inputVisible.value = false
  inputValue.value = ''
}

// 表格数据,具有搜索功能
const filterTableData = computed(() =>
  tableData.value.filter(
    // 如果tableData不是响应式则监听不到数据变化
    data =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase())
  )
)

const handleEdit = (index, row) => {
  console.log(index, row)
  // store.commit('restaurant/setShopInfo', row)
  router.push('/main/restaurantInfo?id=' + row.id)
}

const handleDelete = (index, row) => {
  console.log(index, row)
}

// 跳转到食品详情
const jumpToFood = id => {
  store.dispatch('restaurant/getCategoryFn', id)

  router.push('/main/food?id=' + id)
}
</script>

<style lang="scss" scoped>
.category {
  span {
    margin-right: 20px;
  }
  .el-tag {
    margin: 0 20px;
  }
}
</style>
