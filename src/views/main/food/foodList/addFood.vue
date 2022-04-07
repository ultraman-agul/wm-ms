<template>
  <div class="main-content addFood">
    <div>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="食品名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="所属分类" prop="category">
          <el-select
            filterable
            allow-create
            default-first-option
            v-model="ruleForm.category"
            placeholder="请选择食品所属分类"
          >
            <el-option
              v-for="item in category"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最低价" prop="min_price">
          <el-input v-model="ruleForm.min_price"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="ruleForm.description" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="商品图片" prop="pic_url" :required="shop_avatar">
          <el-upload
            action="#"
            ref="avatar"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="removePic"
            :on-change="uploadPic"
            :auto-upload="false"
            :limit="1"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
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
    <!-- dialog预览图片 -->
    <el-dialog
      v-model="dialogVisible"
      title="图片预览"
      width="50%"
      style="text-align: center;"
    >
      <img
        style="height: 80%; width: 80%; margin: 0 auto;"
        :src="ruleForm.pic_url"
        alt=""
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, computed, defineEmit } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { uploadFoodPic } from '@/api/upload'
import { addFood } from '@/api/food'
import config from '@/config'
const store = useStore()
const restaurant_id = store.state.restaurant.shopInfo.id
const ruleFormRef = ref()
const shop_avatar = ref(true) // 验证是否上传了图片
const dialogVisible = ref(false)
const ruleForm = reactive({
  name: '', // 名称
  category: '', // 分类
  min_price: '', // 最低价
  description: '', // 简要描述
  pic_url: '', // 图片url
  detailDescription: '', //  详细描述
  price: '', // 单价
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
  price: [
    {
      required: true,
      message: '请输入食品单价',
      trigger: 'blur',
    },
  ],
})

const emit = defineEmit(['addComplete'])
// 通过dialog显示图片
function handlePictureCardPreview() {
  dialogVisible.value = true
}
// 删除头像
function removePic() {
  shop_avatar.value = true
  ruleForm.pic_url = ''
}

// 上传图片
function uploadPic(file) {
  uploadFoodPic({ file: file.raw })
    .then(res => {
      console.log(res)
      shop_avatar.value = false
      ruleForm.pic_url = config.baseURL + res.url
    })
    .catch(e => {
      console.log(e)
    })
}
const submitForm = formEl => {
  if (!formEl) return
  formEl.validate(valid => {
    if (valid) {
      console.log('submit!', ruleForm)
      addFood(ruleForm)
        .then(data => {
          console.log(data)
          if (data.status === 200) {
            emit('addComplete')
            ElMessage.success('添加食品成功')
          }
        })
        .catch(e => {
          console.log(e)
        })
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
  margin: 0 auto;
  h2 {
    font-size: 22px;
    font-weight: bold;
    margin-left: 40px;
  }
}
</style>
