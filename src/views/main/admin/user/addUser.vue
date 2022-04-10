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
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="ruleForm.password" type="password"></el-input>
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
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            添加
          </el-button>
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, defineEmit } from 'vue'
import { ElMessage } from 'element-plus'
import { upload } from '@/api/upload'
import { addUser } from '@/api/user'
import config from '@/config'
const ruleFormRef = ref()
const user_avatar = ref(true) // 验证是否上传了图片
const ruleForm = reactive({
  username: '', // 名称
  password: '',
  status: '', // 分类
  avatar: '', // 图片url
})
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
  password: [
    {
      required: true,
      message: '请输入用户密码',
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
  ruleForm.avatar = ''
}

// 上传图片
function uploadPic(file) {
  upload({ file: file.raw })
    .then(res => {
      console.log(res)
      user_avatar.value = false
      ruleForm.avatar = config.baseURL + res.url
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
      addUser(ruleForm)
        .then(data => {
          console.log(data)
          if (data.status === 200) {
            emit('addComplete')
            ElMessage.success('添加用户成功')
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
