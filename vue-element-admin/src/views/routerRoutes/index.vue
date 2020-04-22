<template>
  <div style="padding: 25px;">
    <el-tabs type="border-card">
      <!-- <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> 我的行程</span>
        我的行程
      </el-tab-pane> -->
      <el-tab-pane label="添加菜单">
        <!-- 权限 -->
        <el-button type="text" size="mini" @click="() => onAddTree(data=null,type=0)">
          添加一级菜单
        </el-button>
        <el-tree :data="treeData" show-checkbox node-key="id" default-expand-all :expand-on-click-node="false" :props="defaultProps">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label +"===="+data.menu_id }}</span>
            <span>
              <el-button type="text" size="mini" v-if="data.meta && data.path || data.type==1 " @click="() => onAddTree(data,type=1)">
                添加菜单
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
      <el-tab-pane label="添加权限">
        <el-tree :data="treeData" show-checkbox node-key="id" default-expand-all :expand-on-click-node="false" :props="defaultProps">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>

              <el-button type="text" size="mini" v-if="!data.meta || data.type==2 " @click="() => onAddTree(data,type=2)">
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
    <el-dialog title="编辑菜单" :visible.sync="showEditTree">
      <el-form ref="formData" :model="tempMenu" label-position="left" label-width="70px" style="width: 100%; margin-left:50px;">
        <el-form-item label="url路径" style="width:60%">
          <el-input v-model="tempMenu.path" />
        </el-form-item>
        <el-form-item label="菜单名称" label-width="80" style="width:60%">
          <el-input v-model="tempMenu.name" placeholder="菜单名称" />
        </el-form-item>

        <el-form-item label="重定向url" label-width="100" style="width:60%">
          <el-input v-model="tempMenu.redirect" />
        </el-form-item>
        <el-form-item label="菜单文件路径" label-width="100" style="width:60%">
          <el-input v-model="tempMenu.component" placeholder="一级菜单为'Layout'" />
        </el-form-item>
        <el-form-item label="隐藏菜单" label-width="100">
          <el-tooltip :content="tempMenu.hidden == 1 ? '隐藏' : '显示'" placement="top">
            <el-switch @change="onUserStatus('tempMenu')" v-model="tempMenu.hidden" active-color="#7B68EE"
              inactive-color="#cccccc" :active-value="1" :inactive-value="0"></el-switch>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="title">
          <el-input v-model="tempMenuMeta.title" placeholder="网页title." />
        </el-form-item>
        <el-form-item label="菜单luog">
          <el-input v-model="tempMenuMeta.icon" placeholder="菜单luog,请参考Element ui" />
        </el-form-item>
        <el-form-item label="页面权重">
          <el-tooltip :content="tempMenuMeta.affix == 1 ? '打开页面后不能关闭' : '可以关闭页面'" placement="top">
            <el-switch v-model="tempMenuMeta.affix" active-color="#7B68EE" inactive-color="#cccccc" :active-value="1"
              :inactive-value="0"></el-switch>
          </el-tooltip>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="showEditTree = false">取消</el-button>
        <el-button type="primary" @click="onAddMenu()">确定</el-button>
      </div>
    </el-dialog>
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
        showEditTree: false,
        treeType: 0,
        tempTreedata: null,
        tempMenu: {
          path: '',
          component: "Layout",
          redirect: '/',
          alwaysShow: true,
          hidden: false,
          name: '菜单名称',
          type: 0,
          editstate: "add",
          meta: {
            title: '标题', //i18n
            icon: '图标international', //international、、lock
            noCache: true, //忘了是什么先加着
            affix: false, //可以被删除标签
          }
        },
        tempMenuMeta: {
          title: '标题', //i18n
          icon: '图标international', //international、、lock
          noCache: true, //忘了是什么先加着
          affix: false, //可以被删除标签
        }
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
      onAddTree(data, type) {
        this.showEditTree = true;
        this.treeType = type;
        this.tempTreedata = data;
        //新的菜单
        this.tempMenu = {
          path: '',
          component: "Layout",
          redirect: '/',
          alwaysShow: true,
          hidden: false,
          name: '',
          type: 0,
          editstate: "add",
          meta: {
            title: '', //i18n
            icon: '', //international、、lock
            noCache: true, //忘了是什么先加着
            affix: false, //可以被删除标签
          },
          children:[]
        }


      },
      onEditTree(data, type) {
        this.showEditTree = true;
        this.treeType = type;
        this.tempMenu = data;
      },
      onAddMenu() {
        // var newChild = {

        var that = this;

       

        if (that.treeType == 2) {
          that.tempMenu.type = 2;
          if (!that.tempTreedata.children) {
            this.$set(that.tempTreedata, 'children', []);
          }
          var serveData = {
            id: that.tempTreedata.menu_id,
            children: that.tempMenu
          }
          that.tempTreedata.children.push(that.tempMenu);
          console.log("添加权限==>")
          routes.addRoutes(serveData).then(function(response) {
              console.log(response);
              that.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              });
              that.showEditTree = false;
            })
            .catch(function(error) {
              console.log(error);
            });
        } else if (that.treeType == 1) {

          that.tempMenu.type = 1;
          var serveData = {
            id: that.tempTreedata.menu_id,
            children: that.tempMenu
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
              if (!that.tempTreedata.children) {
                this.$set(that.tempTreedata, 'children', []);
              }
              that.tempTreedata.children.push(that.tempMenu);
              that.showEditTree = false;
            })
            .catch(function(error) {
              console.log(error);
            });
        } else if(that.treeType == 0){
          console.log("添加一级菜单")
          var that = this;
          that.tempMenu.type = 1;
          //一级菜单为0
          var serveData = {
            id: 0,
            children: that.tempMenu
          }
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
              that.treeData.push(that.tempMenu);
              that.showEditTree = false;
            })
            .catch(function(error) {
              console.log(error);
            });
        }else if(that.treeType == 3){

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
              that.tempMenu.menu_id = response.data.menu_id;

              that.showEditTree = false;
            })
            .catch(function(error) {
              console.log(error);
            });
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
