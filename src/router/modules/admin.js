const Layout = () => import('@/layout/index.vue')
const User = () => import('@/views/main/admin/User.vue')
const Restaurant = () => import('@/views/main/admin/Restaurant.vue')
const Food = () => import('@/views/main/admin/Food.vue')
const AddFood = () => import('@/views/main/admin/AddFood.vue')
const Order = () => import('@/views/main/admin/Order.vue')
export default [
  {
    path: '/main',
    component: Layout,
    name: 'main',
    meta: {
      title: '数据管理',
    },
    icon: 'el-icon-s-data',
    children: [
      {
        path: '',
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
    name: 'main',
    meta: {
      title: '数据管理',
    },
    icon: 'el-icon-s-data',
    children: [
      {
        path: 'restaurant',
        name: 'Restaurant',
        component: Restaurant,
        meta: {
          title: '餐厅管理',
        },
      },
    ],
  },
  {
    path: '/main',
    component: Layout,
    name: 'main',
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
    name: 'main',
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
