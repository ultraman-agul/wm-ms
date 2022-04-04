const Layout = () => import('@/layout/index.vue')

export default [
  {
    path: '/main',
    component: Layout,
    name: 'main1',
    meta: {
      title: '我的店铺',
    },
    icon: 'el-icon-s-shop',
    children: [
      {
        path: 'register',
        name: 'register',
        meta: { title: '注册店铺' },
        component: () => import('@/views/main/shop/register/register.vue'),
      },
      {
        path: 'info',
        name: 'shopInfo',
        meta: { title: '店铺信息' },
        component: () => import('@/views/main/shop/info/info.vue'),
      },
    ],
  },
]
