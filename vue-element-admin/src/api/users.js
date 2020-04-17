import request from '@/utils/request'



export default {
  lists: function(data) {
    return request({
      url: '/admin_user/lists',
      method: 'get',
      params:data,
    })
  },
  createUser: function(data) {
    return request({
      url: '/admin_user/add',
      method: 'post',
      // params:data,
      data
    })
  }
}
