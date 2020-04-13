import request from '@/utils/request'


export default {
  login: function(data) {
    return request({
      url: '/sp_login',
      method: 'get',
      params: data
    })
  }
}
