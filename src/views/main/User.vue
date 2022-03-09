<template>
  <el-table :data="filterTableData" style="width: 100%">
    <el-table-column align="center" label="id" prop="id" />
    <el-table-column align="center" label="用户名" prop="username" />
    <el-table-column align="center" label="角色" prop="status" />
    <el-table-column align="center" label="头像" prop="avatar" />
    <el-table-column align="center" label="注册日期" prop="create_time">
      <template #default="scope">
        {{ scope.row.create_time.slice(0, 10) }}
      </template>
    </el-table-column>

    <el-table-column align="right">
      <template #header>
        <el-input v-model="search" size="small" placeholder="搜索" />
      </template>
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
          Edit
        </el-button>
        <el-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
        >
          Delete
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { allUserInfo } from '@/api/user'
import { ElMessage } from 'element-plus'

const search = ref('')
const state = reactive({
  tableData: [],
})

const filterTableData = computed(() =>
  state.tableData.filter(
    // 如果tableData不是响应式则监听不到数据变化
    data =>
      !search.value ||
      data.username.toLowerCase().includes(search.value.toLowerCase())
  )
)
const handleEdit = (index, row) => {
  console.log(index, row)
}
const handleDelete = (index, row) => {
  console.log(index, row)
}

allUserInfo()
  .then(data => {
    if (data.status === 200) {
      state.tableData = data.data
    }
  })
  .catch(e => {
    ElMessage.error(e)
  })
</script>
