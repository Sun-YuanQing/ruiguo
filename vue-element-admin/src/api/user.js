
import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login/login',
    method: 'post',
    // params:data,
    data
  })
}
export function getInfo() {
  return request({
    url: '/login/adopt',
    method: 'get'
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/login/sign_out',
    method: 'get'
  })
}

export function  addRoutes(data) {
    return request({
      url: '/menu/add',
      method: 'post',
      data
    })
  }
  
export function  listRoutes() {
    return request({
      url: '/menu/lists',
      method: 'get'
    })
  }



