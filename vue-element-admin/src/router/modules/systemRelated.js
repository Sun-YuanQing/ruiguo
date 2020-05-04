/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const systemRelated = {
  path: '/systemRelated',
  component: Layout,
  name: 'systemRelated',  //换成英文 i18n就不会警告
  meta: {
    title: 'systemRelated',
    icon: 'table'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/systemRelated/index'),
      name: 'menuPermissions',  //换成英文 i18n就不会警告
      meta: { title: 'menuPermissions', icon: 'table'}
    }
  ]
}
export default systemRelated
