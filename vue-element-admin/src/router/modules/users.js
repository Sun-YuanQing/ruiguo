/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/',
  component: Layout,
  redirect: '/userlist',
  name: 'Table',
  meta: {
    title: 'Table',
    icon: 'table'
  },
  children: [
    {
      path: 'userlist',
      component: () => import('@/views/users/userlist'),
      name: 'ComplexTable',
      meta: { title: 'complexTable' }
    }
  ]
}
export default tableRouter
