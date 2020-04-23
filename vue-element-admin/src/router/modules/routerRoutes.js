/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const routerRoutes = {
  path: '/routerRoutes',
  component: Layout,
  name: '系统相关',
  meta: {
    title: '系统相关',
    icon: 'table'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/routerRoutes/index'),
      name: '系统菜单/权限',
      meta: { title: '系统菜单/权限', icon: 'table'}
    }
  ]
}
export default routerRoutes
