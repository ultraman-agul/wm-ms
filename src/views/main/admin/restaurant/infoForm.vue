<template>
  <div class="drawer-form">
    <el-button type="primary" size="small" @click="handleDrawer">
      修改基本信息
    </el-button>
    <el-drawer
      title="店铺信息修改"
      v-model="drawer"
      :before-close="handleClose"
    >
      <!-- 表单信息 -->
      <el-form
        :model="shopInfo"
        :rules="rules"
        ref="shopForm"
        label-width="100px"
        class="shop-info"
      >
        <!-- 店铺名 -->
        <el-form-item label="店铺名称" prop="name">
          <el-input
            class="input"
            placeholder="起个你喜欢的名字吧"
            v-model="shopInfo.name"
          ></el-input>
        </el-form-item>

        <!-- 店铺地址 -->
        <el-form-item label="店铺地址" prop="address">
          <el-select
            v-model="shopInfo.address"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="locationSearch"
            :loading="loading"
          >
            <el-option
              v-for="item in addressList"
              :key="item.id"
              :label="item.title + ' ' + item.address"
              :value="item.address"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="店铺地址补充" prop="addressDetail">
          <el-input
            class="input"
            placeholder="地址补充"
            v-model="shopInfo.addressDetail"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="call_center">
          <el-input
            class="input"
            placeholder="联系电话"
            v-model="shopInfo.call_center"
          ></el-input>
        </el-form-item>
        <!-- 店铺分类 -->
        <el-form-item label="店铺分类" prop="category">
          <el-input
            class="input"
            placeholder="店铺分类"
            v-model="shopInfo.category"
          ></el-input>
        </el-form-item>

        <!-- 营业时间 -->
        <el-form-item label="营业时间" required class="activeTime">
          <el-form-item prop="shopping_time_start" style="margin-right:-60px;">
            <el-time-select
              placeholder="起始时间"
              v-model="shopInfo.shopping_time_start"
              start="08:00"
              step="00:30"
              end="24:00"
            ></el-time-select>
          </el-form-item>
          <el-form-item prop="shopping_time_end">
            <el-time-select
              placeholder="结束时间"
              v-model="shopInfo.shopping_time_end"
              start="08:00"
              step="00:30"
              end="24:00"
            ></el-time-select>
          </el-form-item>
        </el-form-item>
        <!-- 店铺头像图片 -->
        <el-form-item label="店铺头像" prop="shop_avatar">
          <el-upload
            action="#"
            ref="avatar"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="removeAvatar"
            :on-change="uploadAvatar"
            :auto-upload="false"
            :limit="1"
          >
            <img
              v-if="shopInfo.pic_url"
              :src="shopInfo.pic_url"
              style="width: 100%;"
            />
            <i v-else class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>

        <!-- 配送服务 -->
        <el-form-item label="配送服务" prop="delivery">
          <el-radio-group v-model="shopInfo.delivery">
            <el-radio label="商家配送"></el-radio>
            <el-radio label="骑手配送"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="起送价格" prop="min_price">
          <el-input
            class="input"
            placeholder="起送价格"
            v-model="shopInfo.min_price"
          ></el-input>
        </el-form-item>
        <el-form-item label="配送费" prop="shipping_fee">
          <el-input
            class="input"
            placeholder="配送费"
            v-model="shopInfo.shipping_fee"
          ></el-input>
        </el-form-item>

        <!-- 提交 -->
        <el-form-item class="submit-wrap">
          <el-button type="primary" @click="submitForm">
            确认修改
          </el-button>
          <el-button @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  ref,
  watchEffect,
} from 'vue'
import { locationSearch, updateShop } from '@/api/restaurant'
import { uploadShopAvatar } from '@/api/upload'
import config from '@/config'
import { useStore } from 'vuex'

