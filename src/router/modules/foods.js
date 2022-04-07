const Layout = () => import('@/layout/index.vue')

export default [
  {
    path: '/main',
    component: Layout,
    name: 'main2',
    meta: {
      title: '食品中心',
    },
    icon: 'el-icon-goods',
    children: [
      {
        path: 'addFood',
        name: 'addFood',
        meta: { title: '添加食品' },
        component: () => import('@/views/main/food/addFood/addFood.vue'),
      },
      {
        path: 'foodList',
        name: 'foodList',
        meta: { title: '食品信息' },
        component: () => import('@/views/main/food/foodList/foodList.vue'),
      },
    ],
  },
]
