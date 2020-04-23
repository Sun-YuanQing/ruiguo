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
var menudata =null;
export function generaMenu(routes, data) {
  data.forEach(item => {
    if(typeof  item.meta =='string'){
      item.meta = JSON.parse(item.meta);
    }

    var menu = {
      path: item.path,
      component:components[item.component1],
      hidden: item.hidden==0?false:true,
      name: item.name,
      redirect: item.redirect,
      meta: {
        title: item.meta.title,
        icon: item.meta.icon,
        roles: item.meta.roles
      },
      children: []
    }

    if (item.children) {
      generaMenu(menu.children, item.children)
    }
    routes.push(menu);
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
          console.log(response);
          listRoutes00 = [{
            "pid": "0",
            "path": "/i18n",
            "component1": "Layout",
            "redirect": "/i18n/index",
            "always_show": 1,
            "children_roles": 0,
            "hidden": 0,
            "name": "国际化",
            "type": 1,
            "editstate": "add",
            "meta": "{\"title\":\"\\u56fd\\u9645\\u5316\",\"icon\":\"international\",\"noCache\":true,\"affix\":1}",
            "update_time": 1587552840,
            "menu_id": 269,
            "children": [{
                "pid": "269",
                "path": "index",
                "component1": "i18n",
                "redirect": "",
                "always_show": 1,
                "children_roles": 0,
                "hidden": 0,
                "name": "国际化语言",
                "type": 1,
                "editstate": "add",
                "meta": "{\"title\":\"\\u6807\\u9898\",\"icon\":\"international\",\"noCache\":true,\"affix\":1}",
                "update_time": 1587552960,
                "menu_id": 270
              }
            ]
          }];
          Object.assign(loadMenuData, listRoutes00)
          generaMenu(asyncRoutes, loadMenuData)

          accessedRoutes = filterAsyncRoutes(listRoutes00, roles)

          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        })
        .catch(function(error) {
          console.log(error);
        });


    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
