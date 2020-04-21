<template>
  <div style="padding: 25px;">
    <el-tabs type="border-card">
      <!-- <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> 我的行程</span>
        我的行程
      </el-tab-pane> -->
      <el-tab-pane label="添加菜单">
        <!-- 权限 -->
        <el-button type="text" size="mini" @click="() => append(data=null,type=0)">
          添加一级菜单
        </el-button>
        <el-tree :data="treeData" show-checkbox node-key="id" default-expand-all :expand-on-click-node="false" :props="defaultProps">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label +"===="+data.menu_id }}</span>
            <span>
              <el-button type="text" size="mini" v-if="data.meta && data.path || data.type==1 " @click="() => append(data,type=1)">
                添加菜单
              </el-button>
              <el-button type="text" size="mini" @click="() => onEditTree(data,type=1)">
                修改
              </el-button>
              <el-button type="text" size="mini" @click="() => onDeletTree(node, data)">
                删除
              </el-button>
            </span>
          </span>
        </el-tree>


      </el-tab-pane>
      <el-tab-pane label="添加权限">
        <el-tree :data="treeData" show-checkbox node-key="id" default-expand-all :expand-on-click-node="false" :props="defaultProps">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>

              <el-button type="text" size="mini" v-if="!data.meta || data.type==2 " @click="() => append(data,type=2)">
                添加权限
              </el-button>
              <el-button type="text" size="mini" @click="() => onDeletTree(node, data)">
                删除
              </el-button>
            </span>
          </span>
        </el-tree>
      </el-tab-pane>
    </el-tabs>
<!--    <template>
      <el-button type="text" @click="open">点击打开 Message Box</el-button>
    </template> -->
  </div>
</template>

<script>
  import routes from '@/api/routes.js';
  export default {

    name: 'ComplexTable',
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
        treeData1: [{
          id: 1,
          path: '/components',
          component: "Layout",
          redirect: '/',
          alwaysShow: true,
          hidden: false, //true
          name: 'ComponentDemo',
          type: 1,
          meta: {
            title: 'ComponentDemo', //i18n
            icon: 'international', //international、、lock
            noCache: true, //忘了是什么先加着
            affix: false, //可以被删除标签
            roles: ["admin"]
          },
          children: [{
              id: 2,
              path: 'tinymce',
              component: '@/views/components-demo/tinymce',
              name: 'TinymceDemo',
              type: 2,
              meta: {
                title: 'tinymce'
              }
            },
            {
              id: 3,
              path: 'markdown',
              component: '@/views/components-demo/markdown',
              name: 'MarkdownDemo',
              type: 2,
              meta: {
                title: 'markdown'
              }
            },
            {
              id: 4,
              path: 'json-editor',
              component: '@/views/components-demo/json-editor',
              name: 'JsonEditorDemo',
              meta: {
                title: 'jsonEditor'
              }
            }

          ]
        }, ]
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        //var that=this;
        routes.listRoutes().then((response) => {
            console.log(response);
            this.treeData = response.data;

            console.log(this.treeData)
          })
          .catch(function(error) {
            console.log(error);
          });
      },
      append(data, type) {
        var newChild = {
          path: '/components',
          component: "Layout",
          redirect: '/',
          alwaysShow: true,
          hidden: false, //true
          name: 'ComponentDemo',
          type: 0,

          editstate: "add"

        };
        var that = this;


        if (type < 2) {

          newChild.meta = {
            title: 'ComponentDemo', //i18n
            icon: 'international', //international、、lock
            noCache: true, //忘了是什么先加着
            affix: false, //可以被删除标签
          }

        } else if (type > 0) {
          data.type = type;
        }


        if (type == 2) {

          if (!data.children) {
            this.$set(data, 'children', []);
          }
          var serveData = {
            id: data.menu_id,
            children: newChild
          }
          data.children.push(newChild);
          console.log("添加权限==>")

          var treeData = this.treeData;
          this.treeData = treeData;
          routes.addRoutes(serveData).then(function(response) {
              console.log(response);
              that.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              });
            })
            .catch(function(error) {
              console.log(error);
            });
        } else if (type == 1) {

          if (!data.children) {
            this.$set(data, 'children', []);
          }
          var serveData = {
            id: data.menu_id,
            children: newChild
          }

          console.log("添加菜单==>")
          that
          routes.addRoutes(serveData)
            .then(function(response) {
              console.log(response);
              that.$notify({
                title: '成功',
                message: '添加成功', //[ {}, {}]
                type: 'success',
                duration: 2000
              });
              newChild.menu_id = response.data.menu_id;
              data.children.push(newChild);
              var treeData = that.treeData;
              that.treeData = treeData;
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          console.log("添加一级菜单")

          newChild.type = 1; //新的菜单//type//

          var serveData = {
            id: 0,
            children: newChild
          }
          routes.addRoutes(serveData).then(function(response) {
              console.log(response);
              that.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              });
              newChild.menu_id = response.data.menu_id;

              that.treeData.push(newChild);
            })
            .catch(function(error) {
              console.log(error);
            });
        }
        // console.log("静态添加", data, newChild);
      },
      onDeletTree(node, data) {
        console.log(node, data)
        alert(data.menu_id)
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
