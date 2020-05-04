/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/',
  component: Layout,
  redirect: '/userlist',
  name: 'user',  //换成英文 i18n就不会警告
  meta: {
    title: 'user',
    icon: 'table'
  },
  children: [
    {
      path: 'userlist',
      component: () => import('@/views/users/userlist'),
      name: 'userlist',  //缓存组件的名称，当这个路由name名称匹配到同名的组件名称keep-alive就会缓存。
      meta: { title: 'userlist' ,affix: true } //换成英文 i18n就不会警告，通过lang的router翻译，体现在浏览器title和系统标签
    }
  ]
}
export default tableRouter
