/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/users',
  component: Layout,
  redirect: '/users/userlist',
  name: 'Table',
  meta: {
    title: 'Table',
    icon: 'table'
  },
  children: [

    {
      path: 'complex-table',
      component: () => import('@/views/users/userlist'),
      name: 'ComplexTable',
      meta: { title: 'complexTable' }
    }
  ]
}
export default tableRouter
