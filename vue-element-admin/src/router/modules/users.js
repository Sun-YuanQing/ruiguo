/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/',
  component: Layout,
  redirect: '/userlist',
  name: '用户',
  meta: {
    title: '用户',
    icon: 'table'
  },
  children: [
    {
      path: 'userlist',
      component: () => import('@/views/users/userlist'),
      name: '用户列表',
      meta: { title: '用户列表' ,affix: true }
    }
  ]
}
export default tableRouter
