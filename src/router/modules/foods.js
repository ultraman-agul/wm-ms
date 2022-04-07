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
        path: 'food',
        name: 'food',
        meta: { title: '食品信息' },
        component: () => import('@/views/main/food/foodList.vue'),
      },
    ],
  },
]
