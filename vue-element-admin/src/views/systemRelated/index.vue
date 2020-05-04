<template>
  <div style="padding: 25px;">
    <el-tabs type="border-card">
<!-- 添加菜单 -->
      <el-tab-pane label="添加菜单">
        <!-- 权限 -->
        <el-button type="text" size="mini" @click="() => onAddTree(data=null,type=0)">
          添加一级菜单
        </el-button>
        <el-tree :data="treeData" node-key="id" default-expand-all :expand-on-click-node="false" :props="defaultProps">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button type="text" size="mini" v-if="data.type==1 && !data.children_roles" @click="() => onAddTree(data,type=1)">
                添加菜单
              </el-button>
              <el-button type="text" size="mini" v-if="data.type==2 || !data.children || data.children_roles " @click="()=> onAddTree(data,type=2)">
                添加权限
              </el-button>
              <el-button type="text" size="mini" @click="() => onEditTree(data,type=3)">
                修改
              </el-button>
              <el-button type="text" size="mini" @click="() => onDeletTree(node, data)">
                删除
              </el-button>
            </span>
          </span>
        </el-tree>
      </el-tab-pane>

    </el-tabs>

    <el-dialog title="菜单" :visible.sync="showEditTree">
      <el-form ref="formData" :model="tempMenu" label-position="left" label-width="70px" style="width: 100%; margin-left:50px;">
        <el-form-item label="url路径" label-width="20%" style="width:80%">
          <el-input v-model="tempMenu.path" style="width:100%" />
        </el-form-item>
        <el-form-item label="菜单名称" label-width="20%" style="width:80%">
          <el-input v-model="tempMenu.name" placeholder="菜单名称" style="width:100%" />
        </el-form-item>

        <el-form-item label="重定向url" label-width="20%" style="width:80%">
          <el-input v-model="tempMenu.redirect" style="width:100%" />
        </el-form-item>
        <el-form-item label="菜单文件路径" label-width="20%" style="width:80%">
          <el-input v-model="tempMenu.component" placeholder="一级菜单为'Layout'" style="width:100%" />
        </el-form-item>
        <el-form-item label="隐藏菜单" label-width="100">
          <el-tooltip :content="tempMenu.hidden == 1 ? '隐藏' : '显示'" placement="top">
            <el-switch @change="onUserStatus('tempMenu')" v-model="tempMenu.hidden" active-color="#7B68EE"
              inactive-color="#cccccc" :active-value="1" :inactive-value="0"></el-switch>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="下级类型" label-width="100">
          <el-tooltip :content="tempMenu.children_roles == 1 ? '下级是权限' : '下级是菜单'" placement="top">
            <el-switch @change="onUserStatus('tempMenu')" v-model="tempMenu.children_roles" active-color="#7B68EE"
              inactive-color="#cccccc" :active-value="1" :inactive-value="0"></el-switch>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="title" label-width="20%" style="width:80%">
          <el-input v-model="tempMenu.meta.title" placeholder="网页title." style="width:100%" />
        </el-form-item>
        <el-form-item label="菜单luog" label-width="20%" style="width:80%">
          <el-input v-model="tempMenu.meta.icon" placeholder="菜单luog,请参考Element ui" style="width:100%" />
        </el-form-item>
        <el-form-item label="页面权重">
          <el-tooltip :content="tempMenu.meta.affix == 1 ? '打开页面后不能关闭' : '可以关闭页面'" placement="top">
            <el-switch v-model="tempMenu.meta.affix" active-color="#7B68EE" inactive-color="#cccccc" :active-value="1"
              :inactive-value="0"></el-switch>
          </el-tooltip>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel()">取消</el-button>
        <el-button type="primary" @click="onAddMenu()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="权限" :visible.sync="showEditRoles">
      <el-form ref="formData" :model="tempRoles" label-position="left" label-width="70px" style="width: 100%; margin-left:50px;">

        <el-form-item label="权限名称" label-width="20%" style="width:80%">
          <el-input v-model="tempRoles.name" placeholder="菜单名称" style="width:100%" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">

        <el-button @click="onCancel()">取消</el-button>
        <el-button type="primary" @click="onAddMenu()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import routes from '@/api/routes.js';
  export default {

    name: 'menuPermissions',
    components: {

    },

    filters: {

    },
    data() {
      return {

        defaultProps: {
          children: 'children',
          label: 'name'
        },
        treeData: [],
        showEditTree: false,
        treeType: 0,
        tempTreedata: null,
        tempMenu: {
          path: '',
          component: "Layout",
          redirect: '/',
          always_show: true,
          hidden: false,
          name: '',
          type: 0,
          children_roles: 0,
          editstate: "add",
          meta: {
            title: '标题',
            icon: '图标international', //international、、lock
            noCache: true, //忘了是什么先加着
            affix: false, //可以被删除标签//Roles
          }
        },
        showEditRoles: false,
        tempTreeRoles: null,
        tempRoles: {
          pid: "",
          children_roles: 1,
          name: "",
          type: 0
        },
        tempItem: null
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        routes.listRoutes().then((response) => {
            console.log(response);
            this.treeData = response.data;
            var strData = JSON.stringify(this.treeData)
            console.log(strData)
          })
          .catch(function(error) {
            console.log(error);
          });
      },
      onAddTree(data, type) {
        this.treeType = type;
        this.tempItem = data;
        this.tempTreedata = data;
        if (this.treeType == 1 || this.treeType == 0) {

          this.showEditTree = true;
        } else if (this.treeType == 2) {
          this.showEditRoles = true;
        }
        //新的菜单
        if (this.tempItem.type == 1) {
          this.tempMenu = {
            path: '',
            component: "Layout",
            redirect: '/',
            always_show: true,
            hidden: false,
            name: '',
            type: 0,
            children_roles: 0,
            editstate: "add",
            meta: {
              title: '标题',
              icon: '图标international', //international、、lock
              noCache: true, //忘了是什么先加着
              affix: false, //可以被删除标签//Roles
            },
          }
        } else if (this.tempItem.type == 2) {
          this.tempRoles = {
            pid: "",
            children_roles: 1,
            name: "",
            type: 0
          }
        }

      },
      onEditTree(data, type) {
        this.treeType = type;
        //tempItem
        this.tempItem = data;
        this.tempTreedata = data;
        if (this.tempItem.type == 1) {
          var strData = JSON.stringify(data);
          this.tempMenu = data //JSON.parse(strData);
          this.showEditTree = true;
        } else if (this.tempItem.type == 2) {
          var strData = JSON.stringify(data);
          this.tempRoles = data //JSON.parse(strData);
          this.showEditRoles = true;
        }
      },
      onAddMenu() {
        var that = this;
        if (that.treeType == 2) {
          console.log("添加权限==>")
          that.tempRoles.children_roles = 1;
          that.tempRoles.type = 2;
          that.tempRoles.pid = that.tempTreedata.menu_id;
          if (!that.tempTreedata.children) {
            this.$set(that.tempTreedata, 'children', []);
          }
          var serveData = {
            id: that.tempTreedata.menu_id,
            children: that.tempRoles
          }

          routes.addRoutes(serveData).then(function(response) {
              console.log(response);
              that.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              });
              //下一级是权限否
              that.tempRoles.children_roles = 1;
              that.tempRoles.menu_id = response.data.menu_id;

              that.tempTreedata.children = that.tempTreedata.children || [];
              that.tempTreedata.children.push(that.tempRoles);
              that.showEditTree = false;
              that.showEditRoles = false;
              that.getList();
            })
            .catch(function(error) {
              console.log(error);
            });
        }
        if (that.treeType == 1) {

          that.tempMenu.type = 1;
          that.tempMenu.children_roles = 0;
          var serveData = {
            id: that.tempTreedata.menu_id,
            children: that.tempMenu,
          }
          console.log("添加菜单==>")

          routes.addRoutes(serveData)
            .then(function(response) {
              console.log(response);
              that.$notify({
                title: '成功',
                message: '添加成功', //[ {}, {}]
                type: 'success',
                duration: 2000
              });
              that.tempMenu.menu_id = response.data.menu_id;

              that.tempTreedata.children = that.tempTreedata.children || [];
              that.tempTreedata.children.push(that.tempMenu);
              that.showEditTree = false;
            })
            .catch(function(error) {
              console.log(error);
            });
        } else if (that.treeType == 0) {
          console.log("添加一级菜单")
          var that = this;
          that.tempMenu.type = 1;
          //一级菜单为0
          var serveData = {
            id: 0,
            children: that.tempMenu
          }
          console.log(serveData);
          routes.addRoutes(serveData).then(function(response) {
              console.log(response);
              that.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              });
              //加上服务器的id,不然删除找不到id。
              that.tempMenu.menu_id = response.data.menu_id;
              that.treeData.children = that.treeData.children || [];
              that.treeData.push(that.tempMenu);
              that.showEditTree = false;
            })
            .catch(function(error) {
              console.log(error);
            });
        } else if (that.treeType == 3) {
          //编辑权限



          if (that.tempItem.type == 2) {
            try {
              that.tempRoles.type = 2;
              var serveData = {
                id: that.tempRoles.menu_id,
                children: that.tempRoles
              }
              routes.editRoutes(serveData)
                .then(function(response) {
                  console.log(response);
                  that.$notify({
                    title: '成功',
                    message: '编辑成功', //[ {}, {}]
                    type: 'success',
                    duration: 2000
                  });
                  that.tempTreedata = {
                    ...that.tempTreedata,
                    ...that.tempRoles
                  };


                  that.showEditTree = false;
                  that.showEditRoles = false;
                })
                .catch(function(error) {
                  console.log(error);
                  var strData = JSON.stringify(that.tempTreedata);
                  that.tempRoles = JSON.parse(strData);
                });
            } catch (e) {
              var strData = JSON.stringify(that.tempTreedata);
              that.tempRoles = JSON.parse(strData);
            }
          } else {
            try {
              that.tempMenu.type = 1;
              var serveData = {
                id: that.tempMenu.menu_id,
                children: that.tempMenu
              }
              console.log("编辑菜单==>")

              routes.editRoutes(serveData)
                .then(function(response) {
                  console.log(response);
                  that.$notify({
                    title: '成功',
                    message: '编辑成功', //[ {}, {}]
                    type: 'success',
                    duration: 2000
                  });

                  that.showEditTree = false;
                  that.showEditRoles = false;
                })
                .catch(function(error) {
                  var strData = JSON.stringify(that.tempTreedata);
                  that.tempMenu = JSON.parse(strData);
                });
            } catch (e) {
              var strData = JSON.stringify(that.tempTreedata);
              that.tempMenu = JSON.parse(strData);
            }
          }
        }
        // that.showEditTree = true;
      },
      onDeletTree(node, data) {
        console.log(node, data)
        // alert(data.menu_id)
        var that = this;
        routes.deletRoutes({
            menu_id: data.menu_id
          }).then(function(response) {
            console.log(response);

            if (!response) {
              that.$notify({
                title: '失败',
                message: '删除失败',
                type: 'fail',
                duration: 2000
              });
              return false
            }
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.menu_id === data.menu_id);
            children.splice(index, 1);
            that.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
          })
          .catch(function(error) {
            console.log(error);
          });
      },

      confirmRole() {
        console.log("确定");
        this.showTree = false;
      },
      onCancel() {
        this.showEditTree = false;
        this.showEditRoles = false;
        this.getList();
      }
    }
  };
</script>

<style>
  .pan-item {
    width: 50%;
    height: 15rem;
    border-radius: 50%;
  }

  .userImg {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;

  }

  .app {
    width: 100%;
    display: flex;
    justify-content: center;
    /* flex-direction:row; */
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
