import request from '@/utils/request'



export default {
  addRoutes: function(data) {
    return request({
      url: '/menu/add',
      method: 'post',
      data
    })
  },
  listRoutes: function(data) {
    return request({
      url: '/menu/lists',
      method: 'get'
    })
  },
}
