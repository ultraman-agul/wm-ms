const Layout = () => import('@/layout/index.vue')

export default [
  {
    path: '/main',
    component: Layout,
    name: 'main4',
    meta: {
      title: '顾客评论',
    },
    icon: 'el-icon-s-comment',
    children: [
      {
        path: 'comment',
        name: 'comment',
        meta: { title: '评论' },
        component: () => import('@/views/main/comment/comment.vue'),
      },
    ],
  },
]
