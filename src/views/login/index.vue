<template>
  <div class="wrap">
    <div class="form">
      <div class="left">
        <video src="../../assets/video.mp4" muted loop autoplay></video>
      </div>
      <div class="right">
        <div class="right-con">
          <el-form :model="model" :rules="rules" ref="loginForm">
            <h1 class="title">外卖后台管理系统</h1>
            <h3>用户名</h3>
            <el-form-item prop="username">
              <el-input
                class="text"
                v-model="model.username"
                prefix-icon="el-icon-user-solid"
                clearable
                placeholder="用户名"
              />
            </el-form-item>
            <h3>密码</h3>
            <el-form-item prop="password">
              <el-input
                class="text"
                v-model="model.password"
                prefix-icon="el-icon-lock"
                show-password
                clearable
                placeholder="密码"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                :loading="loading"
                type="primary"
                class="btn"
                @click="submit"
              >
                {{ btnText }}
              </el-button>
            </el-form-item>
          </el-form>
          <p class="info el-icon-warning-outline">
            首次登陆自动注册
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  ref,
  computed,
} from 'vue'
import { userLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'login',
  setup() {
    const { proxy: ctx } = getCurrentInstance() // 可以把ctx当成vue2中的this
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const state = reactive({
      model: {
        username: 'jinhua',
        password: '1234561',
        status: 2, // 商家角色
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'blur',
          },
        ],
      },
      loading: false,
      btnText: computed(() => (state.loading ? '登录中...' : '登录')),
      loginForm: ref(null),
      submit: () => {
        if (state.loading) {
          return
        }
        state.loginForm.validate(async valid => {
          if (valid) {
            state.loading = true
            const { status, token, message } = await userLogin(state.model)
            if (status === 200) {
              ctx.$message.success({
                message,
                duration: 1000,
              })

              const targetPath = decodeURIComponent(route.query.redirect)
              console.log(targetPath)
              if (targetPath.startsWith('http')) {
                // 如果是一个url地址
                window.location.href = targetPath
              } else if (targetPath.startsWith('/')) {
                // 如果是内部路由地址
                router.push(targetPath)
              } else {
                router.push('/')
              }

              store.dispatch('app/setToken', token)
            } else {
              ctx.$message.error(message)
            }
            state.loading = false
          }
        })
      },
    })

    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="css" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  overflow: hidden;
}

.wrap {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(
    to left top,
    #d16ba5,
    #c777b9,
    #ba83ca,
    #aa8fd8,
    #9a9ae1,
    #8aa7ec,
    #79b3f4,
    #69bff8,
    #52cffe,
    #41dfff,
    #46eefa,
    #5ffbf1
  );
}

.form {
  width: 900px;
  height: 560px;
  display: flex;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
}

.left {
  width: 500px;
  height: 560px;
}

.left video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.right {
  width: 400px;
  height: 560px;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
}

.right-con {
  width: 70%;
  display: flex;
  flex-direction: column;
  text-align: center;
  height: 100%;
  padding: 70px 0;
}

h1 {
  font-size: 26px;
  color: #70b4e3;
  font-weight: 400;
  padding-bottom: 10px;
}

h3 {
  font-size: 18px;
  font-weight: 400;
  color: #70b4e3;
  padding: 20px 0;
}

.text {
  width: 100%;
  outline: none;
  border: none;
  border-bottom: 1px solid #70b4e3;
  color: #366ae6;
  background-color: rgba(0, 0, 0, 0);
}

.btn {
  width: 100%;
  height: 40px;
  border-radius: 20px;
  border: none;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  margin-top: 50px;
  background-image: linear-gradient(120deg, #76daec 0%, #c5a8de 100%);
}

.btn:hover {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.info {
  margin-top: 20px;
  text-align: center;
  color: #366ae6;
}
</style>
