//https://segmentfault.com/q/1010000017533147

export default {
  Layout: () => import('@/layout/index'),
  i18n: () => import('@/views/i18n-demo/index'),
  menuPermissions: () => import('@/views/systemRelated/index'),
  users: () => import('@/views/users/userlist')
}
