<template>
  <div class="add-shop">
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
      <el-form-item label="店铺分类" prop="classify">
        <el-input
          class="input"
          placeholder="店铺分类"
          v-model="shopInfo.classify"
        ></el-input>
      </el-form-item>

      <!-- 营业时间 -->
      <el-form-item label="营业时间" required class="activeTime">
        <el-form-item prop="start_time" style="margin-right:-60px;">
          <el-time-select
            placeholder="起始时间"
            v-model="shopInfo.start_time"
            :picker-options="{
              start: '06:00',
              step: '00:30',
              end: '24:00',
            }"
          ></el-time-select>
        </el-form-item>
        <el-form-item prop="end_time">
          <el-time-select
            placeholder="结束时间"
            v-model="shopInfo.end_time"
            :picker-options="{
              start: '06:00',
              step: '00:30',
              end: '24:00',
            }"
          ></el-time-select>
        </el-form-item>
      </el-form-item>
      <!-- 店铺头像图片 -->
      <el-form-item label="店铺头像" prop="shop_avatar" :required="shop_avatar">
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
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>

      <!-- 商家服务 -->
      <el-form-item label="商家公告" prop="service">
        <el-input
          class="input"
          placeholder="商家公告"
          v-model="shopInfo.bulletin"
          type="textarea"
        ></el-input>
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
      <!-- 动态增减活动 -->
      <el-form-item
        v-for="(activity, index) in shopInfo.activities"
        :label="'活动优惠' + (index + 1)"
        :key="activity.key"
        :prop="'activities.' + index + '.value'"
        :rules="{
          required: true,
          message: '活动内容不能为空',
          trigger: 'blur',
        }"
      >
        <el-input
          class="input"
          placeholder="优惠虽好, 请仔细填写哦"
          v-model="activity.value"
        ></el-input>
        <el-button @click.prevent="removeActivity(activity)" type="danger">
          删除
        </el-button>
      </el-form-item>

      <!-- 增加活动 -->
      <el-form-item>
        <el-button type="primary" @click="addActivity">新增活动</el-button>
      </el-form-item>

      <!-- 提交 -->
      <el-form-item class="submit-wrap">
        <el-button type="primary" @click="submitForm" :disabled="hasShop">
          立即创建
        </el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- dialog预览图片 -->
    <el-dialog
      v-model="dialogVisible"
      title=""
      width="50%"
      style="text-align: center;"
    >
      <img
        style="height: 800px; width: 800px; margin: 0 auto;"
        :src="shopInfo.pic_url"
        alt=""
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  ref,
  watch,
} from 'vue'
import { getHasShop, locationSearch, createShop } from '@/api/restaurant'
import { uploadShopAvatar } from '@/api/upload'
import config from '@/config'

export default defineComponent({
  setup() {
    const { proxy: ctx } = getCurrentInstance() // 可以把ctx当成vue2中的this

    const state = reactive({
      realName: false, // 实名状态
      hasShop: false, //是否已经注册过店铺
      addressList: [], // 地址选项
      loading: false,
      dialogVisible: false,
      fileFormData: {}, // 向服务器提交的数据

      // 对图片进行表单验证
      shop_avatar: true,
      // 收集除图片外的数据
      shopInfo: {
        shipping_fee: 0,
        lat: '',
        lng: '',
        pic_url: '',
        name: '',
        classify: '',
        call_center: '',
        address: '',
        addressDetail: '',
        start_time: '',
        end_time: '',
        bulletin: '欢迎下单',
        delivery: '商家配送',
        activities: [{ value: '' }],
        min_price: 20,
      },
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
        start_time: [
          {
            required: true,
            message: '请选择时间',
            trigger: 'change',
          },
        ],
        end_time: [
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
      // 删除头像
      removeAvatar() {
        state.shop_avatar = true
        state.shopInfo.pic_url = ''
      },
      // 上传头像
      uploadAvatar(file) {
        uploadShopAvatar({ file: file.raw })
          .then(res => {
            console.log(res)
            state.shop_avatar = false
            state.shopInfo.pic_url = config.baseURL + res.url
          })
          .catch(e => {
            ctx.$message({
              type: 'error',
              message: '头像上传失败',
            })
          })
      },
      // 获取是否已有店铺
      getHasShop() {
        getHasShop().then(res => {
          if (res.data) {
            state.hasShop = true
            ctx.$message({
              type: 'error',
              message: '已有店铺, 不允许注册多个店铺!',
            })
          }
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
            state.shopInfo.address += state.shopInfo.addressDetail
            console.log(state.shopInfo)
            createShop(state.shopInfo)
              .then(res => {
                if (res.status === 200) {
                  ctx.$message({
                    type: 'success',
                    message: res.message,
                  })
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
    methods.getHasShop() //获取是否已有店铺, 控制注册按钮是否可用

    watch(
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
    return {
      ...methods,
      ...toRefs(state),
    }
  },
})
</script>

<style scoped lang="scss">
.add-shop {
  width: 60%;
  margin: 0 auto;
}
.input,
.el-select {
  width: 50%;
  margin-right: 30px;
}

.activeTime {
  //   background-color: red;
  width: 50%;
  :deep(.el-form-item__content) {
    display: flex;
    // width: 60%;
    justify-content: space-between;
    flex: none;
  }
}
</style>