export default defineComponent({
  setup(props, context) {
    const store = useStore()
    const { proxy: ctx } = getCurrentInstance() // 可以把ctx当成vue2中的this

    const state = reactive({
      hasUpdate: false, // 是否更新了信息,如果更新了,则关闭时,父组件进行查询
      drawer: false,
      realName: false, // 实名状态
      hasShop: false, //是否已经注册过店铺
      addressList: [], // 地址选项
      loading: false,
      dialogVisible: false,
      fileFormData: {}, // 向服务器提交的数据

      // 收集除图片外的数据
      shopInfo: {},
      // 验证规则
      rules: {
        name: [
          { required: true, message: '请输入店铺名称', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur',
          },
        ],
        address: [
          { required: true, message: '请输入店铺地址', trigger: 'change' },
        ],
        call_center: [
          { required: true, message: '请输入联系电话', trigger: 'change' },
        ],
        classify: [
          { required: true, message: '请选择店铺分类', trigger: 'blur' },
        ],
        shopping_time_start: [
          {
            required: true,
            message: '请选择时间',
            trigger: 'change',
          },
        ],
        shopping_time_end: [
          {
            required: true,
            message: '请选择时间',
            trigger: 'change',
          },
        ],
        delivery: [
          { required: true, message: '请选择配送形式', trigger: 'change' },
        ],
      },
      shopForm: ref(null),
    })
    const methods = {
      // 关闭时判断是否有更新，如果更新了通知父组件需要重新获取商店数据
      handleClose(done) {
        if (state.hasUpdate) {
          context.emit('hasUpdate')
          state.hasUpdate = false
        }
        done()
      },
      handleDrawer() {
        state.drawer = true
      },
      // 删除头像
      removeAvatar() {
        state.shopInfo.pic_url = ''
      },
      // 上传头像
      uploadAvatar(file) {
        uploadShopAvatar({ file: file.raw })
          .then(res => {
            console.log(res)
            state.shopInfo.pic_url = config.baseURL + res.url
          })
          .catch(e => {
            ctx.$message({
              type: 'error',
              message: '头像上传失败',
            })
          })
      },
      // 搜索位置
      locationSearch(val) {
        state.loading = true
        locationSearch({ keyword: val })
          .then(data => {
            if (data.status === 200) {
              state.addressList = data.data.data
            }
            state.loading = false
          })
          .catch(e => {
            console.log(e)
            state.loading = false
          })
      },
      // 删除活动
      removeActivity(activity) {
        var index = state.shopInfo.activities.indexOf(activity)
        if (index !== -1) {
          state.shopInfo.activities.splice(index, 1)
        }
      },
      // 新增活动
      addActivity() {
        state.shopInfo.activities.push({
          value: '',
          key: Date.now(),
        })
      },
      // 通过dialog显示图片
      handlePictureCardPreview() {
        state.dialogVisible = true
      },
      // 提交数据
      submitForm() {
        state.shopForm.validate(valid => {
          if (valid) {
            state.shopInfo.address += state.shopInfo.addressDetail ?? ''
            updateShop(state.shopInfo)
              .then(res => {
                if (res.status === 200) {
                  ctx.$message({
                    type: 'success',
                    message: res.message,
                  })
                  state.hasUpdate = true
                  state.hasShop = true
                } else {
                  ctx.$message({
                    type: 'error',
                    message: res.message,
                  })
                }
                console.log(res)
              })
              .catch(e => {
                ctx.$message({
                  type: 'error',
                  message: e,
                })
              })
          } else {
            return false
          }
        })
      },
      // 重置
      resetForm() {
        state.shopForm.resetFields()
      },
    }

    watchEffect(
      () => state.shopInfo.address,
      val => {
        let addressObj = state.addressList.filter(
          item => item.address === val
        )[0]
        if (addressObj && addressObj.location) {
          state.shopInfo.lat = addressObj.location.lat
          state.shopInfo.lng = addressObj.location.lng
        }
      }
    )

    setTimeout(() => {
      state.shopInfo = JSON.parse(
        JSON.stringify(store.state.restaurant.shopInfo)
      )
    }, 2000)
    console.log(state.shopInfo)
    return {
      ...methods,
      ...toRefs(state),
    }
  },
})
</script>

<style scoped lang="scss">
.input {
  width: 80%;
}
.timer {
  .el-input {
    width: 120px;
  }
}
</style>
