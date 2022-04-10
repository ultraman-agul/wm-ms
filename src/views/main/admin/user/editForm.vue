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
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="status">
          <el-select
            default-first-option
            v-model="ruleForm.status"
            placeholder="请选择的角色"
          >
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户头像" prop="avatar" :required="user_avatar">
          <el-upload
            action="#"
            ref="avatar"
            list-type="picture-card"
            :on-remove="removePic"
            :on-change="uploadPic"
            :auto-upload="false"
            :limit="1"
          >
            <img :src="ruleForm.avatar" v-if="ruleForm.avatar" width="150" />
            <i class="el-icon-plus" v-else></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            修改
          </el-button>
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, defineEmit, defineProps } from 'vue'
import { ElMessage } from 'element-plus'
import { upload } from '@/api/upload'
import { editUserInfo } from '@/api/user'
import config from '@/config'
const ruleFormRef = ref()
const user_avatar = ref(true) // 验证是否上传了图片
const props = defineProps({
  editUser: Object,
})

const ruleForm = ref(JSON.parse(JSON.stringify(props.editUser)))

// const ruleForm = reactive({
//   username: '', // 名称
//   password: '',
//   status: '', // 分类
//   avatar: '', // 图片url
// })
const statusList = [
  {
    label: '普通用户',
    value: 1,
  },
  {
    label: '商家',
    value: 2,
  },
  {
    label: '管理员',
    value: 3,
  },
]
const rules = reactive({
  name: [
    {
      required: true,
      message: '请输入用户名称',
      trigger: 'blur',
    },
  ],
  status: [
    {
      required: true,
      message: '请选择用户角色',
      trigger: 'change',
    },
  ],
})

const emit = defineEmit(['addComplete'])

// 删除头像
function removePic() {
  user_avatar.value = true
  ruleForm.value.avatar = ''
}

// 上传图片
function uploadPic(file) {
  upload({ file: file.raw })
    .then(res => {
      console.log(res)
      user_avatar.value = false
      ruleForm.value.avatar = config.baseURL + res.url
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
      editUserInfo(ruleForm.value)
        .then(data => {
          if (data.status === 200) {
            emit('addComplete')
            ElMessage.success(data.message)
          }
        })
        .catch(e => {
          ElMessage.error(e)
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
