import {
  asyncRoutes,
  constantRoutes
} from '@/router'
import {
  asyncServeRoutes,
  constantServeRoutes
} from '@/router/serveRouter'
import {
  listRoutes
} from '@/api/user.js'
import Layout from '@/layout'
//throw new Error（‘出错了‘）
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route
    }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}


/**
 * 后台查询的菜单数据拼装成路由格式的数据
 * @param routes
 */
export function generaMenu(routes, data) {
  data.forEach(item => {

    const menu = {
      path: item.path,
      component: item.component === '#' ? Layout : item.component,
      name: item.name,
      meta: {
        title: item.meta.title,
        roles: item.meta.roles
      },
      children: []

    }
    if (item.children) {

      generaMenu(menu.children, item.children)
    }
    routes.push(menu)
    console.log(routes)
  })
}


const actions = {
  generateRoutes({
    commit
  }, roles) {
    return new Promise(resolve => {
      let accessedRoutes = null;
      var listRoutes00 = [];

      const loadMenuData = [];
      // listRoutes().then(function(response) {
      //     console.log(response);
      //     listRoutes00 = [{}];
      //     Object.assign(loadMenuData, listRoutes00)
      //     generaMenu(asyncRoutes, loadMenuData)
      //   })
      //   .catch(function(error) {
      //     console.log(error);
      //   });
      accessedRoutes = filterAsyncRoutes(listRoutes00, roles);
      commit('SET_ROUTES', accessedRoutes);
      resolve(accessedRoutes);
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
