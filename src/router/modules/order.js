const Layout = () => import('@/layout/index.vue')

export default [
  {
    path: '/main',
    component: Layout,
    name: 'main3',
    meta: {
      title: '我的订单',
    },
    icon: 'el-icon-s-order',
    children: [
      {
        path: 'order',
        name: 'order',
        meta: { title: '订单' },
        component: () => import('@/views/main/order/order.vue'),
      },
    ],
  },
]
