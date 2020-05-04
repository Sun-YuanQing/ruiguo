import {
  asyncRoutes,
  constantRoutes
} from '@/router'
import {
  listRoutes
} from '@/api/user.js'
import components from '@/components/components'
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
var menudata = null;
export function generaMenu(routes, data) {
  data.forEach(item => {
    var menu = {
      path: item.path,
      component: components[item.component1],
      hidden: item.hidden == 0 ? false : true,
      name: item.name,
      alwaysShow: item.always_show,
      redirect: item.redirect,
      children: []
    }
    if (typeof item.meta == 'string') {
      item.meta = JSON.parse(item.meta);
      menu.meta = {
        title: item.meta.title,
        icon: item.meta.icon,
        affix: item.meta.affix == 1 ? true : false,
        noCache: item.meta.noCache == 1 ? true : false,
        roles: item.meta.roles
      }
    }
    if (item.children) {
      routes.push(menu);
      generaMenu(menu.children, item.children)
    } else {
      routes.push(menu);
    }
    console.log(routes)
  })
}


const actions = {
  generateRoutes({
    commit
  }, roles) {
    return new Promise(resolve => {
      let accessedRoutes = null;
      var listRoutes00 = null;

      const loadMenuData = [];
      listRoutes().then(function(response) {
          console.log('获取',response.data);
          listRoutes00 =response.data||[]
          Object.assign(loadMenuData, listRoutes00)
          generaMenu(asyncRoutes, loadMenuData)

          accessedRoutes = filterAsyncRoutes(listRoutes00, roles)

          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        })
        .catch(function(error) {
          console.log(error);
        });
         accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)

    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
