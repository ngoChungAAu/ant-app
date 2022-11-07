export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'list.basic-list',
    icon: 'table',
    path: '/common',
    component: './CommonList',
  },
  {
    name: 'list.test-list',
    icon: 'table',
    path: '/test',
    component: './TestPage',
  },
  {
    path: '/',
    redirect: '/common',
  },
  {
    component: './404',
  },
];
