<template>
  <div class="main-content food-list">
    <el-tabs type="border-card">
      <el-tab-pane label="用户列表">
        <div class="food-table">
          <el-form inline>
            <el-form-item>
              <el-input v-model="search" placeholder="请输入名称搜索" />
            </el-form-item>
            <el-form-item>
              <el-button @click="showAddDialog = true" type="success">
                添加用户
              </el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="userList"
            stripe
            border
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
            style="width: 100%"
          >
            <el-table-column
              type="index"
              label="序号"
              width="60"
            ></el-table-column>
            <el-table-column align="center" label="id" prop="id" />
            <el-table-column align="center" label="用户名" prop="username" />
            <el-table-column align="center" label="角色" prop="status">
              <template #default="scope">
                {{
                  scope.row.status == 1
                    ? '普通用户'
                    : scope.row.status == 2
                    ? '商家'
                    : '管理员'
                }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="头像">
              <template #default="scope">
                <img :src="scope.row.avatar" width="70" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="注册日期" prop="create_time">
              <template #default="scope">
                {{ scope.row.create_time.slice(0, 10) }}
              </template>
            </el-table-column>
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
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="编辑用户信息" v-model="showDialog" width="40%" center>
      <edit-form :editUser="editUser" @addComplete="addComplete"></edit-form>
    </el-dialog>

    <el-dialog title="添加用户" v-model="showAddDialog" width="40%" center>
      <add-user @addComplete="addComplete"></add-user>
    </el-dialog>
  </div>
</template>

<script>
import editForm from './editForm.vue'
import addUser from './addUser.vue'
import { allUserInfo, deleteUser } from '@/api/user'

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
  components: { editForm, addUser },
  setup() {
    const { proxy: ctx } = getCurrentInstance()
    const state = reactive({
      totalData: [], // 存储所有数据，前端分页
      showDialog: false,
      showAddDialog: false,
      userList: [],
      search: '',
      editUser: {},
      currentPage: 1,
      pageSize: 10,
      totalNum: 0,
      allUserInfo() {
        allUserInfo()
          .then(data => {
            if (data.status === 200) {
              state.totalData = data.data
              state.totalNum = state.totalData.length
              state.handleSplitPage()
            }
          })
          .catch(e => {
            ctx.$message({
              type: 'error',
              message: e.message,
            })
          })
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
        state.userList = state.totalData.slice(
          (state.currentPage - 1) * state.pageSize,
          state.currentPage * state.pageSize
        )
      },
      handleEdit(index, row) {
        state.editUser = row
        state.showDialog = !state.showDialog
      },
      // 删除食品信息
      handleDelete(index, row) {
        ctx.$messageBox
          .confirm('此操作将永久删除用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
          .then(() => {
            deleteUser({ id: row.id }).then(res => {
              if (res.status == 200) {
                ctx.$message({
                  type: 'success',
                  message: res.message,
                })
                state.allUserInfo()
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
        state.showDialog = false
        state.allUserInfo()
      },
    })
    state.allUserInfo() //获取食品数据
    // 表格筛选
    watch(
      () => state.search,
      () => {
        state.userList = state.totalData.filter(
          data =>
            !state.search ||
            data.name.toLowerCase().includes(state.search.toLowerCase())
        )
      }
    )

    watch(
      () => state.showDialog,
      val => {
        if (!val) {
          state.allUserInfo()
        }
      }
    )
    return {
      ...toRefs(state),
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
