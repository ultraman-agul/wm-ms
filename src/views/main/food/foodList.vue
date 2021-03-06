<template>
  <div class="main-content food-list">
    <el-tabs type="border-card">
      <el-tab-pane label="食品列表">
        <div class="food-table" v-if="hasShop">
          <el-form inline>
            <el-form-item>
              <el-input v-model="search" placeholder="请输入名称搜索" />
            </el-form-item>
            <el-form-item>
              <el-button @click="showAddDialog = true" type="success">
                添加食品
              </el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="foodList"
            stripe
            border
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
            style="width: 100%"
          >
            <!-- 表格展开显示的内容 -->
            <el-table-column type="expand">
              <template #default="scope">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="名称 : ">
                    <span>{{ scope.row.name }}</span>
                  </el-form-item>
                  <el-form-item label="价格 : ">
                    <span>{{ scope.row.price }}</span>
                  </el-form-item>
                  <el-form-item label="商品已售 : ">
                    <span>{{ scope.row.month_saled }}</span>
                  </el-form-item>
                  <el-form-item label="好评数 : ">
                    <span>{{ scope.row.praise_num }}</span>
                  </el-form-item>
                  <el-form-item label="描述 : ">
                    <span>{{ scope.row.description }}</span>
                  </el-form-item>
                  <el-form-item label="食品图片 : ">
                    <span>
                      <el-image
                        style="width: 100px; height: 100px"
                        :src="scope.row.pic_url"
                      ></el-image>
                    </span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>

            <el-table-column
              type="index"
              label="序号"
              width="60"
            ></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="category" label="分类"></el-table-column>
            <el-table-column prop="price" label="价格"></el-table-column>
            <el-table-column prop="month_saled" label="月售"></el-table-column>
            <el-table-column
              prop="description"
              label="描述"
              width="300"
            ></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                >
                  删除
                </el-button>
              </template>
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
        <div v-else>没有注册店铺, 所以没有食品信息</div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="更改食品信息" v-model="showDialog" width="40%" center>
      <edit-form :editFood="editFood" :foodId="foodId"></edit-form>
    </el-dialog>

    <el-dialog title="添加食品" v-model="showAddDialog" width="40%" center>
      <add-food @addComplete="addComplete"></add-food>
    </el-dialog>
  </div>
</template>

<script>
import editForm from './editForm.vue'
import addFood from './addFood.vue'
import { getFoods, deleteFood } from '@/api/food'
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
  components: { editForm, addFood },
  setup() {
    const { proxy: ctx } = getCurrentInstance()
    const store = useStore()
    const shopInfo = computed(() => store.state.restaurant.shopInfo)
    const state = reactive({
      totalData: [], // 存储所有数据，前端分页
      foodList: [],
      hasShop: false,
      showDialog: false,
      showAddDialog: false,
      foodId: 0,
      search: '',
      editFood: {},
      currentPage: 1,
      pageSize: 10,
      totalNum: 0,
      getFoods() {
        // 获取食品信息
        state.hasShop = !!shopInfo.value.id
        if (state.hasShop) {
          getFoods({
            restaurant_id: shopInfo.value.id,
          }).then(res => {
            if (res.status == 200) {
              state.totalData = []
              res.data.forEach(item => {
                item.spus.forEach(subItem => {
                  subItem.category = item.name
                  subItem.price = subItem.skus[0].price
                  subItem.description = subItem.skus[0].description
                  state.totalData.push(subItem)
                })
              })
              state.totalNum = state.totalData.length
              state.handleSplitPage()
              console.log(state.totalData)
            } else {
              ctx.$message({
                type: 'error',
                message: res.message,
              })
            }
          })
        }
      },
      // pageSize 改变时
      handleSizeChange(pageSize) {
        state.pageSize = pageSize
        state.handleSplitPage()
      },
      // currentPage 改变时
      handleCurrentChange(currentPage) {
        state.currentPage = currentPage
        state.handleSplitPage()
      },
      handleSplitPage() {
        state.foodList = state.totalData.slice(
          (state.currentPage - 1) * state.pageSize,
          state.currentPage * state.pageSize
        )
      },
      handleEdit(index, row) {
        state.foodId = row.id
        state.editFood = row
        state.showDialog = !state.showDialog
      },
      // 删除食品信息
      handleDelete(index, row) {
        ctx.$messageBox
          .confirm('此操作将永久删除食品, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
          .then(() => {
            deleteFood({ id: row.id }).then(res => {
              if (res.status == 200) {
                ctx.$message({
                  type: 'success',
                  message: res.message,
                })
                state.getFoods()
              } else {
                ctx.$message({
                  type: 'error',
                  message: res.message,
                })
              }
            })
          })
          .catch(() => {
            return
          })
      },
      addComplete() {
        state.showAddDialog = false
        state.getFoods()
      },
    })
    state.getFoods() //获取食品数据
    // 表格筛选
    watch(
      () => state.search,
      () => {
        state.foodList = state.totalData.filter(
          data =>
            !state.search ||
            data.name.toLowerCase().includes(state.search.toLowerCase())
        )
      }
    )
    store.dispatch('restaurant/getCategoryFn', shopInfo.value.id) // 获取餐厅的所有分类
    const categoryList = computed(() => store.state.restaurant.category)

    watch(
      () => state.showDialog,
      val => {
        if (!val) {
          state.getFoods()
        }
      }
    )
    return {
      ...toRefs(state),
      categoryList,
    }
  },
})
</script>

<style scoped lang="scss">
.food-list {
  user-select: none;
}
.el-button--mini {
  padding: 7px 12px;
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
