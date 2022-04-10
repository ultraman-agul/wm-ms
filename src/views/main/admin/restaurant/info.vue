<template>
  <div class="main-content shop-info">
    <el-tabs type="border-card">
      <el-tab-pane label="店铺信息">
        <div class="show-info">
          <el-descriptions class="margin-top" :column="1" border>
            <template v-slot:extra>
              <!-- 抽屉组件 -->
              <info-form @hasUpdate="getShopInfo"></info-form>
            </template>

            <el-descriptions-item>
              <template v-slot:label>
                <i class="el-icon-user"></i>
                店铺头像
              </template>
              <el-avatar :size="60">
                <img :src="shopInfo.pic_url" />
              </el-avatar>
            </el-descriptions-item>

            <el-descriptions-item>
              <template v-slot:label>
                <i class="el-icon-office-building"></i>
                店铺名
              </template>
              {{ shopInfo.name }}
            </el-descriptions-item>

            <el-descriptions-item>
              <template v-slot:label>
                <i class="el-icon-time"></i>
                营业时间
              </template>
              {{ shopInfo.shopping_time_start }} -
              {{ shopInfo.shopping_time_end }}
            </el-descriptions-item>

            <el-descriptions-item>
              <template v-slot:label>
                <i class="el-icon-price-tag"></i>
                店铺分类
              </template>
              {{ shopInfo.category }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template v-slot:label>
                <i class="el-icon-tickets"></i>
                配送形式
              </template>
              <el-tag size="small">{{ shopInfo.delivery }}</el-tag>
            </el-descriptions-item>

            <el-descriptions-item>
              <template v-slot:label>
                <i class="el-icon-location-outline"></i>
                店铺地址
              </template>
              {{ shopInfo.address }}
            </el-descriptions-item>
          </el-descriptions>
          <el-divider content-position="center">活动公告</el-divider>
        </div>

        <div class="cards">
          <!-- 活动展示 -->
          <el-card class="box-card">
            <template #header class="clearfix">
              <span class="el-icon-goods">活动列表</span>
            </template>
            <el-button class="addActivity" @click="addActivity" type="primary">
              再加一条
            </el-button>
            <el-table :data="newActivities">
              <el-table-column label="活动内容" prop="info"></el-table-column>
              <el-table-column label="图标" prop="icon_url">
                <template #default="scope">
                  <img :src="scope.row.icon_url" alt="" />
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button
                    icon="el-icon-delete"
                    @click="removeActivity(scope.row)"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>

          <!-- 公告展示 -->
          <el-card class="box-card-notice">
            <template #header class="clearfix">
              <span class="el-icon-chat-line-round">店铺公告</span>
            </template>
            <div>
              {{ shopInfo.bulletin }}
            </div>
          </el-card>
        </div>

        <div class="dialogs">
          <!-- dialog修改店铺活动 -->
          <el-dialog v-model="activityDialog" title="活动优惠">
            <el-form :rules="rules" :model="editForm" ref="activityForm">
              <el-form-item label="活动内容" prop="info">
                <el-input class="input" v-model="editForm.info"></el-input>
              </el-form-item>
              <el-form-item label="活动类型" prop="icon_url">
                <el-radio-group v-model="editForm.icon_url">
                  <el-radio
                    label="http://p0.meituan.net/xianfu/f8bc8dffdbc805878aa3801a33f563cd1001.png"
                  >
                    满减
                  </el-radio>
                  <el-radio
                    label="http://p1.meituan.net/xianfu/9c997ecce6150671b8459738a26f8bd9767.png"
                  >
                    打折
                  </el-radio>
                  <el-radio
                    label="http://p0.meituan.net/xianfu/019d1bbb1310b1531e6af6172c9a5095581.png"
                  >
                    首单优惠
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>

            <template #footer class="dialog-footer">
              <div class="footer-right">
                <el-button @click="activityDialog = false">取 消</el-button>
                <el-button
                  type="primary"
                  @click.prevent="updateActivities(true)"
                >
                  确 定
                </el-button>
              </div>
            </template>
          </el-dialog>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import infoForm from './infoForm.vue'
import { updateActivities } from '@/api/restaurant'
import { useRoute } from 'vue-router'
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  ref,
  computed,
} from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  components: { infoForm },
  setup() {
    const store = useStore()
    const route = useRoute()
    const { proxy: ctx } = getCurrentInstance()
    const restaurant_id = route.query.id
    const state = reactive({
      shopInfo: {},
      activityDialog: false,
      newActivities: [],
      rules: {
        info: [{ required: true, message: '请输入活动信息', trigger: 'blur' }],
        icon_url: [{ required: true, message: '请选择活动类型' }],
      },
      activityForm: ref(null),
      editForm: {},

      // 获取店铺信息
      getShopInfo() {
        store.dispatch('restaurant/getShopInfo', { restaurant_id })
      },
      // 控制新增活动的dialog
      showActivityDialog() {
        state.activityDialog = !state.activityDialog
      },
      // 删除活动
      removeActivity(row) {
        ctx
          .$confirm('确认删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
          .then(() => {
            state.updateActivities({ info: row.info })
            ctx.$message({
              type: 'success',
              message: '删除成功!',
            })
          })
          .catch(() => {
            ctx.$message({
              type: 'info',
              message: '已取消删除',
            })
          })
      },
      // 新增活动
      addActivity() {
        state.activityDialog = true
        state.editForm = {}
      },
      // 更新活动
      updateActivities(data) {
        let validFlag = true
        if (data === true) {
          state.activityForm.validate(valid => {
            if (valid) {
              data = state.editForm
            } else {
              console.log(111)
              validFlag = false
              return
            }
          })
        }
        if (validFlag === false) {
          return
        }
        // 将空value剔除
        updateActivities({
          data,
          shopId: state.shopInfo.id,
        })
          .then(res => {
            if (res.status == 200) {
              state.getShopInfo()
              state.editForm = {}
            }
          })
          .catch(e => {
            console.log(e)
          })
          .finally(() => {
            state.activityDialog = false
          })
      },
    })
    state.getShopInfo()
    state.shopInfo = computed(() => store.state.restaurant.shopInfo)
    state.newActivities = computed(
      () => store.state.restaurant.shopInfo.discounts2
    )
    return {
      ...toRefs(state),
    }
  },
})
</script>

<style scoped lang="scss">
.el-tag {
  margin-right: 10px;
}

.iconfont {
  margin-left: 3px;
}

.cards {
  display: flex;
  justify-content: space-around;

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: '';
  }
  .clearfix:after {
    clear: both;
  }

  .box-card,
  .box-card-notice {
    width: 480px;
  }
  .box-card-notice {
    height: 30%;
  }
}

.dialog-el {
  .el-input {
    width: 68%;
    margin-right: 20px;
    margin: 0 20px 20px 10px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
}
</style>
