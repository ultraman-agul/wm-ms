<template>
  <div class="main-content">
    <el-tabs type="border-card">
      <el-tab-pane label="顾客评论">
        <el-table
          :data="tableData"
          :default-sort="{ prop: 'comment_time', order: 'descending' }"
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column
            type="index"
            label="序号"
            sortable
            width="80"
          ></el-table-column>
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
          <el-table-column
            prop="comment_time"
            label="评论时间"
            sortable
          ></el-table-column>
          <el-table-column
            prop="comment_data"
            label="评论内容"
          ></el-table-column>
          <el-table-column label="评论图片">
            <template #default="scope">
              <img
                width="50"
                v-for="(item, index) in scope.row"
                :key="index"
                :src="item"
                alt=""
              />
            </template>
          </el-table-column>
          <el-table-column prop="food_score" label="食品评分"></el-table-column>
          <el-table-column
            prop="delivery_score"
            label="配送评分"
          ></el-table-column>
          <el-table-column label="顾客">
            <template #default="scope">
              <img
                :src="scope.row.avatar"
                alt=""
                width="50"
                style="vertical-align: middle; border-radius: 50%;"
              />
              {{ scope.row.user_name }}
            </template>
          </el-table-column>
          <el-table-column label="回复顾客">
            <template #default="scope">
              <el-popover
                trigger="click"
                placement="top"
                width="600"
                v-if="!scope.row.add_comment_list[0]"
              >
                <div>
                  <el-input
                    type="textarea"
                    :rows="3"
                    v-model="replyContent"
                    placeholder="请输入回复内容"
                    clearable
                  />
                  <div class="btnBox">
                    <el-button type="primary" size="mini" @click="confirmReply">
                      确认
                    </el-button>
                    <!-- <el-button size="mini">取消</el-button> -->
                  </div>
                </div>
                <template #reference>
                  <el-button @click="reply(scope.row)">
                    回复
                  </el-button>
                </template>
              </el-popover>
              <span v-if="scope.row.add_comment_list[0]">
                {{ scope.row.add_comment_list[0].content }}
              </span>
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  computed,
} from 'vue'
import { useStore } from 'vuex'
import { restaurantComment, replyComment } from '@/api/restaurant'
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
      replyContent: '',
      replyId: 0,
      restaurantComment() {
        restaurantComment({
          restaurant_id: shopInfo.value.id,
          offset: state.currentPage - 1,
          limit: state.pageSize,
        }).then(res => {
          if (res.status === 200) {
            state.tableData = res.data.map((item, index) => {
              return {
                ...item,
                foods: res.foodData[index],
                comment_time: moment(item.comment_time).format(
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
        state.restaurantComment()
      },
      // currentPage 改变时
      handleCurrentChange(currentPage) {
        state.currentPage = currentPage
        state.restaurantComment()
      },
      reply(row) {
        state.replyId = row.id
        console.log(row)
      },
      confirmReply() {
        replyComment({
          id: state.replyId,
          reply_data: state.replyContent,
        }).then(res => {
          if (res.status === 200) {
            state.replyContent = ''
            ctx.$message.success(res.message)
            state.restaurantComment()
          }
        })
      },
    })
    state.restaurantComment()
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
.el-popper {
  .btnBox {
    margin-top: 4px;
    text-align: right;
  }
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
