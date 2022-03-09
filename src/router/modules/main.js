const Layout = () => import('@/layout/index.vue')
const User = () => import('@/views/main/User.vue')
const Restaurant = () => import('@/views/main/Restaurant.vue')
const Category = () => import('@/views/main/Category.vue')
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
      {
        path: 'restaurant',
        name: 'Restaurant',
        component: Restaurant,
        meta: {
          title: '餐厅管理',
        },
      },
      {
        path: 'restaurantEdit',
        name: 'RestaurantEdit',
        component: Category,
        meta: {
          title: '分类编辑',
        },
        hidden: true, // 不在菜单中显示
      },
      //   {
      //     path: '/category',
      //     name: 'Category',
      //     component: Category,
      //     meta: {
      //       title: '分类管理',
      //     },
      //     hidden: true,
      //   },
      //   {
      //     path: 'add',
      //     name: 'testAdd',
      //     component: Add,
      //     meta: {
      //       title: '添加',
      //     },
      //     hidden: true, // 不在菜单中显示
      //   },
      //   {
      //     path: 'edit/:id',
      //     name: 'testEdit',
      //     component: Edit,
      //     meta: {
      //       title: '编辑',
      //     },
      //     hidden: true, // 不在菜单中显示
      //   },
      //   {
      //     path: 'auth',
      //     name: 'testAuth',
      //     component: Auth,
      //     meta: {
      //       title: '权限测试',
      //     },
      //   },
      //   {
      //     path: 'noauth',
      //     name: 'testNoAuth',
      //     component: NoAuth,
      //     meta: {
      //       title: '权限页面',
      //     },
      //     hidden: true,
      //   },
      //   {
      //     path: 'cache',
      //     name: 'test-cache',
      //     component: Iscache,
      //     meta: {
      //       title: '该页面可缓存',
      //     },
      //   },
      //   {
      //     path: 'nocache',
      //     name: 'test-no-cache',
      //     component: Nocache,
      //     meta: {
      //       title: '该页面不缓存',
      //       noCache: true, // 不缓存页面
      //     },
      //   },
      //   {
      //     path: 'nest',
      //     name: 'nest',
      //     component: Nest,
      //     redirect: '/test/nest/page1',
      //     meta: {
      //       title: '二级菜单',
      //     },
      //     children: [
      //       {
      //         path: 'page1',
      //         name: 'nestPage1',
      //         component: NestPage1,
      //         meta: {
      //           title: 'page1',
      //         },
      //       },
      //       {
      //         path: 'page2',
      //         name: 'nestPage2',
      //         component: NestPage2,
      //         meta: {
      //           title: 'page2',
      //         },
      //       },
      //     ],
      //   },
      //   {
      //     path: 'error-log',
      //     name: 'test-error-log',
      //     component: ErrorLog,
      //     meta: {
      //       title: '测试错误日志',
      //     },
      //   },
    ],
  },
]
