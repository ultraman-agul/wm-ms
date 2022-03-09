<template>
  <el-table :data="filterTableData" style="width: 100%">
    <el-table-column align="center" label="id" prop="id" />
    <el-table-column align="center" label="名称" prop="name" />
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
import { getAllResturant } from '@/api/restaurant'
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
      data.name.toLowerCase().includes(search.value.toLowerCase())
  )
)
const handleEdit = (index, row) => {
  console.log(index, row)
}
const handleDelete = (index, row) => {
  console.log(index, row)
}

getAllResturant()
  .then(data => {
    if (data.status === 200) {
      state.tableData = data.data
    }
  })
  .catch(e => {
    ElMessage.error(e)
  })
</script>
