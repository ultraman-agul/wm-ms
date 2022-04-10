const Layout = () => import('@/layout/index.vue')
const User = () => import('@/views/main/admin/user/user.vue')
const Restaurant = () => import('@/views/main/admin/restaurant/restaurant.vue')
const RestaurantInfo = () => import('@/views/main/admin/restaurant/info.vue')
const Food = () => import('@/views/main/admin/food/foodList.vue')
const ComfirmRegister = () =>
  import('@/views/main/admin/comfirmRegister/comfirmRegister.vue')
const Order = () => import('@/views/main/admin/Order.vue')
export default [
  {
    path: '/main',
    component: Layout,
    name: 'main5',
    meta: {
      title: '用户管理',
    },
    icon: 'el-icon-s-data',
    children: [
      {
        path: 'user',
        name: 'user',
        component: User,
        meta: {
          title: '用户管理',
        },
      },
    ],
  },
  {
    path: '/main',
    component: Layout,
    name: 'main6',
    meta: {
      title: '店铺管理',
    },
    icon: 'el-icon-s-shop',
    children: [
      {
        path: 'restaurant',
        name: 'restaurant',
        component: Restaurant,
        meta: {
          title: '店铺管理',
        },
      },
      {
        path: 'comfirmRegister',
        name: 'comfirmRegister',
        component: ComfirmRegister,
        meta: {
          title: '注册申请',
        },
      },
      {
        path: 'restaurantInfo',
        name: 'restaurantInfo',
        component: RestaurantInfo,
        hidden: true,
        meta: {
          title: '店铺信息',
        },
      },
      {
        path: 'food',
        name: 'food',
        component: Food,
        hidden: true,
        meta: {
          title: '食品信息',
        },
      },
    ],
  },
  {
    path: '/main',
    component: Layout,
    name: 'main8',
    meta: {
      title: '数据管理',
    },
    icon: 'el-icon-s-data',
    children: [
      {
        path: 'order',
        name: 'Order',
        component: Order,
        meta: {
          title: '订单管理',
        },
      },
    ],
  },
]
