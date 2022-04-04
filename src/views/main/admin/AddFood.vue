<template>
  <div class="addFood">
    <h2>添加食品</h2>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      :size="formSize"
    >
      <el-form-item label="食品名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="所属分类" prop="category_id">
        <el-select
          v-model="ruleForm.category_id"
          placeholder="请选择食品所属分类"
        >
          <el-option
            v-for="item in category"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="最低价" prop="min_price">
        <el-input v-model="ruleForm.min_price"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="ruleForm.description" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="商品图片地址" prop="pic_url">
        <input type="file" @change="upload($event)" />
      </el-form-item>
      <el-form-item label="单价" prop="price">
        <el-input v-model="ruleForm.price"></el-input>
      </el-form-item>
      <el-form-item label="详细描述">
        <el-input
          v-model="ruleForm.detailDescription"
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          添加
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { uploadFoodPic } from '@/api/upload'
import config from '@/config'
const route = useRoute()
const restaurant_id = route.query.id
const store = useStore()
const formSize = ref('')
const ruleFormRef = ref()
const ruleForm = reactive({
  name: '香辣汉堡', // 名称
  category_id: '', // 分类
  min_price: 20, // 最低价
  description: '经典', // 简要描述
  pic_url:
    'http://p0.meituan.net/xianfu/0a6251fff2176586d8ff7c95583c756d40960.jpg', // 图片url
  detailDescription: '', //  详细描述
  price: 20, // 单价
  restaurant_id,
})
const category = computed(() => store.state.restaurant.category)
const rules = reactive({
  name: [
    {
      required: true,
      message: '请输入食品名称',
      trigger: 'blur',
    },
  ],
  category_id: [
    {
      required: true,
      message: '请选择食品所属分类',
      trigger: 'change',
    },
  ],
  min_price: [
    {
      required: true,
      message: '请输入食品最低价',
      trigger: 'blur',
    },
  ],
  description: [
    {
      required: true,
      message: '请添加食品描述',
      trigger: 'blur',
    },
  ],
  pic_url: [
    {
      required: true,
      message: '请输入食品图片地址',
      trigger: 'blur',
    },
  ],
  price: [
    {
      required: true,
      message: '请输入食品单价',
      trigger: 'blur',
    },
  ],
})

const upload = event => {
  const file = event.target.files[0]
  if (!file || file.size > 1024 * 1024 * 2) {
    ElMessage.error('图片不能大于2M')
    return
  }
  uploadFoodPic({ file })
    .then(data => {
      if (data.status === 200) {
        ruleForm.pic_url = config.baseURL + data.url
      }
    })
    .catch(e => {
      ElMessage.error('图片上传失败')
    })
}
const submitForm = formEl => {
  if (!formEl) return
  formEl.validate(valid => {
    if (valid) {
      console.log('submit!')
      console.log(ruleForm)
      store.dispatch('food/addFood', ruleForm)
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const resetForm = formEl => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style lang="scss" scoped>
.addFood {
  width: 50%;
  margin: 0 auto;
  h2 {
    font-size: 22px;
    font-weight: bold;
    margin-left: 40px;
  }
}
</style>
