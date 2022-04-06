const Layout = () => import('@/layout/index.vue')

export default [
  {
    path: '/main',
    component: Layout,
    name: 'main2',
    meta: {
      title: '商品中心',
    },
    icon: 'el-icon-goods',
    children: [
      {
        path: 'addGoods',
        name: 'addGoods',
        meta: { title: '添加商品' },
        component: () => import('@/views/main/food/addGoods/addGoods.vue'),
      },
    ],
  },
]
