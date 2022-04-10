const Layout = () => import('@/layout/index.vue')
const User = () => import('@/views/main/admin/user/user.vue')
const Restaurant = () => import('@/views/main/admin/restaurant/restaurant.vue')
const RestaurantInfo = () => import('@/views/main/admin/restaurant/info.vue')
const Food = () => import('@/views/main/admin/Food.vue')
const AddFood = () => import('@/views/main/admin/AddFood.vue')
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
        path: 'restaurantInfo',
        name: 'restaurantInfo',
        component: RestaurantInfo,
        hidden: true,
        meta: {
          title: '店铺详情',
        },
      },
    ],
  },
  {
    path: '/main',
    component: Layout,
    name: 'main7',
    meta: {
      title: '数据管理',
    },
    icon: 'el-icon-s-data',
    children: [
      {
        path: 'food',
        name: 'Food',
        component: Food,
        meta: {
          title: '食品列表',
        },
        // hidden: true, // 不在菜单中显示
      },
      {
        path: 'addFood',
        name: 'addFood',
        component: AddFood,
        meta: {
          title: '添加食品',
        },
        hidden: true, // 不在菜单中显示
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
