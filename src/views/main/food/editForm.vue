<template>
  <div class="main-content addFood">
    <div>
      <el-form
        ref="ruleFormRef"
        :model="editFood"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="食品名称" prop="name">
          <el-input v-model="editFood.name"></el-input>
        </el-form-item>
        <el-form-item label="所属分类" prop="category">
          <el-select
            filterable
            allow-create
            default-first-option
            v-model="editFood.category"
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
          <el-input v-model="editFood.min_price"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="editFood.description" type="textarea"></el-input>
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
            <img
              style="width: 100%"
              v-if="editFood.pic_url && shop_avatar"
              :src="editFood.pic_url"
              alt=""
            />
            <i v-else class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input v-model="editFood.price"></el-input>
        </el-form-item>
        <el-form-item label="详细描述">
          <el-input
            v-model="editFood.detailDescription"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="submitForm()">
            确认修改
          </el-button>
          <el-button @click="resetForm()">重置</el-button>
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
        :src="editFood.pic_url"
        alt=""
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, computed, defineProps } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { uploadFoodPic } from '@/api/upload'
import { setFood } from '@/api/food'
import config from '@/config'
const store = useStore()
const ruleFormRef = ref()
const shop_avatar = ref(true) // 验证是否上传了图片
const dialogVisible = ref(false)
const shopInfo = computed(() => store.state.restaurant.shopInfo)
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
const props = defineProps({
  editFood: Object,
  foodId: Number,
})

const editFood = ref(JSON.parse(JSON.stringify(props.editFood)))

// 通过dialog显示图片
function handlePictureCardPreview() {
  dialogVisible.value = true
}
// 删除头像
function removePic() {
  shop_avatar.value = true
  editFood.value.pic_url = ''
}

// 上传图片
function uploadPic(file) {
  uploadFoodPic({ file: file.raw })
    .then(res => {
      console.log(res)
      shop_avatar.value = false
      editFood.value.pic_url = config.baseURL + res.url
    })
    .catch(e => {
      console.log(e)
    })
}
const submitForm = () => {
  if (!ruleFormRef.value) return
  ruleFormRef.value.validate(valid => {
    if (valid) {
      console.log('submit!', editFood.value)
      setFood({ ...editFood.value, food_id: props.foodId })
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const resetForm = () => {
  if (!ruleFormRef.value) return
  ruleFormRef.value.resetFields()
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
