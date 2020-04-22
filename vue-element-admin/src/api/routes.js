import request from '@/utils/request'



export default {
  addRoutes: function(data) {
    return request({
      url: '/menu/add',
      method: 'post',
      data
    })
  },
  listRoutes: function() {
    return request({
      url: '/menu/lists',
      method: 'get'
    })
  },
  deletRoutes: function(data) {
    return request({
      url: '/menu/del',
      method: 'post',
      data
    })
  },
  editRoutes: function(data) {
    return request({
      url: '/menu/edit',
      method: 'post',
      data
    })
  },
}
