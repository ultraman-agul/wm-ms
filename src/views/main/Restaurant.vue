<template>
  <el-table
    :data="filterTableData"
    style="width: 100%"
    @expand-change="expandCategory"
    :row-key="getRowKeys"
    :expand-row-keys="state.expands"
  >
    <el-table-column type="expand">
      <template #default="props">
        <el-tag
          v-for="tag in dynamicTags"
          :key="tag"
          class="mx-1"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="inputVisible"
          ref="InputRef"
          v-model="inputValue"
          class="ml-1 w-20"
          size="small"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
        ></el-input>
        <el-button
          v-else
          class="button-new-tag ml-1"
          size="small"
          @click="showInput"
        >
          + New Tag
        </el-button>
      </template>
    </el-table-column>
    <el-table-column align="center" label="id" prop="id" width="60" />
    <el-table-column align="center" label="名称" prop="name" />
    <el-table-column align="center" label="地址" prop="address" />
    <el-table-column align="center" label="联系电话" prop="call_center" />
    <el-table-column align="center" label="开铺日期">
      <template #default="scope">
        {{ scope.row.created_at.slice(0, 10) }}
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      label="评论数"
      prop="comment_number"
    ></el-table-column>
    <el-table-column
      align="center"
      label="月销"
      width="100"
      prop="month_sales"
    ></el-table-column>
    <el-table-column
      align="center"
      label="起送"
      width="100"
      prop="min_price"
    ></el-table-column>
    <el-table-column
      align="center"
      label="配送费"
      width="100"
      prop="shipping_fee"
    ></el-table-column>
    <el-table-column align="center" label="评分">
      <el-table-column
        align="center"
        label="店铺"
        width="60"
        prop="wm_poi_score"
      ></el-table-column>
      <el-table-column
        align="center"
        label="食品"
        width="60"
        prop="food_score"
      ></el-table-column>
      <el-table-column
        align="center"
        label="配送"
        width="60"
        prop="delivery_score"
      ></el-table-column>
    </el-table-column>
    <el-table-column align="right">
      <template #header>
        <el-input v-model="search" size="small" placeholder="搜索" />
      </template>
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
          编辑
        </el-button>
        <el-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
        >
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { ref, computed, reactive, nextTick } from 'vue'
import { getAllResturant } from '@/api/restaurant'
import { ElMessage } from 'element-plus'
import { addCategory } from '@/api/restaurant'
const inputValue = ref('')
const dynamicTags = ref(['Tag 1', 'Tag 2', 'Tag 3'])
const inputVisible = ref(false)
const InputRef = ref(null)
const search = ref('')
const state = reactive({
  tableData: [],
  expands: [], // 存储展开行的id
  category: [], // 展开行的数据
})

// 给每行一个key,expend必需
const getRowKeys = row => {
  return row.id
}

// 实现手风琴效果,只能展开一行
const expandCategory = (row, expandedRows) => {
  if (expandedRows.length > 0) {
    // 打开时关闭所有,然后记录当前打开的id
    state.expands = []
    state.expands.push(row.id)
    state.category = []
    // 根据id找到当前行,获取信息
    for (let i = 0; i < state.tableData.length; i++) {
      if (state.tableData[i].id == row.id) {
        state.category.push(state.tableData[i])
        break
      }
    }
    console.log(state.expands, state.category)
  }
}

// 删除分类
const handleClose = tag => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
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
    // dynamicTags.value.push(inputValue.value)
    addCategory({
      category_name: inputValue.value,
      restaurant_id: state.expands[0],
    })
      .then(data => {
        console.log(data)
      })
      .catch(e => {
        console.log(e)
      })
  }
  inputVisible.value = false
  inputValue.value = ''
}

// 表格数据,具有搜索功能
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

// 获取表格数据
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
